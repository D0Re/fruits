<template>
    <div class="p-6 bg-white rounded-xl shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Анализ продаж</h2>

        <div class="flex gap-4 mb-4">
            <input type="month" v-model="selectedMonth" class="border rounded px-3 py-2" @change="runAnalysis">
            <button @click="runAnalysis" class="px-4 py-2 bg-blue-500 text-white rounded">
                Обновить анализ
            </button>
        </div>

        <div v-if="loading" class="text-gray-500 mt-2">Загрузка...</div>
        <div v-else-if="error" class="text-red-500 mt-2">{{ error }}</div>
        <div v-else>
            <h3 class="text-lg font-semibold mt-4">Продажи по дням за {{ formattedMonth }}</h3>
            <LineChart v-if="chartData" :chart-data="chartData" class="mb-6" />

            <!-- Блок с ключевой статистикой -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Самый продаваемый продукт -->
                <div class="bg-blue-50 p-4 rounded-lg">
                    <h4 class="font-medium text-blue-800 mb-2">Топ продукт месяца</h4>
                    <div class="flex items-center">
                        <div class="bg-blue-100 p-3 rounded-full mr-3">
                          
                        </div>
                        <div>
                            <p class="text-lg font-semibold">{{ analysis.top_revenue_product }}</p>
                            <p class="text-sm text-gray-600">{{ formatNumber(topProductSales) }} продаж</p>
                        </div>
                    </div>
                </div>

                <!-- Популярные категории -->
                <div class="bg-green-50 p-4 rounded-lg">
                    <h4 class="font-medium text-green-800 mb-2">Топ категории</h4>
                    <ul class="space-y-1">
                        <li v-for="(count, category) in analysis.popular_categories" :key="category"
                            class="flex justify-between">
                            <span>{{ category }}</span> -
                            <span class="font-medium">{{ formatNumber(count) }}</span>
                        </li>
                    </ul>
                </div>

                <!-- Общий доход -->
                <div class="bg-purple-50 p-4 rounded-lg">
                    <h4 class="font-medium text-purple-800 mb-2">Финансы</h4>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <span>Общий доход:</span>
                            <span class="text-lg font-bold text-purple-600">{{ formatCurrency(analysis.total_revenue)
                                }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Средний доход в день:</span>
                            <span class="font-medium">{{ formatCurrency(averageDailyRevenue) }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span>Продажи со скидкой:</span>
                            <span class="font-medium">{{ formatNumber(analysis.discounted_sales) }}</span>
                        </div>
                    </div>
                </div>
            </div>
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
            selectedMonth: new Date().toISOString().slice(0, 7) // Текущий месяц в формате YYYY-MM
        };
    },
    computed: {
        formattedMonth() {
            if (!this.analysis.selected_month) return '';
            const [year, month] = this.analysis.selected_month.split('-');
            const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
            return `${monthNames[parseInt(month) - 1]} ${year}`;
        },
        topProductSales() {
            if (!this.analysis.popular_products || !this.analysis.top_revenue_product) return 0;
            return this.analysis.popular_products[this.analysis.top_revenue_product] || 0;
        },
        averageDailyRevenue() {
            if (!this.analysis.total_revenue || !this.chartData?.labels?.length) return 0;
            return this.analysis.total_revenue / this.chartData.labels.length;
        }
    },
    methods: {
        formatNumber(num) {
            return new Intl.NumberFormat('ru-RU').format(num);
        },
        formatCurrency(amount) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                maximumFractionDigits: 0
            }).format(amount);
        },
        async runAnalysis() {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get("http://localhost:5000/api/run-analysis", {
                    params: {
                        month: this.selectedMonth
                    }
                });
                this.analysis = response.data;
                console.log("Данные анализа:", this.analysis);

                // Получаем дни месяца в правильном порядке
                const allDays = Object.keys(this.analysis.daily_product_sales).sort();

                // Создаём наборы данных для графика
                const datasets = [];

                // Сначала добавляем общие продажи
                datasets.push({
                    label: "Все продажи",
                    data: allDays.map(day => this.analysis.daily_sales[day] || 0),
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f6',
                    fill: false,
                    tension: 0.4
                });

                // Затем добавляем топ-5 товаров
                const topProducts = Object.entries(this.analysis.popular_products)
                    .slice(0, 10)
                    .map(([product]) => product);

                const colors = ['#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#5A8DEE;', '#39C2C9', '#F8D210', ' #FA744F', '#7E5BEF'];

                topProducts.forEach((product, index) => {
                    datasets.push({
                        label: product,
                        data: allDays.map(day => this.analysis.daily_product_sales[day]?.[product] || 0),
                        borderColor: colors[index],
                        backgroundColor: colors[index],
                        fill: false,
                        tension: 0.4
                    });
                });

                // Обновляем данные графика
                this.chartData = {
                    labels: allDays.map(day => day.split('-')[2]), // Показываем только день
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
    mounted() {
        this.runAnalysis();
    }
};
</script>

<style scoped>
.chart-container {
    height: 400px;
    margin-bottom: 1.5rem;
}
.grid{
    display: flex;
   
    max-width: 795px;
    
    border: 1px solid #ccc;
    border-radius: 12px;
  

}
.font-medium.mb-2{
    font-size: 24px;
        padding: 5px;
        border-bottom: 1px solid #ccc;
        padding-left: 20px;
            width: 100%;
}
.space-y-1{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
    padding:5px 20px;

}
.flex.items-center{
padding: 5px 20px;
}
.p-4:not(:last-child) {

   border-right: 1px solid #ccc;
}
</style>