<template>
  <v-row justify="space-around">
    <v-col cols="11" lg="10">
      <v-card width="100%">
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            Tiempos Ficha
          </v-toolbar-title>
        </v-app-bar>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                :items="fichas"
                :item-text="
                  (item) => `${item.codigo} - ${item.programa.nombre}`
                "
                v-model="ficha"
                item-value="_id"
                no-data-text="Sin fichas"
                @change="getGestorTiempoFicha"
                label="Fichas"
                return-object
              >
                <template v-slot:item="{ item }">
                  {{ item.codigo }} - {{ item.programa.nombre }}
                </template>

                <template slot="selection" slot-scope="data">
                  {{ data.item.codigo }} - {{ data.item.programa.nombre }}
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" v-if="gestor != null">
      <v-card style="overflow: auto">
        <v-card-title
          class="font-weight-bold text-center justify-content-center headline"
          >COMPETENCIAS</v-card-title
        >
        <v-card-text>
          <v-col cols="12">
            <v-expansion-panels multiple>
              <v-form ref="formGestor">
                <v-expansion-panel
                  v-for="(competencia, index) in gestor.competencias"
                  :key="index"
                >
                  <v-expansion-panel-header>
                    <strong>
                      {{ competencia.codigo }} - {{ competencia.nombre }}
                    </strong>
                    <v-chip
                      :ripple="false"
                      class="me-2"
                      color="primary"
                      style="max-width: max-content !important"
                    >
                      {{ competencia.duracion }}
                    </v-chip>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <h3 class="font-weight-bold headline text-center">
                      RESULTADOS
                    </h3>
                    <v-col cols="12">
                      <v-list>
                        <v-list-item
                          v-for="(resultado, index2) in competencia.resultados"
                          :key="index2"
                          class="resultado-aprendizaje"
                        >
                          <v-list-item-content style="width: 70%">
                            <v-list-item-title
                              style="white-space: break-spaces !important"
                            >
                              {{ resultado.descripcion }}
                            </v-list-item-title>
                          </v-list-item-content>

                          <v-list-item-action
                            class="list-action-input"
                            style="width: 30%"
                          >
                            <v-row
                              no-gutters
                              class="justify-end align-end"
                              style="width: max-content !important; gap: 10px"
                            >
                              <v-col cols="5">
                                <v-text-field
                                  label="Acumulado"
                                  type="number"
                                  min="0"
                                  v-model="resultado.acumulado"
                                  :rules="[camposRules, intensidadRules]"
                                />
                              </v-col>
                              <v-col cols="5">
                                <v-text-field
                                  label="Duración"
                                  type="number"
                                  disabled
                                  min="0"
                                  v-model="resultado.duracion"
                                  :rules="[camposRules, intensidadRules]"
                                />
                              </v-col>
                            </v-row>
                          </v-list-item-action>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-form>
            </v-expansion-panels>
            <v-row no-gutters justify="center" class="mt-5">
              <v-btn
                :disabled="btnActualizar"
                class="colorBtnCrear"
                style="color: #ffffff"
                @click="actualizarTiempos"
              >
                Actualizar tiempos
              </v-btn>
            </v-row>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>
    <Dialogo
      :show="dialog.show"
      :title="dialog.title"
      :text="dialog.text"
      @close-dialog="dialog.show = false"
    />
  </v-row>
</template>
<script>
import axios from "axios";
import Dialogo from "../../components/Dialog.vue";
export default {
  components: { Dialogo },
  data: () => ({
    API: `${process.env.VUE_APP_API_URL}`,
    token: {
      headers: {
        Authorization: null,
      },
    },
    dialog: {
      show: false,
      title: null,
      text: null,
    },
    camposRules: (v) => {
      if (isNaN(v)) {
        return "Valor requerido";
      } else {
        return parseInt(v) >= 0 ? true : "No puede ser negativo";
      }
    },
    ficha: null,
    fichas: [],
    gestor: null,
    btnActualizar: false,
    current_intensidad: 8,
  }),
  methods: {
    intensidadRules(value) {
      return value % this.current_intensidad == 0
        ? true
        : `La duración debe ser múltiplo de ${this.current_intensidad}`;
    },
    async getMisFichas() {
      await axios
        .get(
          `${this.API}/ficha/usuario/${this.$store.getters.usuario.id}`,
          this.token
        )
        .then((resp) => {
          this.fichas = resp.data;
        });
    },
    async getGestorTiempoFicha(ficha = null) {
      if (ficha != null) {
        this.current_intensidad = ficha.programa.intensidad_horaria;
        await axios.get(`${this.API}/gestor-t/${ficha._id}`).then((resp) => {
          this.gestor = resp.data[0];
        });
      }
    },
    async actualizarTiempos() {
      if (this.$refs.formGestor.validate()) {
        //Validamos que la duración de los resultados no sobrepase la duración de la competencia
        const competenciasInvalid = this.gestor.competencias.filter(
          (competencia) => {
            //Comprobamos si algún resultado tiene más acumulado que su duración
            return competencia.resultados.some(
              (resultado) =>
                parseInt(resultado.acumulado) > parseInt(resultado.duracion)
            );
          }
        );
        if (competenciasInvalid.length > 0) {
          this.dialog.title = "Actualizar tiempos ficha";
          this.dialog.text = `El acumulado de los resultados de las competencias ${competenciasInvalid
            .flatMap((competencia) => competencia.codigo)
            .join(", ")} sobrepasan su duración`;
          this.dialog.show = true;
          return;
        }
        //Actualizamos los tiempos
        this.btnActualizar = true;
        const competenciasInt = this.gestor.competencias.map((comp) => {
          let res = comp.resultados.map((resu) => {
            return { ...resu, acumulado: parseInt(resu.acumulado) };
          });
          //Debo actualizar el acumulado de la competencia
          const acum_comp = comp.resultados.reduce(
            (acum, res) => acum + parseInt(res.acumulado),
            0
          );
          return { ...comp, resultados: res, acumulado: parseInt(acum_comp) };
        });

        const paquete = {
          ficha: this.gestor.ficha,
          competencias: competenciasInt,
          acumulado_ficha: competenciasInt.reduce(
            (acum, comp) => acum + parseInt(comp.acumulado),
            0
          ),
        };
        await axios
          .put(`${this.API}/gestor-t`, paquete, this.token)
          .then((resp) => {
            this.dialog.title = "Actualizar tiempos ficha";
            this.dialog.text = resp.data.message;
            this.dialog.show = true;
            this.btnActualizar = false;
            this.ficha = null;
            this.gestor = null;
          });
      } else {
        this.dialog.title = "Actualizar tiempos ficha";
        this.dialog.text = "Revisa la duración de los resultados";
        this.dialog.show = true;
      }
    },
  },
  async created() {
    this.token.headers.Authorization = `Bearer ${this.$store.getters.usuario.access_token}`;
    await this.getMisFichas();
  },
};
</script>
<style>
.list-action-input
  > .row
  > .col
  > .v-input
  > .v-input__control
  > .v-text-field__details
  > .v-messages {
  display: block !important;
  margin-top: 3px;
}

@media (max-width: 690px) {
  .resultado-aprendizaje {
    flex-direction: column !important;
    justify-content: center;
    text-align: center;
  }

  .resultado-aprendizaje > * {
    width: 100% !important;
  }

  .resultado-aprendizaje > .v-list-item__action > .row {
    justify-content: center !important;
  }
}
</style>