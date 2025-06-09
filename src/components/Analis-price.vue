<template>
    <div class="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto">
        <h2 class="text-xl font-semibold mb-4">Прогноз цен</h2>

        <div class="flex flex-wrap gap-4 mb-4 items-center">
            <select v-model="selectedProduct" class="border rounded px-3 py-2" @change="fetchForecast">
                <option v-for="product in productList" :key="product" :value="product">
                    {{ product }}
                </option>
            </select>

           

            <button @click="fetchForecast" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                :disabled="loading">
                <span v-if="!loading">Обновить прогноз</span>
                <span v-else>Загрузка...</span>
            </button>
        </div>

        <div v-if="error" class="p-4 mb-4 text-red-600 bg-red-50 rounded-lg">
            {{ error }}
        </div>

        <div v-if="productInfo" class="space-y-6">
            <div class="p-4 bg-gray-50 rounded-lg">
                <h3 class="text-lg font-semibold mb-2">{{ productInfo.name }}</h3>
                <p>ID: {{ productInfo.id }}</p>
                <p>Базовая цена: {{ productInfo.base_price }} RUB</p>
            </div>

            <div v-if="chartData" class="bg-white p-4 rounded-lg border">
                <h3 class="text-lg font-semibold mb-4">Динамика цен</h3>
                <div class="h-96">
                    <LineChart :chart-data="chartData" :options="chartOptions" />
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import LineChart from '@/components/LineChart.vue'

export default {
    components: { LineChart },
    data() {
        return {
            selectedProduct: '',
            productList: [],
            productInfo: null,
            priceDetails: [],
            chartData: null,
            chartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.dataset.label || '';
                                return `${label}: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    yPrice: {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Цена (RUB)'
                        },
                        ticks: {
                            callback: value => `${value}₽`
                        }
                    },
                    yDemand: {
                        type: 'linear',
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Спрос (шт.)'
                        },
                        grid: {
                            drawOnChartArea: false // отключаем сетку справа
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Дата'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45
                        }
                    }
                }
            }
,
          
            loading: false,
            error: null
        }
    },
    async mounted() {
        await this.fetchProductList()
        this.setDefaultDates()
    },
    methods: {
        setDefaultDates() {
            const end = new Date()
            const start = new Date()
            start.setDate(end.getDate() - 30)

            this.startDate = start.toISOString().split('T')[0]
            this.endDate = end.toISOString().split('T')[0]
        },
        async fetchProductList() {
            try {
                this.loading = true
                const response = await axios.get('http://localhost:5000/api/products')
                // здесь response.data — массив объектов
                this.productList = response.data.map(p => p.name) // или сохраняйте весь объект, если нужно больше полей

                if (this.productList.length) {
                    this.selectedProduct = this.productList[0]
                    await this.fetchForecast()
                }
            } catch (err) {
                this.error = 'Не удалось загрузить список продуктов'
                console.error(err)
            } finally {
                this.loading = false
            }
        }
,
        async fetchForecast() {
            if (!this.selectedProduct) return

            try {
                this.loading = true
                this.error = null

                const response = await axios.get('http://localhost:5000/api/price-forecast')

                if (response.data.status === 'error') {
                    throw new Error(response.data.error)
                }

                const productData = response.data.data[this.selectedProduct]
                if (!productData) {
                    throw new Error('Данные по продукту не найдены')
                }

                this.productInfo = {
                    name: this.selectedProduct,
                    id: productData.product_id,
                    base_price: productData.base_price
                }

                // Преобразуем данные для таблицы
                this.priceDetails = Object.entries(productData.forecast)
                    .map(([date, info]) => ({
                        date,
                        price: info.price,
                        priceChange: info.price_change_percent,
                        demand: info.predicted_demand
                    }))
                    .sort((a, b) => new Date(a.date) - new Date(b.date))

                // Фильтрация по дате
                const filtered = this.priceDetails.filter(detail => {
                    if (!this.startDate || !this.endDate) return true
                    return detail.date >= this.startDate && detail.date <= this.endDate
                })

                // Подготовка данных для графика
                // Подготовка данных для графика
                this.chartData = {
                    labels: filtered.map(d => d.date),
                    datasets: [
                        {
                            label: 'Цена (RUB)',
                            data: filtered.map(d => d.price),
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            yAxisID: 'yPrice',
                            borderWidth: 2,
                            pointBackgroundColor: '#3b82f6',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Прогноз спроса',
                            data: filtered.map(d => d.demand),
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            yAxisID: 'yDemand',
                            borderWidth: 2,
                            pointBackgroundColor: '#10b981',
                            pointRadius: 3,
                            pointHoverRadius: 5,
                            tension: 0.3,
                            fill: true
                        }
                    ]
                }


            } catch (err) {
                this.error = `Ошибка загрузки прогноза: ${err.message}`
                console.error(err)
            } finally {
                this.loading = false
            }
        }
    }
}
</script>

<style scoped>
.h-96 {
    height: 24rem;
}
</style>