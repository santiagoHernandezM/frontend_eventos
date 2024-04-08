<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            MASIVO USUARIO
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

    <!-- Listado -->
    <template>
      <v-row justify="space-around">
        <v-card width="900" class="mt-12 px-10 py-10">
          <div>
            <div class="text-center d-flex pb-4">
              <v-btn @click="all"> all </v-btn>
              <!--
              <div>{{ panel }}</div>
              -->
              <v-btn @click="none"> none </v-btn>
            </div>

            <v-expansion-panels v-model="panel" multiple>
              <!-- v-for="(usuario, i) in usuarios" :key="i" -->
              <v-expansion-panel>
                <v-expansion-panel-header>Archivo 1</v-expansion-panel-header>

                <v-expansion-panel-content>
                  <!-- Tabla -->
                  <!-- <Tabla :items="usuarios" :cabecera="cabeceraTabla" /> -->
                  <v-data-table
                    :items="usuarios"
                    :headers="cabeceraTabla"
                    :search="search"
                    :custom-filter="filterOnlyCapsText"
                    style="margin: 0"
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

                        <v-btn
                          icon
                          @click="metodoEliminar(item)"
                          id="btn-eliminar"
                        >
                          <v-icon id="icono-eliminar">mdi-delete</v-icon>
                        </v-btn>
                      </v-card-actions>
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
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

export default {
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
        { text: "Acciones", value: "actions" },
      ],

      search: "",
    };
  },

  methods: {
    async cargarCSV() {
      this.loading = true;
      if (this.file != null) {
        let centro = this.$store.getters.usuario.centro;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("centro", centro);

        await axios
          .post(
            `${this.api}/carguemasivocompetencias/cargarinstructor/`,
            formData
          )
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            {
              console.log(error);
            }
          });
      }
      this.loading = false;
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

    const usuariosResponse = await axios.get(`${this.api}/users/instructores`);
    this.usuarios = usuariosResponse.data;
  },
};
</script>
<style scoped></style>
