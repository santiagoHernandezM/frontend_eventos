<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CARGUE MASIVO DE USUARIOS
          </v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-form ref="form">
            <v-container style="padding-bottom: 0">
              <v-row>
                <v-col cols="12" style="padding-bottom: 0">
                  <v-file-input
                    :rules="rules"
                    accept=".xlsx"
                    v-model="file"
                    append-icon="mdi mdi-file-excel"
                    label="Archivo de excel"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions
          style="max-width: 95%; margin: auto; margin-bottom: 20px"
        >
          <v-btn class="colorBtnCrear" style="color: #fff" @click="cargarCSV()">
            CARGAR ARCHIVO
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- TABLA -->
    <!-- <Tabla
      :items="usuarios"
      :cabecera="cabeceraTabla"
      style="border: 1px solid red;"
    /> -->
    <template>
      <v-row justify="space-around">
        <v-card max-width="900" class="mt-12 px-10 py-10">
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
                @input="convertToUpperCase"
                class="mx-4"
                color="rgb(52,188,52)"
              ></v-text-field>
            </template>

            <!-- Listado -->
            <template v-slot:item.actions="{ item }">
              <v-card-actions style="padding: 0">
                <v-btn
                  icon
                  @click="metodoEditar(item)"
                  @mouseover="mostrarTooltip = true"
                  @mouseleave="mostrarTooltip = false"
                  id="btn-editar"
                >
                  <v-icon id="icono-editar">mdi-pencil</v-icon>
                </v-btn>

                <v-btn icon @click="metodoEliminar(item)" id="btn-eliminar">
                  <v-icon id="icono-eliminar">mdi-delete</v-icon>
                </v-btn>
              </v-card-actions>
            </template>
          </v-data-table>
        </v-card>
      </v-row>
    </template>

    <!-- Cargando... -->
    <Spinner :value="loading" />

    <pre>{{ $data }}</pre>
  </v-container>
</template>
<script>
import axios from "axios";
// import Tabla from "../../components/Tabla.vue"
import Spinner from "../../components/Spinner.vue";

export default {
  components: { Spinner },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      file: null,
      programa: null,
      programas: [],
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],

      panel: [],
      usuarios: [],
      cabeceraTabla: [
        { text: "Documento", value: "documento" },
        { text: "Nombres", value: "nombre" },
        { text: "Apellidos", value: "apellido" },
        { text: "Teléfono", value: "celular" },
        { text: "Registrado", value: "registrado" },
      ],

      search: "",
      loading: false,
    };
  },

  methods: {
    async cargarCSV() {
      if (this.file != null) {
        this.loading = true;
        let centro = this.$store.getters.usuario.centro;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("centro", centro);

        try {
          const response = await axios.post(
            `${this.api}/carguemasivocompetencias/cargarinstructor/`,
            formData
          );
          console.log(response);
          this.usuarios = response.data;
        } catch (error) {
          console.log(error);
        }

        this.loading = false;
        // await axios
        //   .post(
        //     `${this.api}/carguemasivocompetencias/c  argarinstructor/`,
        //     formData
        //   )
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     {
        //       console.log(error);
        //     }
        //   });
      }
    },

    // Create an array the length of our items
    // with all values as true
    all() {
      this.panel = [...Array(this.items).keys()].map((k, i) => i);
    },
    // Reset the panel
    none() {
      this.panel = [];
    },

    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    convertToUpperCase() {
      this.search = this.search.toUpperCase();
    },

    metodoEditar() {},

    metodoEliminar() {},
  },

  async mounted() {
    const programasResponse = await axios.get(`${this.api}/programas/`);
    this.programas = programasResponse.data;

    // const usuariosResponse = await axios.get(`${this.api}/users/instructores`);
    // this.usuarios = usuariosResponse.data;
  },
};
</script>
<style scoped></style>
