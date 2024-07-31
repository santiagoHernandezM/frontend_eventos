<template>
  <v-container style="background-color: #e7ebe5">
    <v-row justify="center" align-content="center" style="min-height: 100vh">
      <v-card>
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CAMBIAR CONTRASEÑA
          </v-toolbar-title>
        </v-app-bar>

        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password1"
                    :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[camposRules, min]"
                    :type="showPassword1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Nueva contraseña"
                    counter
                    @click:append="showPassword1 = !showPassword1"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="password2"
                    :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[camposRules, min]"
                    :type="showPassword2 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Confirmar contraseña"
                    counter
                    @click:append="showPassword2 = !showPassword2"
                    outlined
                    color="rgb(52,188,52)"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions style="max-width: 95%; margin: auto">
          <v-btn
            class="ma-2 colorBtnCrear"
            style="color: #fff"
            @click="changePassword()"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <Spinner :value="loading" />

    <Dialogo
      :show="dialogoPasswordRestablecida"
      title="Cambio de contraseña exitoso"
      text="Ya puede cerrar esta ventana"
      @close-dialog="dialogoPasswordRestablecida = $event"
    />
  </v-container>
</template>

<script>
import axios from "axios";
import Dialogo from "../components/Dialog.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: { Dialogo, Spinner },
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}`,
      password1: null,
      password2: null,
      showPassword1: false,
      showPassword2: false,
      camposRules: [(v) => !!v || "Requerido !"],
      min: (v) => v.length >= 6 || "Mínimo 6 caracteres",
      loading: false,
      dialogoPasswordRestablecida: false,
    };
  },

  methods: {
    async changePassword() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        try {
          if (this.password1 == this.password2) {
            let newPassword = this.password2;
            newPassword = { newPassword: newPassword };
            const token = this.$route.query.token;

            const response = await axios.post(
              `${this.api}/users/reset-password`,
              newPassword,
              {
                headers: { authorization: token },
              }
            );
            console.log(response);
            this.password1 = null;
            this.password2 = null;
            this.loading = false;
            this.dialogoPasswordRestablecida = true;
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>

<style></style>
