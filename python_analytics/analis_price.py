import pandas as pd
import json
from sqlalchemy import create_engine
import sys
import io
from datetime import datetime, timedelta
from prophet import Prophet


# Настройка вывода в консоль
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Подключение к PostgreSQL
DB_URL = "postgresql://vue_user:d7772001@localhost:5432/vue_db"
engine = create_engine(DB_URL)

def forecast_sales():
    try:
        df = pd.read_sql("SELECT order_time, quantity FROM sales_analytics", engine)
        df["order_time"] = pd.to_datetime(df["order_time"])
        df = df.groupby(df["order_time"].dt.date)["quantity"].sum().reset_index()
        df.columns = ["ds", "y"]

        model = Prophet(daily_seasonality=True)
        model.fit(df)

        future = model.make_future_dataframe(periods=30)  # Прогноз на 30 дней
        forecast = model.predict(future)

        return forecast[["ds", "yhat"]].tail(30)
    except Exception as e:
        raise Exception(f"Ошибка прогнозирования: {str(e)}")

def calculate_dynamic_price(base_price, predicted_demand):
    try:
        if predicted_demand > 100:
            return round(base_price * 1.2, 2)
        elif predicted_demand < 20:
            return round(base_price * 0.8, 2)
        return base_price
    except Exception as e:
        raise Exception(f"Ошибка расчета цены: {str(e)}")

def generate_dynamic_prices():
    try:
        forecast_df = forecast_sales()
        products_df = pd.read_sql("SELECT id, name, price FROM products", engine)

        result = {}
        for _, product in products_df.iterrows():
            product_name = product['name']
            result[product_name] = {
                'product_id': int(product['id']),
                'base_price': float(product['price']),
                'forecast': {}
            }

            for _, row in forecast_df.iterrows():
                date = row['ds'].date().isoformat()
                predicted_demand = max(0, int(row['yhat']))
                dynamic_price = calculate_dynamic_price(
                    float(product['price']), 
                    predicted_demand
                )
                
                result[product_name]['forecast'][date] = {
                    'price': dynamic_price,
                    'predicted_demand': predicted_demand,
                    'price_change_percent': round(
                        (dynamic_price - float(product['price'])) / float(product['price']) * 100, 
                        2
                    )
                }

        return result
    except Exception as e:
        raise Exception(f"Ошибка генерации цен: {str(e)}")

if __name__ == "__main__":
    try:
        forecast = generate_dynamic_prices()
        print(json.dumps({
            "status": "success",
            "data": forecast
        }, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": str(e)
        }, ensure_ascii=False))