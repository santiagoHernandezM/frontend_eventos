<template>
    <v-container>
      <v-row justify="space-around">
        <v-card width="600">
          
          <!-- Encabezado -->
          <v-app-bar flat color="rgba(156, 216, 175, 256)" >
  
            <v-toolbar-title class=" text-h6 white--text pl-0">
              CREAR RESULTADO APRENDIZAJE
            </v-toolbar-title>
  
            <v-spacer></v-spacer> 
          </v-app-bar>

          <!-- Formulario -->
          <v-card-text class="carta">
            <v-form ref="form">
              <v-container>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                    label="Orden del Resultado"
                    prepend-icon="mdi-key"
                    v-model="paquete.orden"
                    type="number"
                    :rules="camposRules"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                    label="Duracion de Resultado"
                    prepend-icon="mdi-key"
                    v-model="paquete.duracion"
                    type="number"
                    :rules="camposRules"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                    label="Descripcion de Resultado"
                    prepend-icon="mdi-key"
                    v-model="paquete.descripcion"
                    :rules="camposRules"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-container>
            </v-form>

          </v-card-text>

          <!-- Acciones: Crear / Editar -->
          <v-card-actions>
            <v-btn class="ma-2" outlined color="indigo" @click="modoEdicion ? guardarEdicion() : guardar()">
              {{ modoEdicion ? 'Editar' : 'Crear' }}
            </v-btn>
          </v-card-actions>
          
        </v-card>
      </v-row>

      <!-- Cargando... -->
      <v-overlay :value="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-overlay>

      <!-- Dialogo de creación -->
      <Dialogo
      :show="dialogoRapCreado"
      title="Registro creado con éxito"
      text="Resultado de aprendizaje creado"
      @close-dialog="dialogoRapCreado = $event"
      />

      <pre>{{ $data }}</pre>

      <!-- <mensaje
      :mensaje="mensaje"
      :color="color"
      :show="show"
      />  -->

    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
//  import mensaje from '../../components/MensajesView.vue'
  export default {
    props: {
      datos: Object,
      mostrar: Boolean,
    },
    components:{
      // mensaje
    },
    
    data() {
      return {
       
        paquete: {
          orden: null,
          duracion: null,
          descripcion: null
          
        },
        loading: false,
        dialogoRapCreado: false,
        mensaje : '',
        color : '',
        show : false,
        camposRules: [
          v => !!v || 'Campo es requerido'
        ]
      }
    },
  
    methods: {
      async guardar() {
        this.loading = true;

        try {
          await axios.post(`${this.api}/sedes/crear`, this.paquete);

        } catch (error) {
          console.error(error);
          
        } finally {
          this.loading = false;
          this.cargarSedes()
          this.dialogoSedeCreada = true
          this.limpiarFormulario();
        }
      },


    //   async guardar() {
    //     if (this.$refs.form.validate())
    //     {
    //         await axios.post('http://159.223.110.82:3000/programas/crear',this.paquete)
    //      .then(function (response) {
    //        console.log(response);
    //    })
    //   .catch(function (error) {
    //     this.mensaje = `Se ha producido un error : ${error}`
    //         this.color = 'red'
    //         this.show = true
    //      })
    //  .finally(function () {
    //         this.mensaje = 'Programa Guardado con exito'
    //         this.color = '#aaddff'
    //         this.show = true
    //   });
           
    //     }
    //   }
      },

    async mounted() {
      const response = await axios.get("http://10.187.145.190:3000/regional");
      this.regionales = response.data;
    },

  }
  
    

  
  
  
  </script>
    
  