import pandas as pd
import json
from sqlalchemy import create_engine
import sys
import io
from datetime import datetime, timedelta

# Настройка вывода в консоль
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Подключение к PostgreSQL
DB_URL = "postgresql://vue_user:d7772001@localhost:5432/vue_db"
engine = create_engine(DB_URL)



def run_analysis(selected_month=None):
    try:
        # Загружаем данные
        df = pd.read_sql("SELECT * FROM sales_analytics", engine)
        products_df = pd.read_sql("SELECT id, name FROM products", engine)

        # Словарь {product_id: name}
        product_names = dict(zip(products_df["id"], products_df["name"]))
        df["product_name"] = df["product_id"].map(product_names)

        # Преобразуем дату
        df["order_time"] = pd.to_datetime(df["order_time"])
        df["date"] = df["order_time"].dt.date
        
        # Если месяц не выбран, берем текущий месяц
        if selected_month:
            selected_date = datetime.strptime(selected_month, "%Y-%m")
            start_date = selected_date.replace(day=1)
            end_date = (selected_date + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        else:
            today = datetime.today()
            start_date = today.replace(day=1)
            end_date = (today + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        # Фильтруем данные по выбранному месяцу
        df = df[(df["order_time"] >= start_date) & (df["order_time"] <= end_date)]

        # Продажи по дням
        daily_sales = df.groupby("date")["quantity"].sum().to_dict()
        
        # Продажи по товарам по дням
        daily_product_sales = (
            df.pivot_table(
                index="date",
                columns="product_name",
                values="quantity",
                aggfunc="sum",
                fill_value=0
            )
            .astype(int)
            .to_dict(orient="index")
        )

        # Общая выручка
        total_revenue = int(df["total_price"].sum())

        # Топ товар по выручке
        top_revenue = df.groupby("product_id")["total_price"].sum()
        top_revenue_product_id = int(top_revenue.idxmax())
        top_revenue_product = product_names.get(top_revenue_product_id, f"ID {top_revenue_product_id}")

        # Средняя продажа в день
        sales_per_day = df.groupby("date")["quantity"].sum().mean()

        # Доп. статистика:
        discounted_sales = int(df[df["is_discounted"] == True]["quantity"].sum())
        new_product_sales = int(df[df["is_new_product"] == True]["quantity"].sum())

        popular_categories = (
            df.groupby("category")["quantity"].sum()
              .sort_values(ascending=False)
              .head(5)
              .to_dict()
        )

        popular_products = (
            df.groupby("product_name")["quantity"].sum()
              .sort_values(ascending=False)
              .head(10)
              .to_dict()
        )

        # Преобразуем даты в строки
        daily_sales = {key.strftime('%Y-%m-%d'): value for key, value in daily_sales.items()}
        daily_product_sales = {key.strftime('%Y-%m-%d'): value for key, value in daily_product_sales.items()}

        # Результат
        analysis_result = {
            "daily_sales": daily_sales,
            "daily_product_sales": daily_product_sales,
            "total_revenue": total_revenue,
            "top_revenue_product": top_revenue_product,
            "average_sales_per_day": round(sales_per_day, 2),
            "discounted_sales": discounted_sales,
            "new_product_sales": new_product_sales,
            "popular_categories": popular_categories,
            "popular_products": popular_products,
            "selected_month": selected_month if selected_month else datetime.today().strftime("%Y-%m")
        }

        return analysis_result

    except Exception as e:
        print(f"Ошибка анализа: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    # Получаем аргумент командной строки (месяц в формате YYYY-MM)
    selected_month = sys.argv[1] if len(sys.argv) > 1 else None
    analysis_result = run_analysis(selected_month)
    print(json.dumps(analysis_result, ensure_ascii=False, indent=2))