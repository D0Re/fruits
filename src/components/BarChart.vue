<template>
  <div class="bar-chart-container">
    <Bar :data="chartConfig" :options="options" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || ''
                if (label) label += ': '
                if (context.dataset.label === 'Confidence') {
                  label += context.raw.toFixed(2) + '%'
                } else {
                  label += context.raw.toFixed(4)
                }
                return label
              }
            }
          }
        }
      }
    }
  },
  computed: {
    chartConfig() {
      return {
        labels: this.chartData.map(item => item.name),
        datasets: [
          {
            label: 'Lift Score',
            data: this.chartData.map(item => item.lift),
            backgroundColor: '#8884d8'
          },
          {
            label: 'Co-occurrence',
            data: this.chartData.map(item => item.co_occurrence),
            backgroundColor: '#82ca9d'
          },
          {
            label: 'Confidence',
            data: this.chartData.map(item => item.confidence),
            backgroundColor: '#ffc658'
          }
        ]
      }
    }
  }
}
</script>
<style scoped>
.bar-chart-container {
  max-width: 800px;
  width: 100%;
  height: 500px;
 padding-bottom: 100px;
  display: block;
}
</style>