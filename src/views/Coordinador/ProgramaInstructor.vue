<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="750">
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

        <v-card-text style="border: 1px solid red">
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
                    @change="cargarInstructores()"
                    color="rgb(52,188,52)"
                  ></v-select>
                </v-form>

                <v-card>
                  <v-card-text>
                    <v-chip-group column>
                      <v-chip v-for="data in nombres" :key="data._id">
                        {{ data.nombre }} {{ data.apellido }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Acciones: Limpiar / Editar - Cancelar -->
            <v-card-actions
              style="padding: 0; margin: 40px 0; text-align: center"
            >
              <v-btn
                :class="[colorBtn]"
                :style="{ color: '#fff' }"
                @click="modoEdicion ? guardarEdicion() : asignar()"
              >
                {{ modoEdicion ? "Editar" : "Guardar" }}
              </v-btn>

              <v-btn
                class="colorBtnLimpiar"
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
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              @change="cambio(data)"
                              color="rgb(52,188,52)"
                            ></v-checkbox>

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
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              @change="cambio(data)"
                              color="rgb(52,188,52)"
                            ></v-checkbox>

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
                            <v-checkbox
                              :value="data._id"
                              v-model="paquete.instructores"
                              @change="cambio(data)"
                              color="rgb(52,188,52)"
                            ></v-checkbox>

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
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>

    <!-- Tabla -->

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de asignación exitosa -->
    <Dialogo
      :show="dialogoAsignacionExitosa"
      :title="title"
      :text="mensaje"
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
      originales : [],
      paraprocesar : [],
      programas: [],
      instructores: [],
      
      nombres: [],
      paquetecambio : null,
      camposRules: [(v) => !!v || "Requerido !"],
      loading: false,
      dialogoCamposVacios: false,
      dialogoAsignacionExitosa: false,
      dialogoProgramaRepetido: false,
      mensajeProgramaRepetido: null,
      title : null,
      mensaje : null,
    };
  },

  methods: {
   cambio(data)
   {
    console.log(data)
        const busqueda = this.originales.findIndex((e) => { return e == data._id} )
        
        if (busqueda != -1)
         {
           const obj = new Object();
           obj.id = data._id
           obj.operacion = 2
           const r = this.paraprocesar.findIndex((e) => {return e.id == data._id})
            if (r == -1)
              {
                this.paraprocesar.push(obj)
              }
            else
              {
                this.paraprocesar.splice(r,1)
              }
          }
        else
          {
            const obj = new Object();
            obj.id = data._id
            obj.operacion = 1
            const r = this.paraprocesar.findIndex((e) => {return e.id == data._id})
            if (r == -1)
              {
                this.paraprocesar.push(obj)
              }
            else
              {
                this.paraprocesar.splice(r,1)
              }
          }


   },

    
    remove(item) {
      this.paquete.instructores.splice(
        this.paquete.instructores.indexOf(item),
        1
      );
    },

    async asignar() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        if (
          this.paquete.programa === null ||
          this.paquete.instructores.length === 0
        ) {
          this.loading = false;
          this.dialogoCamposVacios = true;
          return;
        }

        try {
          this.paquete.instructores = this.paraprocesar;
          const response = await axios.post(
            `${this.api}/users/asignarprogramas/instructores`,
            this.paquete
          );

          console.log(response);

          this.limpiarFormulario();
          this.loading = false;
          window.scrollTo(0, 0);
          this.title = response.data[0].title
          this.mensaje = response.data[0].mensaje
          this.dialogoAsignacionExitosa = true;
        } catch (error) {
          console.log(error);
          // if (
          //   error.response.data.message.includes(
          //     "ya tiene el programa asignado"
          //   )
          // ) {
          //   this.loading = false;
          //   this.mensajeProgramaRepetido = error.response.data.message;
          //   window.scrollTo(0, 0);
          //   this.dialogoProgramaRepetido = true;
          //   return;
          // }
        }
      }
      window.scrollTo(0, 0);
    },

    async cargarInstructores() {
      this.loading = true;

      const centro = this.$store.getters.usuario.centro;

      try {
        this.paquete.instructores = [];
        this.paraprocesar = []
        const response = await axios.get(
          `${this.api}/users/instructores/programa/${this.paquete.programa}/centro/${centro}`
        );

        console.log(response);

        if (response.status === 200) {
          const idsIntructores = response.data.map(
            (instructor) => instructor._id
          );

          this.originales = JSON.parse(JSON.stringify(idsIntructores))
          this.paquete.instructores = idsIntructores;

          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        //if (error.response.status === 404) {
        //  alert("El programa no tiene instructores asociados");
        //}
      }

      this.loading = false;
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation();

      this.paquete.programa = null;
      this.paquete.instructores = [];
      this.paraprocesar = [];
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
    this.programas = this.$store.getters.usuario.programas;
    const centro = this.$store.getters.usuario.centro;
    const resultado = await axios.get(
      `${this.api}/users/instructores/centro/${centro}`
    );
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
