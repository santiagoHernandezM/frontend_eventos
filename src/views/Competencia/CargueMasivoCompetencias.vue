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
                    @change="CompetenciaPrograma()"
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
                  :rules="camposRules"
                    accept=".xlsx"
                    v-model="file"
                    append-icon="mdi mdi-file-excel"
                    label="Archivo de excel"
                    outlined
                    :disabled="estado"
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

    <v-snackbar
    v-model="show"
    :timeout="timeout"
  >
    {{ text }}

   
  </v-snackbar>
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
      programa: null,
      programas: [],
      estado : true,
      show : false,
      text : null,
      timeout : 3000,
      camposRules: [
        v => !!v || 'Campo requerido',
      ],
      filerules: [
        v => v.size < 2000000 || "File size should be less than 2 MB!",
      ],
      loading: false,
    };
  },

  async mounted() {
    const programasResponse = await axios.get(`${this.api}/programas/`);
    this.programas = programasResponse.data
   
  },
  methods: {
      async CompetenciaPrograma(){
          const programasResponse = await axios.get(`${this.api}/competencia/programa/${this.programa}`);
            if (programasResponse.data.length > 0)
            this.estado = true
          else
            this.estado = false
        
       },
    async cargarCSV() {
      if (this.$refs.form.validate())
        {
        this.loading = true;
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("programa", this.programa);

        try {
          const response = await axios.post(
            `${this.api}/carguemasivocompetencias/cargar/`,
            formData
          );
          
              this.file = null,
              this.estado = true
              this.text = "Cargue competencias y resultado de programa con existo ..."
              this.show = true
              console.log(response)
          

        } catch (error) {
          this.text = "Se ha producido un error ..."
              this.show = true
        }
        this.loading = false;
      }
    },
  },
};
</script>
<style scoped></style>
