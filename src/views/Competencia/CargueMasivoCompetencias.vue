<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CARGUE MASIVO DE COMPETENCIAS POR PROGRAMA
          </v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-form ref="form">
            <v-container style="padding-bottom: 0">
              <v-row>
                <v-col>
                  <v-select
                    :items="programas"
                    item-text="nombre"
                    item-value="_id"
                    label="Programa de formación"
                    v-model="programa"
                    append-icon="mdi mdi-school"
                    @change="instructoresPrograma(paquete.programa)"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  >
                    <template v-slot:item="{ item }">
                      {{ item.nivel }} - {{ item.nombre }} - Intensidad Horario
                      :
                      {{ item.intensidad_horaria }}
                    </template>

                    <template slot="selection" slot-scope="data">
                      {{ data.item.nivel }} - {{ data.item.nombre }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>

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

    <!-- Cargando... -->
    <Spinner :value="loading" />
  </v-container>
</template>
<script>
import axios from "axios";
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
      loading: false,
    };
  },

  async mounted() {
    const programasResponse = await axios.get(`${this.api}/programas/`);
    this.programas = programasResponse.data;
  },
  methods: {
    async cargarCSV() {
      if (this.file != null) {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("programa", this.programa);

        try {
          const response = await axios.post(
            `${this.api}/carguemasivocompetencias/cargar/`,
            formData
          );
          console.log(response.data);
        } catch (error) {
          console.log(error);
        }
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped></style>
