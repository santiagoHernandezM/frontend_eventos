<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CARGUE MASIVO DE PROGRAMAS
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
          <v-btn
            class="colorBtnCrear"
            style="color: #fff"
            @click="cargarprogramas()"
          >
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
      api: `${process.env.VUE_APP_API_URL}`,
      file: null,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      loading: false,
    };
  },

  async mounted() {},
  methods: {
    async cargarprogramas() {
      if (this.file != null) {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);

        try {
          const response = await axios.post(
            `${this.api}/carguemasivocompetencias/cargarprogramas/`,
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
