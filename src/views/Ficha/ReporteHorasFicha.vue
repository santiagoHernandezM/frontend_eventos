<template>
  <v-row justify="space-around">
    <v-col cols="11" lg="10">
      <v-card width="100%">
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            Reporte de horas por ficha
          </v-toolbar-title>
        </v-app-bar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                :items="programas"
                item-text="nombre"
                item-value="_id"
                no-data-text="Sin programas"
                @change="fichasPrograma"
                label="Programa"
              >
                <template v-slot:item="{ item }">
                  {{ item.nivel }} - {{ item.nombre }}
                </template>

                <template slot="selection" slot-scope="data">
                  {{ data.item.nivel }} - {{ data.item.nombre }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-row class="mt-5" no-gutters>
            <v-col cols="12">
              <v-expansion-panels popout>
                <v-expansion-panel v-for="(ficha, i) in fichas" :key="i">
                  <v-expansion-panel-header>
                    <p class="m-0">
                      <strong>Ficha: </strong> {{ ficha.codigo_ficha }}
                    </p>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row justify="start" align="center" style="gap: 10px">
                      <v-chip
                        v-for="(mes, index) in ficha.meses"
                        :key="index"
                        :color="promedioHorasMes(mes.instructores)[1]"
                        @click="
                          mostrarReporteInstructores(mes.instructores, mes.mes)
                        "
                      >
                        {{ meses[mes.mes - 1] }} -
                        {{ promedioHorasMes(mes.instructores)[0] }}
                      </v-chip>
                    </v-row>
                    <v-row
                      v-if="reportePorInstructor"
                      class="mt-3 flex-column align-center"
                    >
                      <v-col cols="12" lg="10">
                        <v-data-table
                          :headers="headersReporte"
                          :items="reporteInstructores"
                          :calculate-widths="true"
                          fixed-header
                          :items-per-page="10"
                          disable-pagination
                          hide-default-footer
                          class="elevation-1 w-full"
                          no-data-text="Sin reportes"
                        >
                          <template v-slot:top>
                            <v-toolbar flat>
                              <v-toolbar-title
                                >{{ mesReporte }}
                              </v-toolbar-title>
                              <v-divider
                                class="mx-4"
                                inset
                                vertical
                              ></v-divider>
                              <v-row justify="end" no-gutters style="gap: 8px">
                                <v-chip color="orange" dark> De planta </v-chip>
                                <v-chip color="indigo" dark>
                                  Contratista
                                </v-chip>
                              </v-row>
                            </v-toolbar>
                          </template>
                          <template v-slot:item.instructor="{ item }">
                            <v-chip
                              :color="
                                item.tipoVinculacion != 'CONTRATISTA'
                                  ? 'orange'
                                  : 'indigo'
                              "
                              dark
                            >
                              {{ item.instructor }}
                            </v-chip>
                          </template>
                          <template v-slot:item.horas="{ item }">
                            <v-chip
                              :color="
                                getColor(item.tipoVinculacion, item.horas)
                              "
                              dark
                            >
                              {{ item.horas }}
                            </v-chip>
                          </template>
                        </v-data-table>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import axios from "axios";
export default {
  data: () => ({
    api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
    programas: [],
    fichas: [],
    headersReporte: [
      {
        text: "Instructor",
        value: "instructor",
        sortable: true,
        width: "max-content",
        cellClass: "text-no-wrap",
      },
      {
        text: "Horas",
        value: "horas",
        sortable: true,
        cellClass: "text-no-wrap",
      },
    ],
    mesReporte: "Enero",
    reportePorInstructor: false,
    reporteInstructores: [],
    meses: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  }),
  methods: {
    async fichasPrograma(programa) {
      if (programa) {
        const fichasData = await axios.get(
          `${this.api}/gestor-horas-ficha/programa/${programa}`
        );
        this.fichas = fichasData.data;
      }
    },
    promedioHorasMes(instructores = []) {
      let totalHoras = 0;
      instructores.forEach((instructor) => {
        totalHoras += instructor.horas;
      });
      const prom = totalHoras / instructores.length;
      let color = "red";
      if (prom >= 120 && prom <= 160) {
        color = "green";
      } else if (prom > 160) {
        color = "orange";
      }
      return [`${prom} ${prom == 1 ? " hora" : " horas"}`, color];
    },
    mostrarReporteInstructores(instructores = [], mes = 1) {
      this.reporteInstructores = instructores.map((instructor) => ({
        instructor: `${instructor.nombre} ${instructor.apellido}`,
        horas: instructor.horas,
        tipoVinculacion: instructor.tipoVinculacion,
      }));
      this.mesReporte = `Reporte de ${this.meses[mes - 1]}`;
      this.reportePorInstructor = true;
    },
    getColor(vinculacion = "contratista", horas = 0) {
      vinculacion = vinculacion.toLowerCase();
      switch (vinculacion) {
        case "contratista":
          if (horas == 160) {
            return "green";
          } else if (horas < 160) {
            return "red";
          }
          return "orange";

        default:
          if (horas >= 120 && horas <= 160) {
            return "green";
          } else if (horas < 120) {
            return "red";
          }
          return "orange";
      }
    },
  },
  async mounted() {
    //Buscamos los programas asignados al coordinador
    const data = await axios.get(
      `${this.api}/users/coordinador/${this.$store.getters.usuario?.id}`
    );
    this.programas = data.data.programas;
  },
};
</script>
<!-- <style>
table > tbody > tr > td:nth-child(1),
table > thead > tr > th:nth-child(1) {
  position: sticky !important;
  position: -webkit-sticky !important;
  left: 0;
  z-index: 1 !important;
  background: white;
}

table > thead > tr > th:nth-child(1) {
  z-index: 3 !important;
} 
</style>-->