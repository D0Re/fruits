import pandas as pd
import json
from sqlalchemy import create_engine
import sys
import io
from datetime import datetime, timedelta

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Подключение к PostgreSQL

engine = create_engine(DB_URL)

def run_analysis():
    try:
        # Загружаем данные из БД
        df = pd.read_sql("SELECT product_id, sales_count, revenue, sale_date FROM sales_analytics", engine)
        products_df = pd.read_sql("SELECT id, name FROM products", engine)

        # Словарь {product_id: name}
        product_names = dict(zip(products_df["id"], products_df["name"]))

        # Преобразуем дату
        df["sale_date"] = pd.to_datetime(df["sale_date"])

        # Устанавливаем первое число месяца в формате YYYY-MM-DD
        df["month_first_day"] = df["sale_date"].apply(lambda x: x.replace(day=1))

        # Фильтрация данных за последние 4 месяца
        today = datetime.today()
        last_4_months = [(today - timedelta(days=30 * i)).strftime("%Y-%m") for i in range(4)]
        df = df[df["month_first_day"].dt.strftime("%Y-%m").isin(last_4_months)]

        # Продажи по первому числу месяца (общее количество продаж)
        monthly_sales = df.groupby("month_first_day")["sales_count"].sum().to_dict()

        # Продажи товаров по первому числу месяца
        monthly_product_sales = (
            df.groupby(["month_first_day", "product_id"])["sales_count"].sum()
            .reset_index()
            .replace({"product_id": product_names})
            .pivot(index="month_first_day", columns="product_id", values="sales_count")
            .fillna(0)
            .astype(int)
            .to_dict(orient="index")
        )

        # Общая статистика
        total_revenue = int(df["revenue"].sum())
        top_revenue_product_id = int(df.groupby("product_id")["revenue"].sum().idxmax())
        top_revenue_product = product_names.get(top_revenue_product_id, f"ID {top_revenue_product_id}")
        sales_per_day = df.groupby(df["sale_date"].dt.date)["sales_count"].sum().mean()

        # Преобразуем все ключи с Timestamp в строку в формате dd mm yyyy
        monthly_sales = {key.strftime('%d %m %Y'): value for key, value in monthly_sales.items()}
        monthly_product_sales = {key.strftime('%d %m %Y'): value for key, value in monthly_product_sales.items()}

        # Формируем результат
        analysis_result = {
            "monthly_sales": monthly_sales,  # {первое число месяца: сумма продаж}
            "monthly_product_sales": monthly_product_sales,  # {первое число месяца: {товар: количество}}
            "total_revenue": total_revenue,
            "top_revenue_product": top_revenue_product,
            "average_sales_per_day": round(sales_per_day, 2),
        }

        return analysis_result

    except Exception as e:
        print(f"Ошибка анализа: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    analysis_result = run_analysis()
    print(json.dumps(analysis_result, ensure_ascii=False, indent=2))
