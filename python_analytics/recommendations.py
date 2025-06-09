import sys
import pandas as pd
from sqlalchemy import create_engine
from itertools import combinations
from collections import defaultdict
import json

def get_db_connection():
    try:
        DB_URL = ""
        return create_engine(DB_URL)
    except Exception as e:
        print(json.dumps({"error": f"Ошибка подключения к БД: {str(e)}"}))
        sys.exit(1)

def get_recommendations():
    try:
        engine = get_db_connection()
        
        query = """
        SELECT oi.order_id, p.id as product_id, p.name as product_name 
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        """
        df = pd.read_sql(query, engine)
        
        if df.empty:
            return {"recommendations": [], "message": "Нет данных для анализа"}
        
        orders = df.groupby('order_id')['product_name'].apply(set)
        pair_counts = defaultdict(int)
        item_counts = defaultdict(int)
        
        for products in orders:
            for pair in combinations(products, 2):
                sorted_pair = tuple(sorted(pair))
                pair_counts[sorted_pair] += 1
            for item in products:
                item_counts[item] += 1
        
        filtered_pairs = {k: v for k, v in pair_counts.items() if v >= 5}
        
        recommendations = []
        for (p1, p2), count in filtered_pairs.items():
            try:
                lift = (count / len(orders)) / ((item_counts[p1]/len(orders)) * (item_counts[p2]/len(orders)))
                confidence = (count / item_counts[p1]) * 100
                
                recommendations.append({
                    'name': f"{p1} → {p2}",
                    'lift': lift,
                    'co_occurrence': count,
                    'confidence': confidence
                })
            except ZeroDivisionError:
                continue

        recommendations.sort(key=lambda x: x['lift'], reverse=True)
        return {"recommendations": recommendations[:20]}
        
    except Exception as e:
        print(json.dumps({"error": f"Ошибка при выполнении анализа: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    result = get_recommendations()
    # Изменить способ вывода, чтобы избежать ошибки с кодировкой
    sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
    print(json.dumps(result, ensure_ascii=False, indent=2))
