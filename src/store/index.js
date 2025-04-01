import { createStore } from 'vuex';
import axios from 'axios';
export default createStore({
  state: {
    isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    cart: JSON.parse(localStorage.getItem('cart')) || [], // Загружаем корзину из localStorage
    wishlist: JSON.parse(localStorage.getItem('wishlist')) || [],
    orders: JSON.parse(localStorage.getItem('orders')) || [],
    
    },
  mutations: {
    setAuth(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
      localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
    },
    setUser(state, user) {
      state.user = user;
      localStorage.setItem('user', JSON.stringify(user));
    },
    ADD_TO_CART(state, product) {
      const existingItem = state.cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem('cart', JSON.stringify(state.cart)); // Сохраняем корзину
    },
    REMOVE_FROM_CART(state, index) {
      state.cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    INCREASE_QUANTITY(state, index) {
      state.cart[index].quantity++;
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    DECREASE_QUANTITY(state, index) {
      if (state.cart[index].quantity > 1) {
        state.cart[index].quantity--;
        localStorage.setItem('cart', JSON.stringify(state.cart));
      }
    },
    CLEAR_CART(state) {
      state.cart = [];
      localStorage.removeItem('cart'); // Очищаем localStorage
    },
    ADD_TO_WISHLIST(state, product) {
      if (!state.wishlist) state.wishlist = [];
      if (!state.wishlist.some(item => item.id === product.id)) {
        state.wishlist.push(product);
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
      }
    },

    REMOVE_FROM_WHISHLIST(state, productId) {
      if (state.whishlist) {
        state.whishlist = state.whishlist.filter(item => item.id !== productId);
        localStorage.setItem('whishList', JSON.stringify(state.whishlist));
      }
    },
    REMOVE_FROM_WISHLIST(state, productId) {
      state.wishlist = state.wishlist.filter(item => item.id !== productId);
    },
 
    SET_WISHLIST(state, products) {
      state.wishlist = products;
      localStorage.setItem('wishlist', JSON.stringify(products));
    },
    ADD_ORDER(state, order) {
      state.orders.push(order);
      localStorage.setItem('orders', JSON.stringify(state.orders)); // Сохраняем в localStorage
    },
    
    SET_CURRENT_ORDER(state, order) {
      state.currentOrder = {
        id: order.id,
        full_name: order.fullName || order.full_name,
        email: order.email,
        phone: order.phone,
        delivery_method: order.deliveryMethod || order.delivery_method,
        payment_method: order.paymentMethod || order.payment_method,
        items: order.items,
        total_price: order.totalPrice || order.total_price,
        created_at: new Date().toISOString()
      };
    },
    setOrders(state, orders) {
      state.orders = orders;
      localStorage.setItem('orders', JSON.stringify(orders)); // Сохраняем в localStorage
    },
    SET_ORDERS(state, orders) {
      state.orders = orders;
      localStorage.setItem('orders', JSON.stringify(orders)); // Сохраняем в localStorage
    }
  },
  actions: {
    async fetchOrders({ commit, state }) {
      if (!state.user?.id) return;

      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          params: { user_id: state.user.id }
        });
        commit('SET_ORDERS', response.data);
      } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
        // Добавьте обработку ошибки для пользователя
      }
    },
    login({ commit }, user) {
      commit('setAuth', true);
      commit('setUser', user);
    },
    logout({ commit }) {
      commit('setAuth', false);
      commit('setUser', null);
      commit('CLEAR_CART'); // Очищаем корзину при выходе
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    },
    addToCart({ commit }, product) {
      commit('ADD_TO_CART', product);
    },
    removeFromCart({ commit }, index) {
      commit('REMOVE_FROM_CART', index);
    },
    increaseQuantity({ commit }, index) {
      commit('INCREASE_QUANTITY', index);
    },
    decreaseQuantity({ commit }, index) {
      commit('DECREASE_QUANTITY', index);
    },
  
    addOrder({ commit }, order) {
      commit('ADD_ORDER', order);
    },
    async sendOrderToTelegram({ getters }) {
      const botToken = '8111706693:AAEH4RgjrP0lA_UtajH5smh4NUEIPcCoLug'; // Токен твоего Telegram-бота
      const chatId = '484679694'; // ID чата, куда отправлять заказы
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
 // Получаем текущий заказ
 const currentOrder = getters.currentOrder;

    

      // Проверяем, есть ли заказ
      if (!currentOrder) {
        console.error('Текущий заказ не найден');
        return;
      }

      // Формируем список товаров
      const orderDetails = currentOrder.items.map(
        item => `${item.name} x${item.quantity} — ${item.price * item.quantity}₽`
      ).join('\n');

      // Формируем текст сообщения
      const message = `🛒 *Новый заказ!* \n\n` +
        `#️⃣ *Номер заказа:* ${currentOrder.id}\n` +
        `👤 *ФИО:* ${currentOrder.full_name || currentOrder.fullName || 'Не указано'}\n` +
        `📧 *Email:* ${currentOrder.email || 'Не указан'}\n` +
        `📞 *Телефон:* ${currentOrder.phone || 'Не указан'}\n\n` +
        `🚚 *Способ доставки:* ${currentOrder.delivery_method || currentOrder.deliveryMethod || 'Не указан'}\n` +
        `💳 *Способ оплаты:* ${currentOrder.payment_method || currentOrder.paymentMethod || 'Не указан'}\n\n` +
        `🛍 *Товары:*\n${orderDetails}\n\n` +
        `💰 *Итого:* ${currentOrder.total_price || currentOrder.totalPrice || 0}₽`;

      try {
        await axios.post(apiUrl, {
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        });
        console.log('Заказ успешно отправлен в Telegram');
      } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
      }
    },

    async placeOrder({ dispatch, commit }, order) {
      commit('SET_CURRENT_ORDER', order); // Сохраняем заказ
      try {
        await dispatch('sendOrderToTelegram');
        commit('ADD_ORDER', order);
        commit('CLEAR_CART');
      } catch (error) {
        console.error('Ошибка при оформлении заказа:', error);
        throw error;
      }
    },
    async fetchWishlist({ commit, state }) {
      if (!state.user?.id) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/wishlist/${state.user.id}`);
        commit('SET_WISHLIST', response.data);
      } catch (error) {
        console.error('Ошибка загрузки wishlist:', error);
        throw error;
      }
    },

    async addToWhishList({ commit, state }, product) {
      if (!state.user?.id) {
        throw new Error('Для добавления в избранное войдите в систему');
      }

      try {
        await axios.post('http://localhost:5000/api/wishlist', {
          user_id: state.user.id,
          product_id: product.id
        });
        console.log('user_id:', state.user.id, 'product_id:', product.id);
        commit('ADD_TO_WISHLIST', product);
      } catch (error) {
        console.error('Ошибка добавления в wishlist:', error);
        console.log('user_id:', state.user.id, 'product_id:', product.id);
        throw error;
      }
    },

    async removeFromWhishList({ commit, state }, productId) {
      if (!state.user?.id) return;

      // Обновляем локальное состояние перед запросом
      commit('REMOVE_FROM_WISHLIST', productId);

      try {
        await axios.delete('http://localhost:5000/api/wishlist', {
          data: {
            user_id: state.user.id,
            product_id: productId
          }
        });
      } catch (error) {
        console.error('Ошибка удаления из wishlist:', error);
        // В случае ошибки нужно отменить изменение в Vuex (если нужно)
        commit('ADD_TO_WISHLIST', productId); // или другой логикой восстановления
        throw error;
      }
    },

    clearCart({ commit }) {
      commit('CLEAR_CART'); // Вызываем мутацию
    }
    
    
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    user: state => state.user,
    cartItems: state => state.cart,
    totalCount: state => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: state => state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    wishlistProducts: (state) => state.wishlist,
    isInWhishList: (state) => (id) => {
      return state.wishlist.some(item => item.id === id);
    },
    userOrders: state => state.orders,
    currentOrder: (state) => state.currentOrder, 
    orders: state => state.orders, 
  }
});
