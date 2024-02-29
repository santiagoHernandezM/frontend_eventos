<template>
  <v-container>
    <v-row justify="space-around"> </v-row>
    <v-row justify="space-around">
      <template>
        <v-card width="700">
          <v-toolbar color="rgb(52,188,52)" dark flat>
            <v-app-bar-nav-icon></v-app-bar-nav-icon>

            <v-toolbar-title>DATOS DEL CONTRATO</v-toolbar-title>

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
              <!-- <v-tab-item>
                <v-card>
                  <h1>hola</h1>
                </v-card>
              </v-tab-item> -->
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
                              label="Correo"
                              prepend-icon="mdi-gmail"
                              v-model="paquete.correo"
                              :rules="emailRules"
                            ></v-text-field>
                          </v-col>
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
                        <v-row>
                          <v-col cols="6">
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
                                {{ item.nivel }} {{ item.nombre }} Intensidad Horaria {{ item.intensidad_horaria }}
                              </template>

                              <template slot="selection" slot-scope="data">
                                {{ data.item.nivel }} {{ data.item.nombre }} Intensidad Horaria {{ data.item.intensidad_horaria }}
                              </template>

                            </v-select>
                                </v-col>
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
              </v-tab-item>
            </v-tabs-items>
          </v-form>
        </v-card>
      </template>
    </v-row>
    <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje>
    <pre>
          {{ $data }}
        </pre
    >
  </v-container>
</template>

<script>
import axios from "axios";
import mensaje from "../../components/MensajesView.vue";


export default {
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  components: {
    mensaje,
  },

  data() {
    return {
      tab: null,
      items: ["DATOS PERSONALES", "INFORMACION CONTRATO"],
      fini: false,
      ffin: false,
      tipo : ['Prestacion de servicios','Planta'],
      sedes : null,
      programas : null,
      paquete: {
        documento: null,
        nombre: null,
        apellido: null,
        correo: null,
        celular: null,
        sede : null,
        programas  : [],
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
      camposRules: [(v) => !!v || "Campo es requerido"],
      emailRules: [
        (v) => !!v || "E-mail is required",
        (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
      ],
    };
  },

  methods: {

  

    async guardar() {
      var vm = this;
      if (this.$refs.form.validate()) {
        await axios
          .post("http://159.223.110.82:3000/instructor/crear", this.paquete)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            vm.mensaje = `Se ha producido un error : ${error}`;
            vm.color = "red";
            vm.show = true;
          })
          .finally(function () {
            vm.mensaje = "Instructor creador con exito";
            vm.color = "#aaddff";
            vm.show = true;
            vm.$refs.form.reset();
          });
      }
    },
  },

  async mounted() {
    let url = `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`;
    const tipos = await axios.get(`${url}/tipo-de-vinculacion`);
    const response = await axios.get(`${url}/sedes/`);
    const programas = await axios.get(`${url}/programas/`);
    this.programas = programas.data
    this.sedes = response.data
    this.tipovinculacion = tipos.data;

    
  },
  computed: {
    combinedText() {
      return this.options.map(item => ({
        ...item,
        combinedText: `${item.nivel} ${item.nombre}`,
      }));
    },
  },
};
</script>
