  <template>
    <Bar 
    :chart-options="chartOptions"
    :chart-data="chartData"
    :width="width"
    :height="height" />
  </template>
  <script>
  import { Bar } from 'vue-chartjs/legacy'
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
    components: {
      Bar
    },
    props: {
      chartData: {
        type: Object,
        default: null
      },
          
      width: {
        type: Number,
        default: 400
      },
      height: {
        type: Number,
        default: 400
      },
     
     
    },
    data() {
      return {
       
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false
        }
      }
    }
  }
  </script>