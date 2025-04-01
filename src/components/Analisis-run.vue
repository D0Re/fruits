<template>
    <div class="p-4 bg-white rounded-xl  shadow-lg ">
        <h2 class="text-xl font-semibold mb-4">Анализ продаж</h2>
        <button @click="runAnalysis" class="px-4 py-2 bg-blue-500 text-white rounded">
            Запустить анализ
        </button>
        <div v-if="loading" class="text-gray-500 mt-2">Загрузка...</div>
        <div v-else-if="error" class="text-red-500 mt-2">{{ error }}</div>
        <div v-else>
            <h3 class="text-lg font-semibold mt-4">Продажи по месяцам</h3>
            <LineChart v-if="chartData" :chart-data="chartData" />
        </div>
    </div>
</template>

<script>
import axios from "axios";
import LineChart from "@/components/LineChart.vue";

export default {
    components: { LineChart },
    data() {
        return {
            analysis: {},
            loading: false,
            error: null,
            chartData: null,
        };
    },
    methods: {
        async runAnalysis() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get("http://localhost:5000/api/run-analysis");
                this.analysis = response.data;
                console.log("Данные анализа:", this.analysis);

                // Последние 4 месяца в правильном порядке
                const allMonths = Object.keys(this.analysis.monthly_product_sales).sort();
                const last4Months = allMonths.slice(-4); // Берём последние 4 месяца

                const productSales = this.analysis.monthly_product_sales;

                // Создаём наборы данных для графика
                const datasets = Object.keys(productSales[last4Months[0]] || {}).map(product => ({
                    label: product,
                    data: last4Months.map(month => productSales[month]?.[product] || 0),
                    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // случайный цвет
                    fill: false,
                    tension: 0.4
                }));

                // Обновляем данные графика
                this.chartData = {
                    labels: last4Months,
                    datasets: datasets
                };

            } catch (err) {
                this.error = "Ошибка при анализе";
                console.error(err);
            } finally {
                this.loading = false;
            }
        }

    },
};
</script>

