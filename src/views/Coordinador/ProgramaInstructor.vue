<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="900">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{
              modoEdicion
                ? "EDITAR SEDE"
                : "ASIGNACIÓN DE INSTRUCTORES A UN PROGRAMA"
            }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <v-container style="padding-bottom: 0">
          <v-row>
            <v-col cols="12">
              <v-form ref="form">
                <v-select
                  :items="programas"
                  item-text="nombre"
                  item-value="_id"
                  label="Programa de formación"
                  v-model="paquete.programa"
                  :rules="camposRules"
                  outlined
                  @change="limpiarFormulario()"
                  color="rgb(52,188,52)"
                ></v-select>
              </v-form>

              <v-card max-width="auto">
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

          <!-- Listado de instructores -->
          <v-row>
            <v-col>
              <v-card class="mx-auto" max-width="800">
                <v-toolbar color="rgb(52,188,52)" dark>
                  <v-toolbar-title
                    >Seleccione los instructores respectivos</v-toolbar-title
                  >

                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-toolbar>

                <v-list
                  flat
                  subheader
                  three-line
                  id="scroll-target"
                  max-height="600px"
                  class="overflow-y-auto"
                >
                  <v-row
                    v-scroll:#scroll-target="onScroll"
                    style="height: 1000px"
                  >
                    <v-col>
                      <v-list-item-group
                        v-model="settings"
                        multiple
                        active-class=""
                      >
                        <v-list-item
                          v-for="(data, i) in instructores.slice(
                            0,
                            parseInt(instructores.length / 3)
                          )"
                          :key="i"
                        >
                          <v-list-item-action>
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              color="rgb(52,188,52)"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-subtitle class="titulo">
                              {{ data.nombre }} {{ data.apellido }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-col>

                    <v-col>
                      <v-list-item-group
                        v-model="settings"
                        multiple
                        active-class=""
                      >
                        <v-list-item
                          v-for="data in instructores.slice(
                            parseInt(instructores.length / 3),
                            parseInt(instructores.length / 3) * 2
                          )"
                          :key="data._id"
                        >
                          <v-list-item-action>
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              color="rgb(52,188,52)"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-subtitle class="titulo">
                              {{ data.nombre }} {{ data.apellido }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-col>

                    <v-col>
                      <v-list-item-group
                        v-model="settings"
                        multiple
                        active-class=""
                      >
                        <v-list-item
                          v-for="data in instructores.slice(
                            parseInt(instructores.length / 3) * 2
                          )"
                          :key="data._id"
                        >
                          <v-list-item-action>
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              color="rgb(52,188,52)"
                            ></v-checkbox>
                          </v-list-item-action>

                          <v-list-item-content>
                            <v-list-item-subtitle class="titulo">
                              {{ data.nombre }} {{ data.apellido }}
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

          <!-- Acciones: Limpiar / Editar - Cancelar -->
          <v-card-actions style="max-width: 95%; margin: auto">
            <v-btn
              :class="['ma-2', colorBtn]"
              :style="{ color: '#fff' }"
              @click="modoEdicion ? guardarEdicion() : asignar()"
            >
              {{ modoEdicion ? "Editar" : "Asignar" }}
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
        </v-container>
      </v-card>
    </v-row>

    <!-- Tabla -->

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de asignación exitosa -->
    <Dialogo
      :show="dialogoAsignacionExitosa"
      title="Asignación exitosa"
      text="El programa ha sido asignado satisfactoriamente"
      @close-dialog="dialogoAsignacionExitosa = $event"
    />

    <DialogError
      :show="dialogoCamposVacios"
      title="Faltan datos por diligenciar !"
      text="Debe seleccionar un programa y luego escojer sus instructores"
      @close-dialog="dialogoCamposVacios = $event"
    />

    <DialogError
      :show="dialogoProgramaRepetido"
      title="Error"
      :text="mensajeProgramaRepetido"
      @close-dialog="dialogoProgramaRepetido = $event"
    />

    <pre>{{ $data }}</pre>
  </v-container>
</template>
<script>
import axios from "axios";
import Spinner from "../../components/Spinner.vue";
import DialogError from "../../components/DialogError.vue";
import Dialogo from "../../components/Dialog.vue";

export default {
  components: {
    Spinner,
    DialogError,
    Dialogo,
  },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,

      paquete: {
        programa: null,
        instructores: [],
      },
      programas: [],
      instructores: [],
      nombres: [],
      camposRules: [(v) => !!v || "Requerido !"],
      loading: false,
      dialogoCamposVacios: false,
      dialogoAsignacionExitosa: false,
      dialogoProgramaRepetido: false,
      mensajeProgramaRepetido: null,
    };
  },

  methods: {
    async asignar() {
    /*  if (this.$refs.form.validate()) {
        this.loading = true;

        if (
          this.paquete.programa === null ||
          this.paquete.instructores.length === 0
        ) {
          this.loading = false;
          this.dialogoCamposVacios = true;
          return;
        }*/

        axios.post(`${this.api}/user/asignarprogramas/instructores`,this.paquete)
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
        /*
        try {
        
            const response = await  axios.post(
              `${this.api}/user/asignarprogramas/instructores`,
              this.paquete
            )

            console.log(response)
         
          this.limpiarFormulario();
          this.loading = false;
          window.scrollTo(0, 0);
          this.dialogoAsignacionExitosa = true;



        } catch (error) {
          if (
            error.response.data.message.includes(
              "ya tiene el programa asignado"
            )
          ) {
            this.loading = false;
            this.mensajeProgramaRepetido = error.response.data.message;
            window.scrollTo(0, 0);
            this.dialogoProgramaRepetido = true;
            return;
          }
        }*/

    //  }
      window.scrollTo(0, 0);
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation();

      this.paquete.instructores = []
      
    },
  },

  watch: {
    paquete: {
      deep: true,
      handler() {
        this.nombres = this.instructores.filter((obj1) =>
          this.paquete.instructores.includes(obj1._id)
        );
      },
    },
  },

  computed: {
    textColorBtn() {
      return this.modoEdicion ? "#000" : "#fff";
    },

    colorBtn() {
      return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
    },
  },

  async mounted() {
    this.loading = true;
    //this.programas = this.$store.getters.usuario.programas;
    /*const responseProgramas = await axios.post(
      `${this.api}user/asignarprogramas/instructores`,
      {
        programa: "programa1",
        instructores: ["instructor1", "instructor2"],
      }
    );*/
    this.programas = this.$store.getters.usuario.programas;
    console.log(this.programas)
    const resultado = await axios.get(`${this.api}/user/instructor`);
    this.instructores = resultado.data;

    this.loading = false;
  },
};
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
