<template>
    <v-container>
        <v-row justify="space-around">
          <v-card width="800">
            <!-- Encabezado -->
            <v-app-bar flat color="rgb(52,188,52)">
              <v-toolbar-title class="text-h6 white--text pl-0">
                
                 COMPETENCIAS POR PROGRAMA
                
              </v-toolbar-title>
    
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
            <v-row>
                <v-col cols="8">

                  <v-autocomplete
                    :items="programas"
                    :item-text="(programas)=>`${programas.nombre} v${programas.version}`"
                    item-value="_id"
                    label="Seleccione el programa"
                    v-model="programa"
                    append-icon="book"
                    :rules="camposRules"
                    @change="competenciasprograma()"
                  ></v-autocomplete>
                  <!-- <v-select
                    :items="programas"
                    item-text="nombre"
                    item-value="_id"
                    label="Seleccione Programa"
                    v-model="programa"
                    append-icon="book"
                    :rules="camposRules"
                    @change="competenciasprograma()"
                  >
                  </v-select> -->
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                  <v-data-table
                    :headers="headers"
                    :items="competencias"
                    :items-per-page="25"
                    class="elevation-1"
                  >

                  <template v-slot:item.accion="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="resultados(item)"
                    >
                      mdi-eye
                    </v-icon>
                    
                  </template>
                </v-data-table>
                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card width="800">
                        <v-card-title>
                            COMPETENCIA : {{ competencia }}
                        </v-card-title>
                        <v-container>
                            <v-data-table
                            :headers="headersresultados"
                            :items="resultadosprograma"
                            :items-per-page="25"
                            class="elevation-1"
                          >
                        </v-data-table>
                        </v-container>
                           
                    </v-card>
                </v-col>
            </v-row>
            </v-container>
        </v-card>
        </v-row>
        
    </v-container>    
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            api : `${process.env.VUE_APP_API_URL}`,
           programas : [],
           competencias : [],
           resultadosprograma: [],
           programa : null,
           competencia : null,
           headersresultados:[
            {
            text: 'Resultado',
            align: 'start',
            value: 'descripcion',
           },  
           {
            text: 'Duracion',
            align: 'start',
            value: 'duracion',
           },  
           ],
           headers: [
          {
            text: 'Codigo',
            align: 'start',
            value: 'codigo',
          },
          { text: 'Competencia', value: 'nombre' },
          { text: 'Duracion', value: 'duracion' },
          { text: 'detalle', value: 'accion'}
          
        ],
        }
    },
   methods: {
    resultados(item){
        this.competencia = item.nombre
        this.resultadosprograma = item.resultados
    },
                    
     async competenciasprograma(){
        const CompetenciaResponse = await axios.get(`${this.api}/competencia/programa/${this.programa}`);
         this.competencias = CompetenciaResponse.data[0].competencias;
         console.log(this.competencias)

     }
   },
   async mounted() {
        const programasResponse = await axios.get(`${this.api}/programas/`);
         this.programas = programasResponse.data; 
    },
}
</script>
