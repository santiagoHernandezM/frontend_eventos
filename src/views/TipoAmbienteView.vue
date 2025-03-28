<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{
              modoEdicion ? "EDITAR TIPO DE AMBIENTE" : "CREAR TIPO DE AMBIENTE"
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
                <v-col cols="6">
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

    <Tabla
      :items="tiposDeAmbientes"
      :cabecera="cabeceraTabla"
      @eliminar="eliminarRegistro"
      @editar="editarRegistro"
    />

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoTipoAmbienteCreado"
      title="Registro creado con éxito"
      text="Tipo de ambiente creado"
      @close-dialog="dialogoTipoAmbienteCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoTipoAmbienteActualizado"
      title="Registro actualizado con éxito"
      text="Tipo de ambiente actualizado"
      @close-dialog="dialogoTipoAmbienteActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      style="border: 2px solid red"
      :show="dialogo1EliminarTipoAmbiente"
      title="Realmente quieres eliminar este tipo de ambiente?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarTipoAmbiente = $event"
    />

    <Dialogo
      :show="dialogo2EliminarTipoAmbiente"
      title="Registro eliminado con éxito"
      text="Tipo de ambiente eliminado"
      @close-dialog="dialogo2EliminarTipoAmbiente = $event"
    />

  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla.vue";
import Dialogo from "../components/Dialog.vue";
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete, Spinner },
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}`,
      paquete: {
        codigo: null,
        nombre: null,
      },
      tiposDeAmbientes: [],
      cabeceraTabla: [
        { text: "Código", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Acciones", value: "actions" },
      ],
      modoEdicion: false,
      itemEliminar: null,
      loading: false,
      dialogoTipoAmbienteCreado: false,
      dialogoTipoAmbienteActualizado: false,
      dialogo1EliminarTipoAmbiente: false,
      dialogo2EliminarTipoAmbiente: false,
      camposRules: [(v) => !!v || "Requerido !"],
    };
  },

  methods: {
    async cargarTiposDeAmbientes() {
      try {
        const response = await axios.get(`${this.api}/tipo-ambiente`);
        this.tiposDeAmbientes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.post(`${this.api}/tipo-ambiente/crear`, this.paquete);

          await this.cargarTiposDeAmbientes();
          this.limpiarFormulario();
          this.loading = false;
          this.dialogoTipoAmbienteCreado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    editarRegistro(item) {
      window.scrollTo(0, 0);

      const { _id, codigo, nombre } = item;

      this.paquete = {
        id: _id,
        codigo,
        nombre,
      };

      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.put(`${this.api}/tipo-ambiente/actualizar`, this.paquete);

          await this.cargarTiposDeAmbientes();
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.loading = false;
          this.dialogoTipoAmbienteActualizado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarTipoAmbiente = true;
    },

    async confirmarEliminacion() {
      this.dialogo1EliminarTipoAmbiente = false;
      this.loading = true;

      try {
        await axios.delete(
          `${this.api}/tipo-ambiente/eliminar/${this.itemEliminar._id}`
        );

        await this.cargarTiposDeAmbientes();
        this.itemEliminar = null;
        this.loading = false;
        this.dialogo2EliminarTipoAmbiente = true;
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
      };
    },
  },

  async mounted() {
    this.loading = true;

    await this.cargarTiposDeAmbientes();

    this.loading = false;
  },

  computed: {
    colorBtn() {
      return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
    },
  },
};
</script>

<style></style>
