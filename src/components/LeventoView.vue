<template>
    <div>
    <v-row class="mb-5 mt-5" v-for="(data,index) in this.evento" :key="data.ficha" >
        <v-card width="100%">
         <v-card-text>
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="2">
                  <v-text-field
                  :value="data.ficha.codigo"
                  label="Ficha"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="3">
                  <v-text-field
                  :value="data.programa.nombre"
                  label="Programa"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                  :value="data.nivel"
                  label="Nivel"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                  :value="data.municipio"
                  label="Municipio"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                  :value="data.ambiente.ambiente"
                  label="Ambiente"
                  readonly
                ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="1">
                  <v-text-field
                  :value="data.dia"
                  label="Dia"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                  :value="data.horario"
                  label="Horario"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                  :value="data.diastrabajados"
                  label="Laborados"
                  readonly
                ></v-text-field>
                </v-col>
                <v-col cols="4">
                  <v-textarea
                  :value="data.competencia.competencia"
                background-color="amber lighten-4"
                label="Competencia"
              ></v-textarea>

                </v-col>
                <v-col cols="3">
                  <v-textarea
                  :value="data.resultado.resultado"
                background-color="amber lighten-4"
                color="orange orange-darken-4"
                label="Resultado Aprendizaje"
              ></v-textarea>
             </v-col>
              </v-row>
              <v-row>
                <v-col
                 cols="2">
                  <span>Horas evento</span>
                  <v-chip
                      class="ma-2"
                       color="green"
                       outlined
                         >
                        {{ data.horas }}
                      </v-chip>
                </v-col>
                <v-col v-if="tipo==2">
                  <v-btn
                  class="ma-2"
                  outlined
                  color="red"
                  @click="eliminar(index)"
                >
                <v-icon>mdi-eraser</v-icon>
                Eliminar
                </v-btn>
                </v-col>
              </v-row>
              <v-row v-if="data.conflict" class="d-flex align-center">
                <v-col cols="2">
                  <v-chip
                    class="ma-2"
                    color="red"
                    text-color="white"
                  >
                  Conflicto
                </v-chip>
                </v-col>
                <v-col cols="8">
                  <v-sheet
                    color="pink"
                    elevation="1"
                    height="70"
                    width="600"
                    class="error d-flex align-center white--text"
                    
                  >
                   {{ data.mensaje }}
                </v-sheet>
                </v-col>
                <v-col cols="2"> 
                  <v-btn
                  class="ma-2"
                  color="warning"
                  dark
                  @click="eliminarevento(index)"
                >
                  Eliminar
                  <v-icon
                    dark
                    right
                  >
                  mdi-delete
                  </v-icon>
                </v-btn>
                </v-col>

               </v-row>
            
            </v-container>
          </v-form>
         </v-card-text>     
        </v-card>
      
       </v-row> 

      
    </div>
  
</template>

<script>
export default {
    props:['evento','tipo'],

    methods: {
      eliminarevento(index){
        this.$emit('eliminarevento',index)
      },
      eliminar(index){
        this.$emit('eliminareventobd',index)
      }
    },
}
</script>

<style>
.error{
  border-radius: 15px;
  padding-right: 5px;
  padding-left: 10px;
  padding-bottom: 5px;
  justify-content: center;
  text-align: center;
  
 
}

</style>