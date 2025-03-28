<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? "EDITAR AMBIENTE" : "CREAR AMBIENTE" }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container style="padding-bottom: 0">
              <v-row>
                <v-col>
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
                  <v-autocomplete
                    :items="sedes"
                    item-value="_id"
                    label="Sede"
                    v-model="paquete.sede"
                    :rules="camposRules"
                    @change="cargarBloques"
                    item-text="nombre"
                    item-color="black"
                    append-icon="mdi mdi-home-city"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-autocomplete>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-autocomplete
                    :items="bloques"
                    label="Bloque"
                    v-model="paquete.bloque"
                    :rules="camposRules"
                    item-value="_id"
                    item-text="nombre"
                    item-color="black"
                    append-icon="mdi mdi-home-outline"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    :items="tiposDeAmbiente"
                    label="Tipo de ambiente"
                    v-model="paquete.tipo"
                    :rules="camposRules"
                    item-text="nombre"
                    item-value="_id"
                    item-color="black"
                    append-icon="mdi mdi-format-list-bulleted"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-autocomplete>
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
      :items="ambientes"
      :cabecera="cabeceraTabla"
      @eliminar="eliminarRegistro"
      @editar="editarRegistro"
    />

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoAmbienteCreado"
      title="Registro creado con éxito"
      text="Ambiente creado"
      @close-dialog="dialogoAmbienteCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoAmbienteActualizado"
      title="Registro actualizado con éxito"
      text="Ambiente actualizado"
      @close-dialog="dialogoAmbienteActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarAmbiente"
      title="Realmente quieres eliminar este ambiente?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarAmbiente = $event"
    />

    <Dialogo
      :show="dialogo2EliminarAmbiente"
      title="Registro eliminado con éxito"
      text="Ambiente eliminado"
      @close-dialog="dialogo2EliminarAmbiente = $event"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla";
import Dialogo from "../components/Dialog.vue";
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue";
import Spinner from "../components/Spinner.vue";
//const tipoAmbiente = require("../json/tipoAmbiente");
// const sedes = require("../json/pruebaSedes");

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete, Spinner },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}`,
      paquete: {
        codigo: null,
        bloque: null,
        tipo: null,
        sede: null,
      },
      ambientes: [],
      sedes: [],
      bloques: [],
      tiposDeAmbiente: [],
      cabeceraTabla: [
        { text: "Código", value: "codigo" },
        { text: "Sede", value: "sede.nombre" },
        { text: "bloque", value: "bloque.nombre" },
        { text: "Tipo", value: "tipo.nombre" },
        { text: "Acciones", value: "actions" },
      ],
      dialogoAmbienteCreado: false,
      dialogoAmbienteActualizado: false,
      dialogo1EliminarAmbiente: false,
      dialogo2EliminarAmbiente: false,

      loading: false,
      modoEdicion: false,
      itemEliminar: null,

      camposRules: [(v) => !!v || "Requerido !"],
    };
  },

  methods: {
    async cargarBloques() {
      const response = await axios.get(
        `${this.api}/bloque/sede/${this.paquete.sede}`
      );
      this.bloques = response.data;
    },

    async cargarAmbientes() {
      try {
        const response = await axios.get(`${this.api}/ambiente`);
        this.ambientes = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async guardar() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.post(`${this.api}/ambiente/crear`, this.paquete);

          await this.cargarAmbientes();
          this.limpiarFormulario();
          this.loading = false;
          this.dialogoAmbienteCreado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    editarRegistro(item) {
      window.scrollTo(0, 0);

      const { _id, codigo, bloque, tipo, sede } = item;

      this.paquete = {
        id: _id,
        codigo,
        bloque: bloque._id,
        tipo: tipo._id,
        sede: sede._id,
      };

      this.cargarBloques();

      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()) {
        this.loading = true;

        try {
          await axios.put(`${this.api}/ambiente/editar`, this.paquete);

          this.cargarAmbientes();
          this.limpiarFormulario();
          this.modoEdicion = false;
          this.loading = false;
          this.dialogoAmbienteActualizado = true;
        } catch (error) {
          console.error(error);
        }
      }

      window.scrollTo(0, 0);
    },

    eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarAmbiente = true;
    },

    async confirmarEliminacion() {
      this.dialogo1EliminarAmbiente = false;
      this.loading = true;

      try {
        await axios.delete(`${this.api}/ambiente/${this.itemEliminar._id}`);

        await this.cargarAmbientes();
        this.itemEliminar = null;
        this.loading = false;
        this.dialogo2EliminarAmbiente = true;
      } catch (error) {
        console.error(error);
      }
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation();
      this.paquete = {
        codigo: null,
        bloque: null,
        tipo: null,
        sede: null,
      };
    },
  },

  async mounted() {
    this.loading = true;

    await this.cargarAmbientes();

    this.paquete.centro = this.$store.getters.usuario.centro;
    const response = await axios.get(
      `${this.api}/sedes/centro/${this.paquete.centro}`
    );
    this.sedes = response.data;

    const resTiposAmbientes = await axios.get(`${this.api}/tipo-ambiente`);
    this.tiposDeAmbiente = resTiposAmbientes.data;

    // const responseBloques = await axios.get(`${this.api}/bloque/sede/${this.paquete.sede}`);
    // this.bloques = responseBloques.data
    // try {

    //  } catch (error) {

    // }

    // this.paquete.centro = this.$store.getters.usuario.centro
    // const response = await axios.get(`${this.api}/sedes/centro/${this.paquete.centro}`);

    // //const response = await axios.get(`${this.api}/sedes/`);
    // const tipambiente = await axios.get(`${this.api}/tipo-ambiente/`);
    //   this.sedes = response.data;
    //   this.tipoambiente = tipambiente.data

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
