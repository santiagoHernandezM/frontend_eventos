<template>
  <v-app>
    <v-container>
      <v-row justify="space-around">
        <v-card width="100%">
          <v-app-bar flat color="rgb(52,188,52)">
            <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
  
            <v-toolbar-title class="text-h6 white--text pl-0">
              Estadisticas
            </v-toolbar-title>
  
            <v-spacer></v-spacer>
  
            <v-btn color="white" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text>
              <v-row>
                <v-col>
                  <v-select 
                   :items="programas"
                   item-text="nombre"
                   item-value="_id"
                   v-model="programa"
                   @change="fichasprograma()"
                   label="Programa">
                     <template v-slot:item="{ item }">
                       {{ item.nivel }} - {{ item.nombre}}
                     </template>

                    <template slot="selection" slot-scope="data">
                     {{ data.item.nivel }} - {{ data.item.nombre }}
                   </template>

                  </v-select>
               </v-col>
                 <v-col>
                    <v-select 
                     :items="fichas"
                     item-text="codigo"
                     item-value="_id"
                     v-model="ficha"
                     label="Fichas">
                    </v-select>
                 </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-select 
                  ref="lcompetencia"
                  :items="comptenciasr"
                  item-text="nombre"
                  item-value="codigo"
                  v-model="codigo"
                  @change="graficacompetencia()"
                  label="Competencias">
                 </v-select>

                </v-col>
              </v-row>
          </v-card-text>
        </v-card>
      </v-row>
      <v-row>
        <v-col>
           <BarChart 
           :chartData="chartData"
           />
        </v-col>
      </v-row>
      <v-row v-if="nombrecompetencia != null" class="justify-center">
        <v-col>
          <v-chip
          class="ma-2"
          color="#81C5E2"
        >
          COMPETENCIA : {{nombrecompetencia.nombre}}
        </v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
           <BarChart 
           :chartData="chartDataCompetencia"
           />
        </v-col>
      </v-row>
      <v-row v-if="nombrecompetencia != null" class="justify-center">
        <v-col>
          <v-chip
          class="ma-2"
          color="#9BEB33"
        >
          RESULTADOS DE APRENDIZAJE
        </v-chip>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6" v-for="data in  chartDataresultados" :key="data">
          <v-chip
          class="ma-2 multi-line-chip"
          color="#CCF19E"
        >
          {{ data.resultado }}
        </v-chip>
          <BarChart 
          :chartData="data.estructura"
          />
        </v-col>
      </v-row>

           
     
      
    </v-container>  
  </v-app>
</template>

    <script>
    import axios from "axios";
    import BarChart from '../components/graficas/grafica.vue'

    export default {
      components: { BarChart },
     data() {
        return {
            api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
            programas : [],
            fichas : [],
            programa : null,
            comptenciasr : [],
            codigo : null,
            ficha : null,
            nombrecompetencia : null,
            gestor : null,
           
            chartData: null,
            chartDataCompetencia: null,
            chartDataresultados : [],
            chartOptions : null,
       

        }
     },
     async mounted() {
      const data = await axios.get(`${this.api}/programas`);
      this.programas = data.data
     },
     methods: {
      async fichasprograma(){
        const data = await axios.get(`${this.api}/ficha/programas/${this.programa}`);
       this.fichas = data.data

      },

      cargacompetencia(data){
        this.comptenciasr = data.competencias
        console.log(this.comptenciasr)

      },

      graficaresultados(){
        var labelsAux = [];
        labelsAux.push('Duracion');
        labelsAux.push('Acumulado');
       for(let data of this.nombrecompetencia.resultados){
           let dataAux = [];
           dataAux.push(data.duracion);
           dataAux.push(data.acumulado);
           let chart = {
                      resultado : data.descripcion,
                      estructura : {
                        labels: labelsAux,
                        datasets: [{
                            borderWidth: 1,
                            borderColor: ['#00a65a','#f56954' , '#00c0ef','#f39c12'],
                            backgroundColor : ['#2596be','#eab676' , '#00c0ef','#f39c12'],
                            data: dataAux
                        }]
                    }
           }
            this.chartDataresultados.push(chart)

       }
       console.log(this.chartDataresultados)
      },

      graficacompetencia()
      {
        this.nombrecompetencia = this.comptenciasr.find(item => item.codigo === this.codigo);
        let labelsAux = [];
        let dataAux = [];
        labelsAux.push('Duracion');
        labelsAux.push('Acumulado');
        dataAux.push(this.nombrecompetencia.duracion);
        dataAux.push(this.nombrecompetencia.acumulado);
        this.chartDataCompetencia = {
                        labels: labelsAux,
                        datasets: [{
                            borderWidth: 1,
                            borderColor: ['#00a65a','#f56954' , '#00c0ef','#f39c12'],
                            backgroundColor : ['#00a65a','#f56954' , '#00c0ef','#f39c12'],
                            data: dataAux
                        }]
                    }
                   this.graficaresultados()
                  },
     },   
    

    watch: {
       async ficha(){
       
        const data = await axios.get(`${this.api}/gestor-t/${this.ficha}`);
        this.comptenciasr = data.data[0].competencias
        let labelsAux = [];
        let dataAux = [];
        labelsAux.push('Duracion');
        labelsAux.push('Acumulado');
        data.data.map((item)=>{
                       
              dataAux.push(item.duracion);
              dataAux.push(item.acumulado);
                    })
                    this.chartData = {
                        labels: labelsAux,
                        datasets: [{
                            borderWidth: 1,
                            borderColor: ['#00a65a','#f56954' , '#00c0ef','#f39c12'],
                            backgroundColor : ['#00a65a','#f56954' , '#00c0ef','#f39c12'],
                            data: dataAux
                        }]
                    },
                    this.chartOptions = {
                       
                        responsive: true,
                        maintainAspectRatio: false,
                        datasetFill: false
                       }

                     

       }
    },
    }
    </script>

    <style scoped>
  
    .multi-line-chip {
      white-space: normal;
      display: block;
      width: auto;
      height: auto;
      margin: 2px;
    }
  </style>