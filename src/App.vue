<template>
	<v-app id="inspire">
		<div class="app-container">
			<router-view
				@showOverlay="mostrarOverlay = true"
				@hideOverlay="mostrarOverlay = false"
			/>
			<Spinner :value="mostrarOverlay" />
		</div>
	</v-app>
</template>

<script>
const default_layout = "default";
import Spinner from "./components/Spinner.vue";
export default {
	components: {
		Spinner,
	},
	data: () => ({ mostrarOverlay: false }),
	computed: {
		layout() {
			return (this.$route.meta.layout || default_layout) + "-layout";
		},
	},
};
</script>

<style lang="scss">
@import "assets/base.scss";
@import "scss/_dashboard.scss";

.v-sidebar-menu .vsm-header {
	color: rgb(255, 255, 255);
}

.v-sidebar-menu .vsm-title {
	color: #ffffff;
}
.v-sidebar-menu .vsm-icon {
	color: #ffffff;
}

.v-sidebar-menu .vsm-link:hover {
	background-color: #ffffff70;
}

.v-sidebar-menu .vsm-item.active-item > .vsm-link {
	background-color: #ffffff70;
}
.btn-app-bar {
	border-radius: 50px;
	padding: 6px;
	background-color: #a299a3c5;
}
.btn-app-bar:hover {
	border-radius: 50px;
	padding: 6px;
	background-color: #a299a3 !important;
}

/*    .body-component{
    background-image: url("./assets/fondo.png");
    background-size: cover;
    background-repeat: no-repeat;
    height:100vh;
    background-attachment: fixed;
    overflow: scroll;
  } */

.button-text {
	font-family: "Montserrat", sans-serif;
	font-weight: 500;
}
</style>

<style>
@media (max-width: 575px) {
	.col-xs-1 {
		flex: 0 0 8.3333333333% !important;
		max-width: 8.3333333333% !important;
	}
	.col-xs-2 {
		flex: 0 0 16.6666666667% !important;
		max-width: 16.6666666667% !important;
	}
	.col-xs-3 {
		flex: 0 0 25% !important;
		max-width: 25% !important;
	}
	.col-xs-4 {
		flex: 0 0 33.3333333333% !important;
		max-width: 33.3333333333% !important;
	}
	.col-xs-5 {
		flex: 0 0 41.6666666667% !important;
		max-width: 41.6666666667% !important;
	}
	.col-xs-6 {
		flex: 0 0 50% !important;
		max-width: 50% !important;
	}
	.col-xs-7 {
		flex: 0 0 58.3333333333% !important;
		max-width: 58.3333333333% !important;
	}
	.col-xs-8 {
		flex: 0 0 66.6666666667% !important;
		max-width: 66.6666666667% !important;
	}
	.col-xs-9 {
		flex: 0 0 75% !important;
		max-width: 75% !important;
	}
	.col-xs-10 {
		flex: 0 0 83.3333333333% !important;
		max-width: 83.3333333333% !important;
	}
	.col-xs-11 {
		flex: 0 0 91.6666666667% !important;
		max-width: 91.6666666667% !important;
	}
	.col-xs-12 {
		flex: 0 0 100% !important;
		max-width: 100% !important;
	}
}
</style>