<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{
              modoEdicion
                ? "EDITAR PROGRAMA DE FORMACIÓN"
                : "CREAR PROGRAMA DE FORMACIÓN"
            }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container style="padding-bottom: 0">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Código"
                    append-icon="mdi-key-variant"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Nombre"
                    append-icon="mdi mdi-pencil"
                    v-model="paquete.nombre"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="7">
                  <v-select
                    :items="niveles"
                    item-text="paquete.nivel"
                    label="Nivel de formación"
                    append-icon="mdi mdi-account-school"
                    v-model="paquete.nivel"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-select>
                </v-col>

                <v-col cols="5">
                  <v-text-field
                    label="Versión"
                    append-icon="mdi mdi-numeric"
                    v-model="paquete.version"
                    type="number"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Duración"
                    append-icon="mdi mdi-clock-time-eight-outline"
                    v-model="paquete.duracion"
                    type="number"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="inthoraria"
                    label="Intensidad horaria"
                    append-icon="mdi mdi-calendar-clock"
                    v-model="paquete.intensidad_horaria"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Acciones: Limpiar / Editar - Cancelar -->
        <v-card-actions style="max-width: 95%; margin: auto">
          <v-btn
            :class="['ma-2', colorBtn]"
            color="success"
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
            color="error"
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
    <Tabla
      :items="programas"
      :cabecera="cabeceraTabla"
      @eliminar="eliminarRegistro"
      @editar="editarRegistro"
    />

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoProgramaCreado"
      title="Registro creado con éxito"
      text="Programa creado"
      @close-dialog="dialogoProgramaCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoProgramaActualizado"
      title="Registro actualizado con éxito"
      text="Programa actualizado"
      @close-dialog="dialogoProgramaActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarPrograma"
      title="Realmente quieres eliminar este programa?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarPrograma = $event"
    />

    <Dialogo
      :show="dialogo2EliminarPrograma"
      title="Registro eliminado con éxito"
      text="Programa eliminado"
      @close-dialog="dialogo2EliminarPrograma = $event"
    />

    <!-- <pre>{{ $data }}</pre> -->
    <!-- <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje> -->
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../../components/Tabla.vue";
import Dialogo from "../../components/Dialog.vue";
import Dialogo_confirm_delete from "../../components/Dialog-confirm-delete.vue";
import Spinner from "../../components/Spinner.vue";

// import mensaje from "../../components/MensajesView.vue";
export default {
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  components: {
    Tabla,
    Dialogo,
    Dialogo_confirm_delete,
    Spinner,
    // mensaje,
  },

  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      inthoraria: [8, 6],
      paquete: {
        codigo: null,
        nombre: null,
        nivel: null,
        version: null,
        duracion: null,
        intensidad_horaria: null,
      },
      programas: [],
      cabeceraTabla: [
        { text: "Código", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Nivel", value: "nivel" },
        { text: "Versión", value: "version" },
        { text: "Duración", value: "duracion" },
        { text: "Intensidad horaria", value: "intensidad_horaria" },
        { text: "Acciones", value: "actions" },
      ],
      modoEdicion: false,
      loading: false,
      dialogoProgramaCreado: false,
      dialogoProgramaActualizado: false,
      itemEliminar: null,
      dialogo1EliminarPrograma: false,
      dialogo2EliminarPrograma: false,

      mensaje: "",
      color: "",
      show: false,
      niveles: [
        "TÉCNICO",
        "TECNÓLOGO",
        "OPERARIO",
        "AUXILIAR",
        "ESPECIALIZACIÓN",
      ],
      camposRules: [(v) => !!v || "Requerido !"],
    };
  },

  methods: {
    async cargarProgramas() {
      try {
        const response = await axios.get(`${this.api}/programas/programacompetencia`);
        this.programas = response.data;
        console.log(this.programas)
      } catch (error) {
        console.error(error);
      }
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.post(`${this.api}/programas/crear`, this.paquete);

          await this.cargarProgramas();
          this.limpiarFormulario();
          this.loading = false;
          this.dialogoProgramaCreado = true;
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
        codigo,
        nombre,
        nivel,
        version,
        duracion,
        intensidad_horaria,
      } = item;

      this.paquete = {
        id: _id,
        codigo,
        nombre,
        nivel,
        version,
        duracion,
        intensidad_horaria,
      };

      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        console.log(this.paquete);
        try {
          await axios.put(`${this.api}/programas/actualizar`, this.paquete);

          await this.cargarProgramas();
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.loading = false;
          this.dialogoProgramaActualizado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarPrograma = true;
    },

    async confirmarEliminacion() {
      this.dialogo1EliminarPrograma = false;
      this.loading = true;

      try {
        await axios.delete(
          `${this.api}/programas/eliminar/${this.itemEliminar._id}`
        );

        await this.cargarProgramas();
        this.itemEliminar = null;
        this.loading = false;
        this.dialogo2EliminarPrograma = true;
      } catch (error) {
        console.error(error);
      }
    },

    convertToUppercase() {
      this.paquete.nombre = this.paquete.nombre.toUpperCase();
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation();
      this.paquete = {
        codigo: null,
        nombre: null,
        nivel: null,
        version: null,
        duracion: null,
        intensidad_horaria: null,
      };
    },
  },

  async mounted() {
    this.loading = true;

    await this.cargarProgramas();

    this.loading = false;
  },

  computed: {
    colorBtn() {
      return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
    },
  },
};
</script>
