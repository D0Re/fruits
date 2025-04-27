<template>
    <div class="conntent">
        <!-- График -->
        <apexchart type="scatter" :options="chartOptions" :series="chartData" height="350"></apexchart>

        <!-- Таблица с данными пользователей -->
        <div style="margin-top: 20px; width: 100%; text-align: left; height: 500px;  overflow: auto;">
            <table v-if="userData.length > 0" border="1"
                style="margin-top: 20px; width: 100%; text-align: left; height: 500px;  overflow: auto;">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Recency</th>
                        <th>Frequency</th>
                        <th>Monetary</th>
                        <th>Segment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in userData" :key="user.user_id">
                        <td>{{ user.user_id }}</td>
                        <td>{{ user.recency }}</td>
                        <td>{{ user.frequency }}</td>
                        <td>{{ user.monetary }}</td>
                        <td>{{ user.segment }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
    components: {
        apexchart: VueApexCharts,
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    height: 350,
                    type: 'scatter',
                    zoom: {
                        enabled: true,
                        type: 'xy',
                    },
                },
                xaxis: {
                    min: 0,
                    max: 200, // Примерное максимальное значение recency
                    labels: {
                        show: false // скрыть все подписи на оси X
                    }
                },
                yaxis: {
                    min: 0,
                    max: 200, // Примерное максимальное значение monetary
                    labels: {
                        formatter: function (value) {
                            // Округляем до целого и убираем десятичные нули
                            return Math.round(value).toString();

                            // Или альтернативный вариант:
                            // return value % 1 === 0 ? value.toString() : value.toFixed(2);
                        }
                    }
                },
                markers: {
                    size: 5,
                    hover: {
                        size: 7,
                    },
                },
                tooltip: {
                    shared: true,
                    intersect: false,
                    x: {
                        show: true,
                    },
                    y: {
                        formatter: (value) => `Monetary: ${value}`,
                    },
                },
                fill: {
                    type: 'gradient',
                    gradient: {
                        shade: 'light',
                        type: 'horizontal',
                        opacityFrom: 0.7,
                        opacityTo: 0.2,
                        stops: [0, 100],
                    },
                },
            },
            chartData: [], // Данные для графика
            userData: []   // Данные пользователей для таблицы
        };
    },
    mounted() {
        this.fetchChartData();
    },
    methods: {
        async fetchChartData() {
            try {
                const response = await fetch('http://localhost:5000/api/rfm-data');
                const data = await response.json();

                // Преобразуем данные для отображения на графике
                const processedData = data.chart_data.map(item => {
                    // Проверяем, есть ли значения для recency и monetary
                    if (item.recency !== undefined && item.monetary !== undefined) {
                        return {
                            x: item.recency,
                            y: item.frequency,
                            segment: item.segment,
                        };
                    }
                    return null;  // Игнорируем элементы с некорректными значениями
                }).filter(item => item !== null); // Убираем элементы с null

               

                // Разделяем данные по сегментам для визуализации
                const segments = [...new Set(processedData.map(item => item.segment))];
              

                const series = segments.map(segment => {
                    const dataForSegment = processedData.filter(item => item.segment === segment).map(item => ({
                        x: item.x,
                        y: item.y,
                        segment: item.segment,
                    }));

                  

                    return {
                        name: segment,
                        data: dataForSegment,
                    };
                });

                // Обновляем данные для графика
                this.chartData = series;

                // Получаем данные для таблицы
                this.userData = data.chart_data.map(item => ({
                    user_id: item.user_id,
                    recency: item.recency,
                    frequency: item.frequency,
                    monetary: item.monetary,
                    segment: item.segment
                }));

            } catch (error) {
                console.error('Ошибка при загрузке данных для графика:', error);
            }
        }
    }
};
</script>
<style scoped>
.conntent {
    max-width: 800px;
    width: 100%;
   margin: 0 auto;
    padding-bottom: 100px;
    display: block;
}
</style>