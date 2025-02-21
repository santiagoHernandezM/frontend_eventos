<template>
	<v-app>
		<v-row justify="center">
			<v-col cols="5" class="justify-center d-flex">
				<v-date-picker
					type="month"
					v-model="mes"
					class="custom-date-picker"
					flat
					elevation="15"
					color="green accent-4"
					width="300"
				>
				</v-date-picker>
			</v-col>
		</v-row>
		<v-row justify="center" class="mt-n15">
			<v-btn
				color="green accent-4"
				class="ma-2 white--text"
				@click="generarExcelEventoProgramas()"
			>
				DESCARGAR ASIGNADOS
				<v-icon right dark> mdi-cloud-download </v-icon>
			</v-btn>
			<v-btn
				color="orange accent-4"
				class="ma-2 white--text"
				@click="generarxls()"
			>
				DESCARGAR TODO
				<v-icon right dark> mdi-cloud-download </v-icon>
			</v-btn>
		</v-row>

		<v-snackbar v-model="show"> Seleccione un mes ... </v-snackbar>
	</v-app>
</template>
<script>
import axios from "axios";
import XLSX from "xlsx";

export default {
	data() {
		return {
			api: `${process.env.VUE_APP_API_URL}`,
			mes: null,
			data: [],
			show: false,
		};
	},
	methods: {
		async generarxls() {
			if (this.mes != null) {
				console.log(this.mes);
				let fecha = this.mes.split("-");
				this.data = [];
				const response = await axios.get(
					`${this.api}/evento/reporte/${fecha[0]}/${fecha[1]}`
				);

				for (let dato of response.data)
					for (let ele of dato) this.data.push(ele);

				this.crearArchivoExcel();
			} else {
				this.show = true;
			}
		},

		crearArchivoExcel() {
			let fecha = this.mes.split("-");
			const libro = XLSX.utils.book_new();
			const hoja = XLSX.utils.json_to_sheet(this.data);
			const filename = `Reporte eventos ${fecha[1]} - ${fecha[0]} `;
			XLSX.utils.book_append_sheet(libro, hoja, filename);
			XLSX.writeFile(libro, `${filename}.xlsx`);
		},

		async generarExcelEventoProgramas() {
			if (this.mes != null) {
				let fecha = this.mes.split("-");
				this.data = [];
				let programas = this.$store.getters.usuario.programas;
				let idprograma = programas.map((e) => e._id);
				let strprograma = idprograma.join(",");
				const response = await axios.get(
					`${this.api}/evento/${fecha[1]}/${fecha[0]}/${strprograma}`
				);

				for (let dato of response.data) this.data.push(dato);

				this.crearArchivoExcel();
			} else {
				this.show = true;
			}
		},
	},
};
</script>

<style>
.custom-date-picker {
	height: 380px; /* Ajusta el valor según tus necesidades */
}
</style>
