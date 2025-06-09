import pandas as pd
import json
import sys
from sqlalchemy import create_engine
from datetime import datetime

def get_db_connection():
    try:
        DB_URL = ""
        engine = create_engine(DB_URL)
        return engine
    except Exception as e:
        print(json.dumps({"error": f"Ошибка подключения к БД: {str(e)}"}))
        sys.exit(1)

def perform_rfm_quantile_analysis():
    engine = get_db_connection()

    query = """
        SELECT 
            user_id,
            order_time,
            total_price
        FROM sales_analytics
    """
    with engine.connect() as conn:
        df = pd.read_sql(query, conn)

    if df.empty:
        return json.dumps({"error": "Нет данных для анализа."})

    today = datetime.now()

    rfm = df.groupby('user_id').agg({
        'order_time': lambda x: (today - x.max()).days,
        'user_id': 'count',
        'total_price': 'sum'
    }).rename(columns={
        'order_time': 'recency',
        'user_id': 'frequency',
        'total_price': 'monetary'
    }).reset_index()

    rfm['recency'] = rfm['recency'].apply(lambda x: x if x >= 0 else abs(x))

    quantiles = rfm.quantile(q=[0.25, 0.5, 0.75]).to_dict()

    def r_score(x):
        if x <= quantiles['recency'][0.25]:
            return 1
        elif x <= quantiles['recency'][0.5]:
            return 2
        elif x <= quantiles['recency'][0.75]:
            return 3
        else:
            return 4

    def fm_score(x, metric):
        if x <= quantiles[metric][0.25]:
            return 4
        elif x <= quantiles[metric][0.5]:
            return 3
        elif x <= quantiles[metric][0.75]:
            return 2
        else:
            return 1

    rfm['R'] = rfm['recency'].apply(r_score)
    rfm['F'] = rfm['frequency'].apply(lambda x: fm_score(x, 'frequency'))
    rfm['M'] = rfm['monetary'].apply(lambda x: fm_score(x, 'monetary'))
    rfm['RFM_Score'] = rfm['R'].astype(str) + rfm['F'].astype(str) + rfm['M'].astype(str)

    def segment_map(score):
        if score == '111':
            return 'Best customers'
        elif score[0] == '1':
            return 'Recent customers'
        elif score[1] == '1':
            return 'Loyal customers'
        elif score[2] == '1':
            return 'Paying customers'
        else:
            return 'Needs engagement'

    rfm['segment'] = rfm['RFM_Score'].apply(segment_map)

    # Берем топ-20 в каждом сегменте
    top_clients = (
        rfm.groupby('segment', group_keys=False)
        .apply(lambda x: x.nlargest(200, 'monetary'))
        .reset_index(drop=True)
    )

    # Формируем данные для графика
    chart_data = []
    for _, row in top_clients.iterrows():
        chart_data.append({
            "user_id": row['user_id'],
            "recency": row['recency'],
            "frequency": row['frequency'],
            "monetary": row['monetary'],
            "segment": row['segment']
        })

    return json.dumps({"chart_data": chart_data}, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    print(perform_rfm_quantile_analysis())
