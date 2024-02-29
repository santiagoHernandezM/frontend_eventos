<template>
    <v-container>
       
        <v-row justify="space-around">
          <template>
            <v-card width="800">
              <v-toolbar color="rgb(52,188,52)" dark flat>
                <v-app-bar-nav-icon></v-app-bar-nav-icon>
    
                <v-toolbar-title>CREAR USUARIO</v-toolbar-title>
    
                <v-spacer></v-spacer>
    
                <template v-slot:extension>
                  <v-tabs v-model="tab" align-with-title>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
    
                    <v-tab v-for="item in items" :key="item">
                      {{ item }}
                    </v-tab>
                  </v-tabs>
                </template>
              </v-toolbar>
              <v-form ref="form">
                <v-tabs-items v-model="tab">
                   <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <v-card width="800">
                          <v-card-text class="carta">
                            <v-row>
                              <v-col cols="12">
                                <v-row>
                                  <v-col cols="8">
                                    <v-text-field
                                      type="number"
                                      label="Documento identificación"
                                      prepend-icon="mdi-credit-card"
                                      v-model="paquete.documento"
                                      :rules="camposRules"
                                    ></v-text-field>
                                  </v-col>
                                </v-row>
                              </v-col>
                              <v-col cols="6">
                                <v-text-field
                                  label="Nombre"
                                  prepend-icon="mdi-account"
                                  v-model="paquete.nombre"
                                  :rules="camposRules"
                                ></v-text-field>
                              </v-col>
                              <v-col cols="6">
                                <v-text-field
                                  label="Apellido"
                                  prepend-icon="mdi-account"
                                  v-model="paquete.apellido"
                                  :rules="camposRules"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row>
                              
                              <v-col cols="6">
                                <v-text-field
                                  type="number"
                                  label="Celular"
                                  prepend-icon="mdi-cellphone"
                                  v-model="paquete.celular"
                                  :rules="camposRules"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                            <v-row justify="space-around" class="mb-4">
                              <v-card flat>
                                <v-card-text>
                                  <v-card width="400">
                                   <v-row justify="center" class="mb-n6 titulo ml-1 mr-1 ">
                                      <v-col cols="6">
                                         <h5>DATOS CONEXION</h5>
                                      </v-col>
                                   </v-row>
                                   <v-row class="mb-n10">
                                     <v-col class="mr-3 ml-4">
                                      <v-text-field
                                      label="Correo"
                                      prepend-icon="mdi-gmail"
                                      v-model="paquete.correo"
                                      :rules="emailRules"
                                    ></v-text-field>
                                     </v-col>
                                   </v-row>
                                   <v-row>
                                    <v-col class="mr-3 ml-4">
                                      <v-text-field
                                      v-model="paquete.password"
                                      prepend-icon="mdi-lock"
                                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                                      :rules="[camposRules, min]"
                                      :type="show1 ? 'text' : 'password'"
                                      name="input-10-1"
                                      label="Password"
                                      hint="8 caracteres como minimo"
                                      counter
                                      @click:append="show1 = !show1"
                                    ></v-text-field>
                                    </v-col>
                                  </v-row>
                                  
                                  </v-card>
                                </v-card-text>
                              </v-card>
                            </v-row>
                          
                          </v-card-text>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
    
                  <v-tab-item>
                    <v-card flat>
                      <v-col>
                        <v-card>
                          <v-card-text>
                            <v-text-field
                              label="No. del contrato"
                              prepend-icon="mdi-key"
                              v-model="paquete.contrato.numero"
                              :rules="camposRules"
                            ></v-text-field>
                            <v-row>
                              <v-col cols="6">
                                <v-menu
                                  ref="fechainicio"
                                  v-model="fini"
                                  :close-on-content-click="false"
                                  :return-value.sync="date"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      :rules="camposRules"
                                      v-model="paquete.contrato.fechaInicio"
                                      label="Fecha de Inicio"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="paquete.contrato.fechaInicio"
                                    no-title
                                    scrollable
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="fini = false"
                                    >
                                      OK
                                    </v-btn>
                                  </v-date-picker>
                                </v-menu>
                              </v-col>
    
                              <v-col cols="6">
                                <v-menu
                                  ref="menu2"
                                  v-model="ffin"
                                  :close-on-content-click="false"
                                  :return-value.sync="date"
                                  transition="scale-transition"
                                  offset-y
                                  min-width="auto"
                                >
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                      :rules="camposRules"
                                      v-model="paquete.contrato.fechaTerminacion"
                                      label="Fecha de Finalización"
                                      prepend-icon="mdi-calendar"
                                      readonly
                                      v-bind="attrs"
                                      v-on="on"
                                    ></v-text-field>
                                  </template>
                                  <v-date-picker
                                    v-model="paquete.contrato.fechaTerminacion"
                                    no-title
                                    scrollable
                                  >
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      text
                                      color="primary"
                                      @click="ffin = false"
                                    >
                                      OK
                                    </v-btn>
                                  </v-date-picker>
                                </v-menu>
                              </v-col>
                            </v-row>
    
                            <v-row>
                              <v-col>
                                <v-select
                                  :rules="camposRules"
                                  :items="tipo"
                                  label="Seleccione tipo de vinculación"
                                  v-model="paquete.contrato.tipoVinculacion"
                                  prepend-icon="map"
                                ></v-select>
                              </v-col>
                            </v-row>
                           
                          </v-card-text>
                        </v-card>
                      </v-col>
                     
                    </v-card>
                  </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-col>
                          <v-card>
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-select
                                        v-model="paquete.roles"
                                        :items="roles"
                                        :menu-props="{ maxHeight: '400' }"
                                        label="Roles"
                                        multiple
                                        :rules="camposRules"
                                        hint="Seleccione roles"
                                        persistent-hint
                                        @change="academia()"
                                      ></v-select>
                                    </v-col>
                                  </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                    </v-card>
                </v-tab-item>
                <v-tab-item v-if="isInstructor">
                    <v-card flat>
                        <v-col>
                          <v-card>
                            <v-card-text>
                                <v-row >
                                    <v-col>
                                        <v-row>
                                            <v-col cols="12">
                                              <v-select
                                              v-model="paquete.programas"
                                              :items="programas"
                                              item-value="_id"
                                              label="Asigne programas de formacion"
                                              multiple
                                           
                                             
                                            >
                                            <template v-slot:item="{ item }">
                                            <p>  {{ item.nivel }} {{ item.nombre }} Intensidad Horaria {{ item.intensidad_horaria }}
                                             </p> 
                                            </template>
              
                                            <template slot="selection" slot-scope="data">
                                                <p>
                                              {{ data.item.nivel }} {{ data.item.nombre }} Intensidad Horaria {{ data.item.intensidad_horaria }}
                                           </p>
                                            </template>
              
                                          </v-select>
                                              </v-col>
                                              </v-row>

                                    </v-col>
                                  </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                    </v-card>
                </v-tab-item>
                <v-tab-item v-if="isAdmin">
                    <v-card flat>
                        <v-col>
                          <v-card>
                            <v-card-text>
                                <v-row >
                                          <v-col cols="12">
                                                <v-select
                                                :items="sedes"
                                                label="Selecciones una sede"
                                                v-model="paquete.sede"
                                                :rules="camposRules"
                                                item-text="nombre"
                                                item-value="_id"
                                                color="black"
                                                item-color="black"
                                                prepend-icon="map"
                                              ></v-select>

                                             

                                    </v-col>
                                  </v-row>
                            </v-card-text>
                          </v-card>
                        </v-col>
                    </v-card>
                </v-tab-item>

                </v-tabs-items>
              </v-form>
              <v-row justify="center">
                <v-btn
                  class="ma-2 mb-5"
                  outlined
                  color="indigo"
                  @click="guardar()"
                >
                  Crear Instructor
                </v-btn>
              </v-row>


            </v-card>
          </template>
         
        </v-row>
       <pre>
         {{ $data }}
       </pre>
        <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje>
       
      </v-container>
