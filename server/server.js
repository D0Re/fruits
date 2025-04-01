const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка CORS и JSON-парсера
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5000
});

// Проверка подключения к БД
pool.connect()
  .then(() => console.log('✅ Подключение к БД установлено'))
  .catch(err => console.error('❌ Ошибка подключения к БД:', err));

// Главная страница
app.get('/', (req, res) => {
  res.send('Сервер работает!');
});



// Регистрация пользователя
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Полный req.body:', JSON.stringify(req.body, null, 2));
  try {
    // Проверяем, существует ли пользователь
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создаём пользователя (ИСПРАВЛЕНО: добавлена запятая перед NOW())
    const result = await pool.query(
      'INSERT INTO users (name, email, password, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [name, email, hashedPassword]
    );

    res.json({ message: 'Регистрация успешна', userId: result.rows[0].id });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Авторизация пользователя
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Запрашиваем пользователя из базы данных, включая email
    const user = await pool.query('SELECT id, name, email, password, role_id FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Возвращаем данные пользователя, включая email
    res.json({
      message: 'Вход выполнен успешно',
      user: {
        id: user.rows[0].id,
        name: user.rows[0].name,
        email: user.rows[0].email, // Добавляем email в ответ
        role_id:user.rows[0].role_id,
      },
    });
  } catch (error) {
    console.error('Ошибка при входе:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');

    const products = result.rows.map(product => ({
      ...product,
      created_at: product.created_at.toISOString().split('T')[0], // "2025-03-16"
      sale: product.sale ? product.sale.toISOString().split('T')[0] : null // "2025-02-14" (если sale не null)
    }));

    res.json(products);
  } catch (error) {
    console.error('Ошибка при получении товаров:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});
// Получение заказов пользователя
app.get('/api/orders', async (req, res) => {
  const { user_id } = req.query;

  try {
    // Получаем основные данные заказа
    const ordersResult = await pool.query(
      `SELECT 
        id, 
        user_id, 
        status, 
        total_price, 
        phone,
        delivery_method,
        payment_method,
        created_at
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [user_id]
    );

    // Получаем товары для каждого заказа
    const ordersWithItems = await Promise.all(
      ordersResult.rows.map(async (order) => {
        const itemsResult = await pool.query(
          `SELECT 
            oi.quantity, 
            p.name, 
            p.price, 
            p.image
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        return {
          ...order,
          items: itemsResult.rows
        };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


app.post('/create-order', async (req, res) => {
  const {
    user_id,
    phone,
    items,
    deliveryMethod,
    paymentMethod
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Рассчитываем общую сумму
    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    // Добавляем стоимость доставки, если нужно
    if (deliveryMethod === 'delivery') {
      totalPrice += 500;
    }

    // Создаем заказ
    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, 
        status, 
        total_price, 
        phone,
        delivery_method,
        payment_method,
        created_at
      ) VALUES ($1, 'pending', $2, $3, $4, $5, NOW()) RETURNING id`,
      [user_id, totalPrice, phone, deliveryMethod, paymentMethod]
    );

    // Добавляем товары в order_items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (
          order_id, 
          product_id, 
          quantity, 
          price
        ) VALUES ($1, $2, $3, $4)`,
        [orderResult.rows[0].id, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');
    res.json({
      message: 'Заказ успешно создан',
      order_id: orderResult.rows[0].id
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Ошибка при создании заказа:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  } finally {
    client.release();
  }
});

// Запуск Python-анализа по запросу
app.get('/api/run-analysis', (req, res) => {
  const scriptPath = path.join('../python_analytics/main.py');
  console.log(`Запуск Python: python ${scriptPath}`); // Логируем команду

  exec(`python ${scriptPath}`, (error, stdout, stderr) => {
    console.log('stdout:', stdout); // Что выводит Python?
    console.log('stderr:', stderr); // Есть ли ошибки?
    console.log('error:', error);   // Ошибка выполнения?

    if (error) {
      console.error(`Ошибка выполнения Python-скрипта: ${error.message}`);
      return res.status(500).json({ message: 'Ошибка анализа' });
    }
    if (stderr) {
      console.error(`Ошибка в скрипте: ${stderr}`);
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error('Ошибка парсинга JSON из Python:', parseError);
      res.status(500).json({ message: 'Ошибка обработки данных' });
    }
  });
});


// Добавление в wishlist
app.post('/api/wishlist', async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    // Проверяем, есть ли уже такой товар у пользователя
    const existing = await pool.query(
      'SELECT * FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Товар уже в списке желаний' });
    }

    const result = await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) RETURNING *',
      [user_id, product_id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка добавления в wishlist:', error);
    if (error.response) {
      console.error('Ответ сервера:', error.response.data);
    }
  }
   
});

// Удаление из wishlist
app.delete('/api/wishlist', async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [user_id, product_id]
    );

    res.json({ message: 'Товар удален из списка желаний' });
  } catch (error) {
    console.error('Ошибка удаления из wishlist:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получение wishlist пользователя
app.get('/api/wishlist/:user_id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.* 
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1
       ORDER BY w.added_at DESC`,
      [req.params.user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка получения wishlist:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Запуск сервера
app.listen(PORT, () => console.log(`🚀 Сервер запущен на http://localhost:${PORT}`));
