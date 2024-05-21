<template>
    <v-app>
        <v-container>
          <v-row justify="space-around">
            <v-card width="100%">
              <v-app-bar flat color="rgb(52,188,52)">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
      
                <v-toolbar-title class="text-h6 white--text pl-0">
                  RESUMEN FICHA
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
                           {{ item.nivel }} - {{ item.nombre}} - {{ item.intensidad_horaria }}
                         </template>
    
                        <template slot="selection" slot-scope="data">
                         {{ data.item.nivel }} - {{ data.item.nombre }} - {{ data.item.intensidad_horaria }}
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
                    <v-chip
                     color="red"
                     class="mr-5  white--text font-weight-black"
                     >
                    0% > &lt;= 40%
                  </v-chip>
                  <v-chip
                     color="yellow"
                     class="mr-5  black--text font-weight-black"
                     >
                    40% > &lt;= 80%
                  </v-chip>
                  <v-chip
                  color="green"
                  class="white--text font-weight-black"
                  >
                 80% > &lt;= 100%
               </v-chip>
                  </v-col>
                  <v-col>
                  </v-col>

                  </v-row>
                  <v-simple-table  fixed-header
                  v-for="ele in resultados" :key="ele.codigo"
                   >
                   <thead>
                    <tr>
                      <th class="text-left" style="width:90%">
                        <H5><strong>COMPETENCIA</strong></H5>
                      </th>
                      <th class="text-left">
                        <H5><strong>DURACION</strong></H5>
                      </th>
                      <th class="text-left">
                        <H5><strong>AVANCE</strong></H5>
                      </th>
                    </tr>
                  </thead>
                  <tbody >
                     <tr>
                       <td class="textmayuscula">{{ ele.nombre }}</td>
                       <td>{{ ele.duracion }}</td>
                       <td :class="color(ele.duracion,ele.acumulado)">{{ ele.acumulado }}</td>
                    </tr>
                     <strong>Resultados de Aprendizaje </strong>
                    <tr  v-for="r in ele.resultados" :key="r.orden">
                       <td>
                         {{ r.descripcion }}
                       </td>
                       <td>
                        {{ r.duracion }}
                      </td>
                      <td :class="color(r.duracion,r.acumulado)">
                        {{ r.acumulado }}
                      </td>
                    </tr>
                 </tbody>
                  </v-simple-table>

                               
                
              </v-card-text>
            </v-card>
          </v-row>
        </v-container>
    </v-app>
</template>
<script>
  import axios from "axios";
export default {
    data() {
        return {
            api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
            programas : [],
            fichas : [],
            programa : null,
            ficha : null,
            resultados : null
          
        }
    },
    
     async mounted() {
      let programas = this.$store.getters.usuario.programas;
      console.log(programas)
     // const data = await axios.get(`${this.api}/programas`);
      this.programas = programas
      
     },
     methods: {
        color(dur, acu){
           let por =  (acu * 100)/dur;
           if (por >= 0 && por <= 40 )
             return "rojo"
           else
             if (por > 40 && por <=80)
              return "amarillo"
            else
              return "verde"
        },

        

        async fichasprograma(){
        this.resultados = null
        this.ficha = null
        const data = await axios.get(`${this.api}/ficha/programas/${this.programa}`);
        this.fichas = data.data
       

      },
     },
     watch: {
       async ficha(){
          const data = await axios.get(`${this.api}/gestor-t/${this.ficha}`);
          this.resultados = data.data[0].competencias
         
        }
       }
}
</script>
<style scoped>
 .textmayuscula{
    text-transform: uppercase;
    background-color: gray;
 }
 .amarillo{
    background-color: yellow;
 }

 .rojo{
    background-color: red;
 }

 .verde{
    background-color: green;
 }
 
</style>
