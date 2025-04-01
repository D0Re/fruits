<template>
    <div class="chart-container">
        <Line v-if="chartData" :data="chartData" :options="chartOptions" />
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { Line } from "vue-chartjs";
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

// Регистрируем компоненты Chart.js
ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default defineComponent({
    components: { Line },
    props: {
        chartData: Object,
    },
    data() {
        return {
            chartOptions: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: "right" },
                    tooltip: { enabled: true }
                    
                },
                scales: {
                    x: { title: { display: true, text: "Месяцы" } },
                    y: { title: { display: true, text: "Количество продаж" }, beginAtZero: true }
                }
            }
        };
    }
});
</script>

<style>
.chart-container {
    max-width: 1200px;
    margin: 0 auto;
   
}
</style>
