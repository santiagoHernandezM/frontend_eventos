<template>
    <v-container>
      <v-row justify="space-around">
        <v-card width="800">
          <!-- Encabezado -->
          <v-app-bar flat color="rgb(52,188,52)">
            <v-toolbar-title class="text-h6 white--text pl-0">
              {{ modoEdicion ? "EDITAR SEDE" : "INSTRUCTOR POR PROGRAMA" }}
            </v-toolbar-title>
  
            <v-spacer></v-spacer>
          </v-app-bar>
  
          <v-container style="padding-bottom: 0">
            <v-row>
              <v-col cols="12">
                <v-select
                :items="programas"
                item-text="nombre"
                item-value="_id"
                label="Programas"
                v-model="paquete.programa"
                            outlined
        ></v-select>

        <v-card
                   
        max-width="auto"
      >
      <v-card-text>
        <v-chip-group
          v-model="selection"
          active-class="deep-purple accent-4 white--text"
          column
        >
          <v-chip v-for="data in nombres" :key="data._id">
            {{ data.nombre }} {{ data.apellido }}
        </v-chip>
  
         
        </v-chip-group>
      </v-card-text>
      </v-card>

              </v-col>
            </v-row>
            <v-row>
                <v-col>
                  

                </v-col>
            </v-row>
            <v-row>
                <v-col>
                    <v-card class="mx-auto" max-width="600">
                        <v-toolbar color="rgb(52,188,52)" dark>
                          <v-app-bar-nav-icon></v-app-bar-nav-icon>
                    
                          <v-toolbar-title>Instructores</v-toolbar-title>
                    
                          <v-spacer></v-spacer>
                    
                          <v-btn icon>
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </v-toolbar>
                    
                        <v-list flat subheader three-line
                        >
                        <v-row>

                       <v-col>
                          <v-list-item-group v-model="settings" multiple active-class="">
                            <v-list-item v-for="data in instructores" :key="data._id">
                              <v-list-item-action>
                                <v-checkbox
                                  :value="data._id"
                                  v-model="paquete.instructores"
                                  color="rgb(52,188,52)"
                                ></v-checkbox>
                              </v-list-item-action>
                    
                              <v-list-item-content>
                                <v-list-item-subtitle class="titulo">
                                    {{data.nombre}} {{ data.apellido }}
                                </v-list-item-subtitle>
                                                 
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-col>
                        <v-col>
                          <v-list-item-group v-model="settings" multiple active-class="">
                            <v-list-item v-for="data in instructores" :key="data._id">
                              <v-list-item-action>
                                <v-checkbox
                                  :value="data._id"
                                  v-model="paquete.instructores"
                                  color="rgb(52,188,52)"
                                ></v-checkbox>
                              </v-list-item-action>
                    
                              <v-list-item-content>
                                <v-list-item-subtitle class="titulo">
                                    {{data.nombre}} {{ data.apellido }}
                                </v-list-item-subtitle>
                                                 
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>

                        </v-col>
                        </v-row>
                        </v-list>
                      </v-card>
                </v-col>
            </v-row>
            </v-container>
        
        </v-card>
      </v-row>
  
      <!-- Tabla -->
     
      <!-- Dialogo de actualización -->
      
      <pre>{{ $data }}</pre>
    </v-container>
  </template>
  <script>
 import axios from "axios";


  export default {
   
    data() {
      return {
        api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      
        paquete: {
          programa: null,
         instructores : []
        },
        programas : [],
        instructores : [],
        nombres : [],
      };
    },

  watch:{
   paquete:{
    deep: true,
    handler() {

         this.nombres = this.instructores.filter(obj1 =>
                 this.paquete.instructores.includes(obj1._id)
);
        

    }
   }
  },
  
    async mounted() {
      
      this.programas = this.$store.getters.usuario.programas;
      const resultado = await axios.get(`${this.api}/user/instructor`);
      this.instructores = resultado.data

    },
  }
  </script>
  
  <style>
  .fondo {
    background: linear-gradient(
      90deg,
      rgba(138, 74, 22, 0.7820378151260504) 15%,
      rgba(6, 92, 23, 1) 49%,
      rgba(226, 175, 56, 1) 82%
    );
  }
  </style>
  