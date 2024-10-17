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
          <v-form ref="form">
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
                        :rules="camposRules"
                        v-model="paquete.contrato.fechaTerminacion"
                        type="date"
                        label="Fecha de finalización"
                        outlined
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

                  <ListaPrograma
                    :programas="programas"
                    v-if="mostrarprogramas"
                    @envioprogramas="cargarprograma"
                  ></ListaPrograma>
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

        <!-- Acciones: Limpiar / Editar - Cancelar -->
        <v-card-actions style="max-width: 95%; margin: auto">
          <v-btn
            :class="['ma-2', colorBtn]"
            :style="{ color: '#fff' }"
            @click="modoEdicion ? guardarEdicion() : guardar()"
          >
            {{ modoEdicion ? "Editar" : "Crear" }}
          </v-btn>

          <v-btn
            class="ma-2 colorBtnLimpiar"
            v-if="!modoEdicion"
            @click="limpiarFormulario()"
          >
            Limpiar
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn
            class="ma-2 white--text colorBtnEliminar"
            v-if="modoEdicion"
            @click="
              limpiarFormulario();
              modoEdicion = false;
            "
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- Tabla -->
    <!-- <Tabla
      :items="usuarios"
      :cabecera="cabeceraTabla"
      @eliminar="eliminarRegistro "
      @editar="editarRegistro"
    /> -->


    <template>
      <v-row justify="space-around">
        <v-card class="mt-12 px-10 py-10">
          <v-data-table
            :items="usuarios"
            :headers="cabeceraTabla"
            class="elevation-1"
            :search="search"
            :custom-filter="filterOnlyCapsText"
          >
            <!-- Buscador -->
            <template v-slot:top>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                @input="convertToUpperCaseTabla"
                class="mx-4"
                color="rgb(52,188,52)"
              ></v-text-field>
            </template>

            <!-- Listado -->
            <template v-slot:item.actions="{ item }">
              <v-row justify="center" style="gap: 9px; flex-wrap: nowrap;x">
              
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="blue"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="editarRegistro(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar</span>
                </v-tooltip>

                <v-tooltip top v-if="item.activo">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="cambiarEstadoUsuario(item._id, false)"
                    >
                      <v-icon>mdi mdi-account-lock-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Desactivar usuario</span>
                </v-tooltip>

                <v-tooltip top v-else>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="green"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="cambiarEstadoUsuario(item._id, true)"
                    >
                      <v-icon>mdi mdi-account-lock-open-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Activar usuario</span>
                </v-tooltip>
              </v-row>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </template>

    <v-snackbar v-model="info_snackbar.show" :timeout="info_snackbar.timeout">
      {{ info_snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="info_snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>



    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoUsuarioCreado"
      title="Registro creado con éxito"
      text="Usuario creado"
      @close-dialog="dialogoUsuarioCreado = $event"
    />

     <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoUsuarioActualizado"
      title="Registro actualizado con éxito"
      text="Usuario actualizado"
      @close-dialog="dialogoUsuarioActualizado = $event"
    />

   <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarUsuario"
      title="Realmente quieres eliminar este usuario?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarUsuario = $event"
    />

    <Dialogo
      :show="dialogo2EliminarUsuario"
      title="Registro eliminado con éxito"
      text="Usuario eliminado"
      @close-dialog="dialogo2EliminarUsuario = $event"
    />

    <DialogError
      :show="dialogoCamposVacios"
      title="Faltan datos por diligenciar !"
      text="Asegúrese de llenar todos los campos"
      @close-dialog="dialogoCamposVacios = $event"
    />

    <!-- Programas vacios -->
    <DialogError
      :show="dialogoProgramasVacios"
      title="No ha asignado ningún programa de formación !"
      text="Debe seleccionar al menos un programa"
      @close-dialog="dialogoProgramasVacios = $event"
    />
    <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje>
  </v-container>
</template>

<script>
import axios from "axios";
import mensaje from "../../components/MensajesView.vue";
import ListaPrograma from "../../components/ListProgramas/ListaProgramas.vue";
import Dialogo from "../../components/Dialog.vue";
import DialogError from "../../components/DialogError.vue";
import Spinner from "../../components/Spinner.vue";
import Dialogo_confirm_delete from "../../components/Dialog-confirm-delete.vue";
// import Tabla from "../../components/Tabla.vue";

export default {
  components: {
    // Tabla,
    mensaje,
    ListaPrograma,
    Dialogo,
    DialogError,
    Dialogo_confirm_delete,
    Spinner,
  },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}`,
      token: {
        headers: {
          Authorization: null,
        },
      },
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
      usuarios: [],
      cabeceraTabla: [
        { text: "Documento", value: "documento" },
        { text: "Nombre", value: "nombre" },
        { text: "Apellido", value: "apellido" },
        { text: "Correo", value: "correo" },
        { text: "Celular", value: "celular" },
        { text: "Roles", value: "roles" },
        { text: "Acciones", value: "actions" },
      ],
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
      loading: false,
      modoEdicion: false,
      dialogoCamposVacios: false,
      dialogoProgramasVacios: false,
      dialogoUsuarioCreado: false,
      Dialogo_confirm_delete: false,
      dialogoUsuarioActualizado: false,
      dialogo1EliminarUsuario: false,
      dialogo2EliminarUsuario: false,

      mostrarTooltip: false,
      search: "",

      itemEliminar: null,

      info_snackbar: {
        show: false,
        text: "",
        color: null,
        timeout: 1600,
      }
    };
  },

  methods: {

    eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarUsuario = true;
    },

   async confirmarEliminacion(){

    this.dialogo1EliminarUsuario = false;
    this.loading = true;

    try {
      await axios.delete(`${this.api}/users/eliminar/${this.itemEliminar._id}`)

      await this.cargarUsuarios();
      this.itemEliminar = null;
      this.loading = false;
      this.dialogo2EliminarUsuario = true

    } catch (error) {
      console.log(error)
    }
    
  },
    async cargarUsuarios() {
      try {
        const response = await axios.get(`${this.api}/users`);
        this.usuarios = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    cargarprograma(lprograma) {
      this.paquete.programas = lprograma;
    },
    academia() {
      const admin = this.paquete.roles.find((rol) => rol == "Administrator");
      if (admin != undefined) {
        this.paquete.roles = [];
        this.paquete.programas = [];
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
          this.paquete.programas = [];
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

    async guardar() {
      if (this.$refs.form.validate()) {
        if (this.paquete.roles.includes("Administrator")) {
          this.paquete.programas = [];
        } else {
          if (this.paquete.roles.includes("Coordinador")) {
            if (this.paquete.programas.length == 0) {
              this.dialogoProgramasVacios = true;
              return;
            }
          } else {
            this.paquete.programas = [];
          }
        }

        this.loading = true;
        try {
          this.paquete.centro = this.$store.getters.usuario.centro;
          const response = await axios.post(
            `${this.api}/users/crear`,
            this.paquete
          );

          console.log(response);
          this.loading = false;
          this.limpiarFormulario();
          this.dialogoUsuarioCreado = true;
        } catch (error) {
          console.error(error);
        }
      } else {
        this.dialogoCamposVacios = true;
      }

      // window.scrollTo(0, 0);
    },

    /*guardar() {
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
    },*/

    // async procesarguardado() {
    //   let vm = this;
    //   await axios
    //     .post(`${this.api}/users/crear`, this.paquete)
    //     .then(function () {
    //       vm.mensaje = "Usuario guardado con exito ...";
    //       vm.color = "green";
    //       vm.show = true;
    //     })
    //     .catch(function (error) {
    //       vm.mensaje = `Se ha producido un error : ${error.message}`;
    //       vm.color = "red";
    //       vm.show = true;
    //     })
    //     .finally(function () {});
    // },

    convertToUppercase() {
      this.paquete.nombre = this.paquete.nombre.toUpperCase();
      this.paquete.apellido = this.paquete.apellido.toUpperCase();
    },

    convertToUpperCaseTabla() {
      this.search = this.search.toUpperCase();
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        console.log(this.paquete);
        try {
          await axios.put(`${this.api}/users/actualizar`, this.paquete);

          await this.cargarUsuarios();
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.loading = false;
          this.dialogoUsuarioActualizado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    editarRegistro(item) {
      window.scrollTo(0, 0);

      const {
        _id,
        documento,
        nombre,
        apellido,
        correo,
        celular,
        contrato,
        numero,
        programas,
        centro,
        roles,
      } = item;

      this.paquete = {
        id: _id,
        documento,
        nombre,
        apellido,
        correo,
        celular,
        contrato,
        numero,
        programas,
        centro,
        roles,
      };

      this.modoEdicion = true;
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation();

      this.paquete = {
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
      };
    },

    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    async cambiarEstadoUsuario(usuario = null, estado = false) {
      if (usuario != null) {
        await axios
          .put(
            `${this.api}/users/${usuario}/nuevo_estado/${estado}`,
            {},
            this.token
          )
          .then((resp) => {
            if (!resp.data.error) {
              this.cargarUsuarios();
            }
            this.info_snackbar.text = resp.data.message;
            this.info_snackbar.show = true;
          });
      }
    },
  },

  computed: {
    mostrarprogramas() {
      return this.paquete.roles.includes("Coordinador");
    },

    textColorBtn() {
      return this.modoEdicion ? "#000" : "#fff";
    },

    colorBtn() {
      return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
    },
  },

  async mounted() {
    this.loading = true;
    this.paquete.centro = this.$store.getters.usuario.centro;

    await this.cargarUsuarios();

    let resultado = await axios.get(`${this.api}/users/roles`);
    this.roles = resultado.data;
    const programas = await axios.get(`${this.api}/programas/`);
    this.programas = programas.data;
    console.log(this.programas);
    const response = await axios.get(`${this.api}/centro/`);
    this.centros = response.data;

    this.token.headers.Authorization = `Bearer ${this.$store.getters.usuario.access_token}`;


    this.loading = false;
  },
};
</script>
<style scoped>
.titulo {
  background-color: rgb(52, 188, 52);
  color: white;
}
</style>