</template>
<script>
import axios from "axios";
import mensaje from "../../components/MensajesView.vue";
export default {
  components: {
    mensaje,
  },
   data() {
    return {
        api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        tab: null,
      items: ["DATOS PERSONALES", "INFORMACION CONTRATO","ROLES"],
      fini: false,
      ffin: false,
      tipo : ['Prestacion de servicios','Planta'],
      centros : [],
      isInstructor : false,
      isAdmin : false,
      programas : null,
      paquete: {
        documento: null,
        nombre: null,
        apellido: null,
        correo: null,
        password: null,
        celular: null,
        centro : null,
        programas  : [],
        roles : [],
        contrato: {
          numero: null,
          fechaInicio: null,
          fechaTerminacion: null,
          tipoVinculacion: null,
        },
        },
      mensaje: "",
      color: "",
      show: false,
      roles : [],
      camposRules: [(v) => !!v || "Campo es requerido"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
       
      ],
      min: v => v.length >= 8 || 'Min 8 characters',
      vrol: v => v.length > 0 || "Esocoja un rol",
      show1 : false
    };
    
   },
   
   methods: {
    academia(){
     
      const admin = this.paquete.roles.find((rol) => rol == "Administrator");
      if (admin != undefined)
       {
         this.paquete.roles = []
         this.paquete.roles.push("Administrator")
         this.items =  ["DATOS PERSONALES", "INFORMACION CONTRATO","ROLES","CENTROS"]
         this.isAdmin = true
         this.isInstructor = false
       }
    
     else
     {
      const result = this.paquete.roles.find((rol) => rol == "Instructor");
     if (result != undefined)
     {
       this.items =  ["DATOS PERSONALES", "INFORMACION CONTRATO","ROLES","FORMACION"]
       this.isInstructor = true
       this.isAdmin = false
     }
      else
       {
        this.isInstructor = false
        this.isAdmin = false
        this.items =  ["DATOS PERSONALES", "INFORMACION CONTRATO","ROLES"]

       }
      
     
     }

    },
    guardar(){
      let procesar = false
      if (this.$refs.form.validate()) {
        if (this.paquete.roles.length > 0){
          if(this.paquete.roles[0] == 'Administrator')
          {
              this.paquete.programas = []
              if(this.paquete.centro != null)
               {
                 procesar = true
               }
              else
               {
                this.mensaje = "Debe seleccionar una Sede"
                this.color = "red"
                this.show = true
               }
             }
          else
          {
            const found = this.paquete.roles.find((element) => element == 'Instructor');
            console.log(found)
            if (found != undefined)
              {
                this.paquete.centro = null
                if (this.paquete.programas.length == 0)  
                 {
                   this.mensaje = "Debe seleccionar uno o mas programas"
                   this.color = "red"
                   this.show = true
                   
                 }
                else
                 {
                  this.paquete.centro =  this.$store.getters.usuario.centro
                  procesar = true
                 }
              }
            else{
              this.paquete.centro =  this.$store.getters.usuario.centro
              this.paquete.programas = []
              procesar = true
            }
             
          }
        }
        else{
           this.mensaje = "Debe seleccionar un rol"
           this.color = "red"
           this.show = true
         }
      }
      else
      {
        this.mensaje = "Faltan datos por diligenciar"
        this.color = "red"
        this.show = true
      }

      if (procesar)
       {
        this.procesarguardado()
        this.show = false
       }
    },

    async procesarguardado(){
    let vm = this
    await axios
        .post(`${this.api}/user/crear`, this.paquete)
        .then(function () {
          
          vm.mensaje = "Usuario guardado con exito ..."
          vm.color = "green"
          vm.show = true
          
        })
        .catch(function (error) {
          vm.mensaje = `Se ha producido un error : ${error.message}`
          vm.color = "red"
          vm.show = true
        })
        .finally(function () {
         
        });
   }


   },

   async mounted() {
       let resultado = await axios.get(`${this.api}/user/roles`);
       this.roles = resultado.data
       const programas = await axios.get(`${this.api}/programas/`);
       this.programas = programas.data
       const response = await axios.get(`${this.api}/centro/`);
       this.centros = response.data  
   },

  

   
}
</script>
<style scoped>
 .titulo{
  background-color: rgb(52,188,52);
  color : white
 }
</style>