<template>
  <v-row justify="center" class="flex-column align-center" no-gutters>
    <v-col cols="11">
      <v-card>
        <v-toolbar color="rgb(52,188,52)" dark flat>
          <v-toolbar-title>Instructores</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="instructores"
            :items-per-page="5"
            :calculate-widths="true"
            class="elevation-1 w-full"
            no-data-text="Sin instructores"
          >
            <template v-slot:item.programas="{ item }">
              {{
                item.programas.flatMap((programa) => programa.nombre).join(", ")
              }}
            </template>
            
            <template v-slot:item.actions="{ item }">
              <v-row justify="center" class="gap-2 g-2" style="gap: 9px">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="info"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="mostrarDialogContrato(item._id)"
                    >
                      <v-icon>mdi mdi-file-document-edit-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Editar contrato</span>
                </v-tooltip>
                <v-tooltip top v-if="item.activo">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="red"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="cambiarEstadoUsuario(item._id, false)"
                    >
                      <v-icon>mdi mdi-account-lock-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Desactivar usuario</span>
                </v-tooltip>
                <v-tooltip top v-else>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="green"
                      v-bind="attrs"
                      v-on="on"
                      fab
                      x-small
                      dark
                      @click="cambiarEstadoUsuario(item._id, true)"
                    >
                      <v-icon>mdi mdi-account-lock-open-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Activar usuario</span>
                </v-tooltip>
              </v-row>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title dark class="text-h5 card-title-green">
            Editar contrato
          </v-card-title>
          <v-card-text class="pt-5">
            <v-form ref="formContrato">
              <v-row justify="space-between" class="flex-wrap">
                <v-col class="col-xs-12" sm="12" md="6">
                  <v-text-field
                    label="Número de contrato"
                    append-icon="mdi-key"
                    v-model="info_contrato.numero"
                    :rules="camposRules"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
                <v-col class="col-xs-12" sm="12" md="6">
                  <v-select
                    :rules="camposRules"
                    :items="tipo"
                    label="Tipo de vinculación"
                    v-model="info_contrato.tipoVinculacion"
                    append-icon="map"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row justify="space-between" class="flex-wrap">
                <v-col class="col-xs-12" sm="12" md="6">
                  <v-menu
                    v-model="fechaInicio"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="info_contrato.fechaInicio"
                        label="Inicio contrato"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        color="rgb(52,188,52)"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="info_contrato.fechaInicio"
                      @input="fechaInicio = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col class="col-xs-12" sm="12" md="6">
                  <v-menu
                    v-model="fechaFin"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="info_contrato.fechaTerminacion"
                        label="Terminación contrato"
                        append-icon="mdi-calendar"
                        readonly
                        outlined
                        color="rgb(52,188,52)"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="info_contrato.fechaTerminacion"
                      @input="fechaFin = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-end">
            <v-btn color="success" dark @click="dialog = false"> Editar </v-btn>
            <v-btn color="red" dark text @click="dialog = false">
              Cancelar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-snackbar v-model="info_snackbar.show" :timeout="info_snackbar.timeout">
      {{ info_snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="info_snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>
<script>
import axios from "axios";
export default {
  name: "AdministrarInstructores",
  data: () => ({
    API: `${process.env.VUE_APP_API_URL}`,
    token: {
      headers: {
        Authorization: null,
      },
    },
    headers: [
      {
        text: "Documento",
        value: "documento",
        width: "max-content",
        cellClass: "text-no-wrap",
        sortable: true,
      },
      {
        text: "Nombre",
        value: "nombre",
        cellClass: "text-no-wrap",
        sortable: true,
      },
      {
        text: "Apellido",
        value: "apellido",
        cellClass: "text-no-wrap",
        sortable: true,
      },
      {
        text: "Correo",
        value: "correo",
        cellClass: "text-no-wrap",
        sortable: true,
      },
      {
        text: "Celular",
        value: "celular",
        cellClass: "text-no-wrap",
        sortable: true,
      },
      { text: "Programas", value: "programas", cellClass: "text-no-wrap" },
      { text: "Acciones", value: "actions", sortable: false },
    ],
    instructores: [],
    fechaInicio: false,
    fechaFin: false,
    info_snackbar: {
      show: false,
      text: "",
      color: null,
      timeout: 1600,
    },
    info_contrato: {
      id: null,
      numero: null,
      fechaInicio: null,
      fechaTerminacion: null,
      tipoVinculacion: null,
    },
    dialog: false,
    tipo: ["CONTRATISTA", "CARRERA ADMINISTRATIVA"],
    camposRules: [(v) => !!v || "Requerido !"],
  }),
  methods: {
    mostrarDialogContrato(id = null) {
      if (id != null) {
        const contrato = this.instructores.find(
          (instructor) => instructor._id == id
        );
        if (contrato != null) {
          this.info_contrato = contrato.contrato;
          this.info_contrato.id = id;
          this.dialog = true;
        }
      }
    },
    async getInstructoresPrograma() {
      await axios
        .get(
          `${this.API}/users/coordinador/${this.$store.getters.usuario.id}/programas/instructores`,
          this.token
        )
        .then((resp) => {
          this.instructores = resp.data;
        });
    },
    async cambiarEstadoUsuario(usuario = null, estado = false) {
      if (usuario != null) {
        await axios
          .put(
            `${this.API}/users/${usuario}/nuevo_estado/${estado}`,
            {},
            this.token
          )
          .then((resp) => {
            if (!resp.data.error) {
              this.getInstructoresPrograma();
            }
            this.info_snackbar.text = resp.data.message;
            this.info_snackbar.show = true;
          });
      }
    },
  },
  async mounted() {
    this.token.headers.Authorization = `Bearer ${this.$store.getters.usuario.access_token}`;
    this.getInstructoresPrograma();
  },
};
</script>
<style>
.card-title-green {
  background-color: rgb(52, 188, 52);
}
</style>