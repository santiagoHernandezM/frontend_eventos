<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? "EDITAR CENTRO" : "CREAR CENTRO" }}
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
                    append-icon="mdi mdi-key-variant"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    append-icon="mdi mdi-pencil"
                    label="Nombre"
                    v-model="paquete.nombre"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="regionales"
                    item-text="nombre"
                    item-value="_id"
                    label="Regional"
                    append-icon="fa fa-building"
                    v-model="paquete.regional"
                    :rules="camposRules"
                    outlined
                    @change="cargarDpto()"
                    color="rgb(52,188,52)"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    append-icon="mdi mdi-map-search"
                    label="Departamento"
                    v-model="departamento"
                    outlined
                    readonly
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="ciudades"
                    label="Ciudad"
                    v-model="paquete.municipio"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                    item-color="black"
                    append-icon="mdi mdi-map-marker-radius"
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
    <Tabla
      :items="centros"
      :cabecera="cabeceraTabla"
      :metodoEditar="editarRegistro"
      :metodoEliminar="eliminarRegistro"
    />

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoCentroCreado"
      title="Registro creado con éxito"
      text="Centro creado"
      @close-dialog="dialogoCentroCreado = $event"
    />

    <!-- Dialogo de actualización  -->
    <Dialogo
      :show="dialogoCentroActualizado"
      title="Registro actualizado con éxito"
      text="Centro actualizado"
      @close-dialog="dialogoCentroActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarCentro"
      title="Realmente quieres eliminar este centro?"
      text="También se eliminarán las sedes asociadas y todo lo que estas incluyen"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarCentro = $event"
    />

    <Dialogo
      :show="dialogo2EliminarCentro"
      title="Registro eliminado con éxito"
      text="Centro eliminado"
      @close-dialog="dialogo2EliminarCentro = $event"
    />

    <pre>{{ $data }}</pre>
  </v-container>
</template>

<script>
import axios from "axios";
import Dialogo from "../components/Dialog.vue";
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue";
import Tabla from "../components/Tabla.vue";
import Spinner from "../components/Spinner.vue";

let colombia = require("../json/ciudades");
colombia = colombia.map((dpto) => ({
  id: dpto.id,
  departamento: dpto.departamento.toUpperCase(),
  ciudades: dpto.ciudades.map((ciudad) => (ciudad = ciudad.toUpperCase())),
}));

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete, Spinner },
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        codigo: null,
        nombre: null,
        regional: null,
        municipio: null,
      },
      // dpto no es requerido para crear un centro
      departamento: null,

      cabeceraTabla: [
        { text: "Código", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Regional", value: "regional.nombre" },
        { text: "Ciudad", value: "municipio" },
        { text: "Acciones", value: "actions" },
      ],

      loading: false,
      dialogoCentroCreado: false,
      dialogoCentroActualizado: false,
      dialogo1EliminarCentro: false,
      dialogo2EliminarCentro: false,
      modoEdicion: false,
      itemEliminar: null,

      centros: [],
      regionales: null,
      departamentos: colombia,
      camposRules: [(v) => !!v || "Requerido !"],
    };
  },

  methods: {
    async cargarCentros() {
      try {
        const response = await axios.get(`${this.api}/centro`);
        this.centros = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async cargarDpto() {
      try {
        this.loading = true;
        const regional = await axios.get(
          `${this.api}/regional/${this.paquete.regional}`
        );
        this.departamento = regional.data.departamento;
        this.loading = false;
      } catch (error) {
        console.log(error);
      }
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.post(`${this.api}/centro/crear`, this.paquete);

          await this.cargarCentros();
          this.limpiarFormulario();
          this.loading = false;
          this.dialogoCentroCreado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    editarRegistro(item) {
      window.scrollTo(0, 0);

      const { _id, codigo, nombre, regional, municipio } = item;

      this.paquete = {
        id: _id,
        codigo,
        nombre,
        regional: regional._id,
        municipio,
      };

      this.departamento = item.regional.departamento;
      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.put(`${this.api}/centro/editar`, this.paquete);

          await this.cargarCentros();
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.loading = false;
          this.dialogoCentroActualizado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    async eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarCentro = true;
    },

    async confirmarEliminacion() {
      this.dialogo1EliminarCentro = false;
      this.loading = true;

      try {
        await axios.delete(
          `${this.api}/centro/eliminar/${this.itemEliminar._id}`
        );

        await this.cargarCentros();
        this.itemEliminar = null;
        this.loading = false;
        this.dialogo2EliminarCentro = true;
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
        regional: null,
        departamento: null,
        municipio: null,
      };
      this.departamento = null;
    },
  },

  async mounted() {
    this.loading = true;

    await this.cargarCentros();

    const response = await axios.get(`${this.api}/regional`);
    this.regionales = response.data;

    this.loading = false;
  },

  computed: {
    ciudades() {
      let ciudades = null;
      this.departamentos.find((dpto) => {
        if (dpto.departamento === this.departamento) {
          ciudades = dpto.ciudades;
        }
      });

      return ciudades;
    },

    textColorBtn() {
      return this.modoEdicion ? "#000" : "#fff";
    },

    colorBtn() {
      return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
    },
  },
};
</script>

<style></style>
