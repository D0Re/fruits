import csv
from faker import Faker
import numpy as np
from datetime import datetime, timedelta
from collections import defaultdict

fake = Faker('ru_RU')
np.random.seed(42)

# 1. Генерация пользователей (1000 записей, ID 16-1015)
with open('users.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['id','name','email','password','role_id','created_at'])
    for i in range(16, 1016):
        writer.writerow([
            i,
            fake.name(),
            fake.unique.email(),
            '$2a$10$' + fake.sha256()[:25],
            1,
            fake.date_time_between(start_date='-400d', end_date='-30d').strftime('%Y-%m-%d %H:%M:%S')
        ])

# Сначала генерируем order_items и сохраняем суммы заказов
order_totals = defaultdict(float)
order_metadata = defaultdict(lambda: {
    'phone': fake.phone_number(),
    'delivery_method': np.random.choice(['pickup', 'courier', 'post'], p=[0.6, 0.3, 0.1]),
    'payment_method': np.random.choice(['cash', 'card', 'online'], p=[0.5, 0.3, 0.2])
})

product_ids = list(range(1, 104))
popular_products = [12, 43, 7, 1, 3, 28, 40]
product_probs = np.array([0.03 if pid in popular_products else 0.01 for pid in product_ids])
product_probs /= product_probs.sum()

with open('order_items.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['order_id','product_id','quantity','price'])
    
    for order_id in range(45, 20045):
        n_items = min(max(int(np.random.normal(3, 1)), 1), 8)
        selected_products = np.random.choice(product_ids, size=n_items, replace=False, p=product_probs)
        
        for product_id in selected_products:
            if np.random.random() < 0.2:
                bundles = {
                    12: [43, 7],  # Индейка + сыр + курица
                    1: [3, 23],   # Молоко + яйца + йогурт
                    28: [40, 96]  # Яблоки + бананы + черри
                }
                if product_id in bundles:
                    selected_products = np.append(selected_products, bundles[product_id])
            
            quantity = max(1, int(np.random.normal(2, 0.5)))
            price = round(np.random.uniform(50, 2000), 2)
            writer.writerow([order_id, product_id, quantity, price])
            
            # Суммируем стоимость товаров
            order_totals[order_id] += quantity * price

# 2. Генерация заказов с полной структурой
start_date = datetime(2024, 9, 1)
end_date = datetime(2025, 9, 30)
user_ids = list(range(16, 1016))
user_probs = [0.15] + [0.85/999] * 999

with open('orders.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['id','user_id','status','total_price','created_at','phone','delivery_method','payment_method'])
    
    for order_id in range(45, 20045):
        days_diff = (end_date - start_date).days
        random_days = np.random.randint(0, days_diff)
        created_at = start_date + timedelta(days=random_days)
        created_at += timedelta(
            hours=np.random.randint(8, 22),
            minutes=np.random.randint(0, 59)
        )
        
        user_id = np.random.choice(user_ids, p=user_probs)
        status = np.random.choice(
            ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
            p=[0.05, 0.6, 0.1, 0.2, 0.05]
        )
        
        # Получаем метаданные для заказа
        metadata = order_metadata[order_id]
        
        writer.writerow([
            order_id,
            user_id,
            status,
            round(order_totals[order_id], 2),  # Реальная сумма заказа
            created_at.strftime('%Y-%m-%d %H:%M:%S'),
            metadata['phone'],
            metadata['delivery_method'],
            metadata['payment_method']
        ])

# 3. Генерация wishlist (15000 записей)
with open('wishlist.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['user_id','product_id','added_at'])
    
    for _ in range(15000):
        user_id = np.random.randint(16, 1016)
        product_id = np.random.choice(product_ids, p=product_probs)
        added_at = fake.date_time_between(
            start_date='-400d',
            end_date='now'
        ).strftime('%Y-%m-%d %H:%M:%S')
        writer.writerow([user_id, product_id, added_at])