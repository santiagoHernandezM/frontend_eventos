<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-toolbar color="rgb(52,188,52)" dark flat>
          <v-toolbar-title class="text-h6 white--text pl-0"
            >CREAR USUARIO</v-toolbar-title
          >

          <template v-slot:extension>
            <v-tabs v-model="tab" align-with-title>
              <v-tabs-slider color="yellow"></v-tabs-slider>

              <v-tab v-for="item in items" :key="item">
                {{ item }}
              </v-tab>
            </v-tabs>
          </template>
        </v-toolbar>

        <v-card-text>
          <v-form>
            <v-tabs-items v-model="tab">
              <!-- Datos personales -->
              <v-tab-item>
                <v-container>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        type="number"
                        label="Documento identificación"
                        append-icon="mdi-credit-card"
                        v-model="paquete.documento"
                        :rules="camposRules"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6">
                      <v-text-field
                        type="number"
                        label="Celular"
                        append-icon="mdi-cellphone"
                        v-model="paquete.celular"
                        :rules="camposRules"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Nombre"
                        append-icon="mdi-account"
                        v-model="paquete.nombre"
                        :rules="camposRules"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field
                        label="Apellido"
                        append-icon="mdi-account"
                        v-model="paquete.apellido"
                        :rules="camposRules"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-card width="100%" style="border: 1px solid #aaa">
                      <v-app-bar flat color="rgb(52,188,52)">
                        <v-toolbar-title class="text-h6 white--text pl-0">
                          Datos de conexión
                        </v-toolbar-title>

                        <v-spacer></v-spacer>
                      </v-app-bar>

                      <v-card-text>
                        <v-form>
                          <v-container>
                            <v-row>
                              <v-col class="mr-3 ml-4">
                                <v-text-field
                                  label="Correo"
                                  append-icon="mdi-gmail"
                                  v-model="paquete.correo"
                                  :rules="emailRules"
                                  outlined
                                  type="email"
                                  color="rgb(52,188,52)"
                                ></v-text-field>
                              </v-col>

                              <v-col class="mr-3 ml-4">
                                <v-text-field
                                  v-model="paquete.password"
                                  :append-icon="
                                    show1 ? 'mdi-eye' : 'mdi-eye-off'
                                  "
                                  :rules="[camposRules, min]"
                                  :type="show1 ? 'text' : 'password'"
                                  name="input-10-1"
                                  label="Contraseña"
                                  hint="8 caracteres como minimo"
                                  counter
                                  @click:append="show1 = !show1"
                                  outlined
                                  color="rgb(52,188,52)"
                                ></v-text-field>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-row>

                  <!-- <v-row>
                    <v-card flat>
                      <v-card-text>
                        <v-card width="400">
                          <v-row
                            justify="center"
                            class="mb-n6 titulo ml-1 mr-1"
                          >
                            <v-col cols="12">
                              <h5>DATOS DE CONEXION</h5>
                            </v-col>
                          </v-row>
                          <v-row class="mb-n10">
                            <v-col class="mr-3 ml-4">
                              <v-text-field
                                label="Correo"
                                prepend-icon="mdi-gmail"
                                v-model="paquete.correo"
                                :rules="emailRules"
                                color="rgb(52,188,52)"
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
                                color="rgb(52,188,52)"
                              ></v-text-field>
                            </v-col>
                          </v-row>
                        </v-card>
                      </v-card-text>
                    </v-card>
                  </v-row> -->
                </v-container>
              </v-tab-item>

              <!-- Información de contrato -->
              <v-tab-item>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field
                        label="Número de contrato"
                        append-icon="mdi-key"
                        v-model="paquete.contrato.numero"
                        type="number"
                        :rules="camposRules"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>

                    <v-col>
                      <v-select
                        :rules="camposRules"
                        :items="tipo"
                        label="Tipo de vinculación"
                        v-model="paquete.contrato.tipoVinculacion"
                        append-icon="map"
                        outlined
                        color="rgb(52,188,52)"
                      ></v-select>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col>
                      <v-text-field
                        v-model="paquete.contrato.fechaInicio"
                        type="date"
                        label="Fecha de inicio"
                        outlined
                        :rules="camposRules"
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>

                    <v-col>
                      <v-text-field
                        v-model="paquete.contrato.fechaTerminacion"
                        type="date"
                        label="Fecha de finalización"
                        outlined
                        :rules="camposRules"
                        color="rgb(52,188,52)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>

              <!-- Roles -->
              <v-tab-item>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-select
                        v-model="paquete.roles"
                        :items="roles"
                        :menu-props="{ maxHeight: '400' }"
                        label="Roles"
                        multiple
                        :rules="camposRules"
                        @change="academia()"
                        outlined
                        color="rgb(52,188,52)"
                      >
                      </v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>

              <!-- <v-tab-item v-if="isInstructor">
                <v-card flat>
                  <v-col>
                    <v-card>
                      <v-card-text>
                        <v-row>
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
                                    <p>
                                      {{ item.nivel }}
                                      {{ item.nombre }} Intensidad Horaria
                                      {{ item.intensidad_horaria }}
                                    </p>
                                  </template>

                                  <template slot="selection" slot-scope="data">
                                    <p>
                                      {{ data.item.nivel }}
                                      {{ data.item.nombre }} Intensidad Horaria
                                      {{ data.item.intensidad_horaria }}
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
              </v-tab-item> -->

              <!-- <v-tab-item v-if="isAdmin">
                <v-card flat>
                  <v-col>
                    <v-card>
                      <v-card-text>
                        <v-row>
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
              </v-tab-item> -->
            </v-tabs-items>
          </v-form>
        </v-card-text>
      </v-card>
    </v-row>

    <pre>{{ $data }}</pre>
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
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        documento: null,
        nombre: null,
        apellido: null,
        correo: null,
        password: null,
        celular: null,
        centro: null,
        programas: [],
        roles: [],
        contrato: {
          numero: null,
          fechaInicio: null,
          fechaTerminacion: null,
          tipoVinculacion: null,
        },
      },
      tab: null,
      items: ["DATOS PERSONALES", "INFORMACION CONTRATO", "ROLES"],
      fini: false,
      ffin: false,
      tipo: ["CONTRATISTA", "CARRERA ADMINISTRATIVA"],
      centros: [],
      isInstructor: false,
      isAdmin: false,
      programas: null,
      mensaje: "",
      color: "",
      show: false,
      roles: [],
      camposRules: [(v) => !!v || "Requerido !"],
      emailRules: [
        (v) => !!v || "E-mail es requerido",
        (v) => /.+@.+\..+/.test(v) || "Debe ser un E-mail válido",
      ],
      min: (v) => v.length >= 8 || "Mínimo 8 caracteres",
      vrol: (v) => v.length > 0 || "Escoja un rol",
      show1: false,
    };
  },

  methods: {
    academia() {
      const admin = this.paquete.roles.find((rol) => rol == "Administrator");
      if (admin != undefined) {
        this.paquete.roles = [];
        this.paquete.roles.push("Administrator");
        this.items = [
          "DATOS PERSONALES",
          "INFORMACION CONTRATO",
          "ROLES",
          "CENTROS",
        ];
        this.isAdmin = true;
        this.isInstructor = false;
      } else {
        const result = this.paquete.roles.find((rol) => rol == "Instructor");
        if (result != undefined) {
          this.items = [
            "DATOS PERSONALES",
            "INFORMACION CONTRATO",
            "ROLES",
            "FORMACION",
          ];
          this.isInstructor = true;
          this.isAdmin = false;
        } else {
          this.isInstructor = false;
          this.isAdmin = false;
          this.items = ["DATOS PERSONALES", "INFORMACION CONTRATO", "ROLES"];
        }
      }
    },
    guardar() {
      let procesar = false;
      if (this.$refs.form.validate()) {
        if (this.paquete.roles.length > 0) {
          if (this.paquete.roles[0] == "Administrator") {
            this.paquete.programas = [];
            if (this.paquete.centro != null) {
              procesar = true;
            } else {
              this.mensaje = "Debe seleccionar una Sede";
              this.color = "red";
              this.show = true;
            }
          } else {
            const found = this.paquete.roles.find(
              (element) => element == "Instructor"
            );
            console.log(found);
            if (found != undefined) {
              this.paquete.centro = null;
              if (this.paquete.programas.length == 0) {
                this.mensaje = "Debe seleccionar uno o mas programas";
                this.color = "red";
                this.show = true;
              } else {
                this.paquete.centro = this.$store.getters.usuario.centro;
                procesar = true;
              }
            } else {
              this.paquete.centro = this.$store.getters.usuario.centro;
              this.paquete.programas = [];
              procesar = true;
            }
          }
        } else {
          this.mensaje = "Debe seleccionar un rol";
          this.color = "red";
          this.show = true;
        }
      } else {
        this.mensaje = "Faltan datos por diligenciar";
        this.color = "red";
        this.show = true;
      }

      if (procesar) {
        this.procesarguardado();
        this.show = false;
      }
    },

    async procesarguardado() {
      let vm = this;
      await axios
        .post(`${this.api}/user/crear`, this.paquete)
        .then(function () {
          vm.mensaje = "Usuario guardado con exito ...";
          vm.color = "green";
          vm.show = true;
        })
        .catch(function (error) {
          vm.mensaje = `Se ha producido un error : ${error.message}`;
          vm.color = "red";
          vm.show = true;
        })
        .finally(function () {});
    },
  },

  async mounted() {
    let resultado = await axios.get(`${this.api}/user/roles`);
    this.roles = resultado.data;
    const programas = await axios.get(`${this.api}/programas/`);
    this.programas = programas.data;
    const response = await axios.get(`${this.api}/centro/`);
    this.centros = response.data;
  },
};
</script>
<style scoped>
.titulo {
  background-color: rgb(52, 188, 52);
  color: white;
}
</style>
