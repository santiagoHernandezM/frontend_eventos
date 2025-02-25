<template>
	<v-app id="inspire">
		<Header @handrawer="actualiza()" />
		<Sidebar :drawer="drawer" />

		<v-main>
			<v-container class="py-2" fluid>
				<v-row>
					<v-col cols="12">
						<router-view
							@showOverlay="mostrarOverlay = true"
							@hideOverlay="mostrarOverlay = false"
						/>
					</v-col>
				</v-row>
			</v-container>
		</v-main>
		<Spinner :value="mostrarOverlay" />
		<!-- <Dialogo
      :show="dialogoCierreSesion"
      title="Cerrar sesion"
      text="Realmente desea cerrar su sesion?"
      @close-dialog="dialogoCierreSesion = $event"
    /> -->

		<!-- <v-dialog v-model="dialogoCierreSesion" persistent max-width="670">
      <v-card>
        <v-card-title class="headline">Cerrar sesion</v-card-title>
        <v-card-text> Realmente desea cerrar sesion? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogoCierreSesion = false"
            >Cancelar</v-btn
          >
          <v-btn
            color="green darken-1"
            text
            @click="dialogoCierreSesion = false"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog> -->
	</v-app>
</template>

<script>
import Header from "../components/core/Header.vue";
import Sidebar from "../components/core/Sidebar.vue";
import Spinner from "../components/Spinner.vue";
// import Dialogo from "../components/Dialog.vue";

export default {
	components: { Header, Sidebar, Spinner },
	data: () => ({
		cards: ["Today", "Yesterday"],
		drawer: true,
		dialogoCierreSesion: true,
		mostrarOverlay: false,
	}),
	methods: {
		actualiza() {
			console.log("actualizado");
			this.drawer = !this.drawer;
		},
	},
};
</script>

<style>
#inspire {
	/* background-image: url("../assets/fondo.png"); */
	/* background-color: #e7ebe5; */
	background-color: #e7ebe5;
	background-size: 100% 100%;
	background-attachment: fixed;
	margin: 0;
}
</style>
