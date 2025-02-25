<template>
	<v-app>
		<v-container>
			<v-row justify="space-around">
				<v-card width="100%">
					<v-app-bar
						flat
						color="#278d16"
						height="70px"
						class="toolbar-disponibilidad"
					>
						<v-toolbar-title class="text-h6 white--text pl-0">
							Disponibilidad
						</v-toolbar-title>

						<v-row justify="end" align="center" no-gutters>
							<v-col cols="6">
								<v-select
									:items="ambsedes"
									item-text="nombre"
									item-value="_id"
									v-model="sede"
									background-color="#FFFFFF"
									class="select-disponibilidad"
									color="white"
									label="Seleccione una sede"
									@change="cargarambientes()"
								>
								</v-select>
							</v-col>
							<v-col cols="5">
								<v-select
									:items="calendario"
									item-text="nombre"
									item-value="id"
									v-model="ambiente"
									class="select-disponibilidad"
									background-color="#FFFFFF"
									color="white"
									label="Seleccione Ambiente"
									@change="cargardisponibilidad()"
								>
								</v-select>
							</v-col>
						</v-row>

						<v-chip
							class="ma-1"
							color="rgb(177, 231, 111)"
							text-color="black"
						>
							Disponible
						</v-chip>
						<v-chip
							class="ma-1"
							:color="cocupado"
							text-color="black"
						>
							Ocupado
						</v-chip>
					</v-app-bar>
					<v-card-text v-if="ambiente != null">
						<v-row>
							<v-col>
								<v-sheet height="600">
									<v-calendar
										ref="calendar"
										:events="events"
										color="blue"
										:event-overlap-mode="mode"
										:event-overlap-threshold="30"
										@click:event="showEvent"
									></v-calendar>
								</v-sheet>
							</v-col>
						</v-row>
					</v-card-text>
				</v-card>
			</v-row>
			<v-dialog v-model="dialog" width="600">
				<v-card>
					<v-app-bar flat color="rgb(52,188,52)">
						<v-toolbar-title
							class="text-h5 white--text font-weight-bold"
						>
							FICHA : {{ paquete.ficha }}
						</v-toolbar-title>
					</v-app-bar>
					<v-card-title class="pb-0">
						Programa : {{ paquete.programa }}
					</v-card-title>
					<v-card-title class="py-0">
						Instructor : {{ paquete.instructor }}
					</v-card-title>
					<v-card-title class="pt-0">
						Celular : {{ paquete.celular_instructor }}
					</v-card-title>
					<v-textarea
						filled
						auto-grow
						label="Competencia"
						rows="4"
						class="ml-10 mr-10 text-uppercase"
						row-height="20"
						v-model="paquete.competencia"
						readonly
						shaped
					>
					</v-textarea>
					<v-textarea
						filled
						auto-grow
						label="Resultado de Aprendizaje"
						rows="4"
						class="ml-10 mr-10 text-uppercase"
						row-height="20"
						v-model="paquete.resultado"
						readonly
						shaped
					>
					</v-textarea>

					<v-divider />

					<v-card-actions class="justify-end">
						<v-btn color="primary" text @click="dialog = false">
							CERRAR
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-container>
	</v-app>
</template>
<script>
import axios from "axios";

export default {
	data() {
		return {
			api: `${process.env.VUE_APP_API_URL}`,
			ambsedes: [],
			mode: "stack",
			events: [],
			calendario: [],
			dialog: false,
			mes: null,
			year: null,
			sede: null,
			cdisponible: "rgb(177, 231, 111)",
			cocupado: "rgb(245, 120, 120)",
			ambiente: null,
			paquete: {
				instructor: null,
				celular_instructor: null,
				ficha: null,
				nivel: null,
				programa: null,
				codigo_competencia: null,
				competencia: null,
				resultado: null,
			},
		};
	},
	methods: {
		async showEvent({ nativeEvent, event }) {
			this.$emit("showOverlay");
			let selectedElement = nativeEvent.target;
			let elemento = selectedElement.textContent;
			let calendar = this.calendario.findIndex((e) => {
				return e.id == this.ambiente;
			});
			console.log("native:", nativeEvent);
			console.log("elemento:", elemento);
			console.log("calendar:", calendar);
			let evento = this.calendario[calendar].calendario[event.pos];
			console.log(evento);
			switch (elemento) {
				case "Tarde":
					if (evento.afternoon != null) {
						try {
							const response = await axios.get(
								`${this.api}/users/instructor/${evento.afternoon.instructor}`
							);
							this.paquete.instructor = `${response.data.nombre} ${response.data.apellido}`;
							this.paquete.celular_instructor =
								response.data.celular;
							this.paquete.programa = evento.afternoon.programa;
							this.paquete.ficha = evento.afternoon.ficha;
							this.paquete.competencia =
								evento.afternoon.competencia.competencia.toUpperCase();
							this.paquete.resultado =
								evento.afternoon.resultado.toUpperCase();
							this.dialog = true;
							console.log(this.paquete.instructor);
						} catch (error) {
							console.error(
								"Error buscando información del evento:",
								error
							);
						}
					}
					break;
				case "Noche":
					if (evento.night != null) {
						try {
							const response = await axios.get(
								`${this.api}/users/instructor/${evento.night.instructor}`
							);
							this.paquete.instructor = `${response.data.nombre} ${response.data.apellido}`;
							this.paquete.celular_instructor =
								response.data.celular;
							this.paquete.programa = evento.night.programa;
							this.paquete.ficha = evento.night.ficha;
							this.paquete.competencia =
								evento.night.competencia.competencia.toUpperCase();
							this.paquete.resultado =
								evento.night.resultado.toUpperCase();
							this.dialog = true;
							console.log(this.paquete.instructor);
						} catch (error) {
							console.error(
								"Error buscando información del evento:",
								error
							);
						}
					}
					break;
				case "Mañana":
					if (evento.morning != null) {
						try {
							const response = await axios.get(
								`${this.api}/users/instructor/${evento.morning.instructor}`
							);
							this.paquete.instructor = `${response.data.nombre} ${response.data.apellido}`;
							this.paquete.celular_instructor =
								response.data.celular;
							this.paquete.programa = evento.morning.programa;
							this.paquete.ficha = evento.morning.ficha;
							this.paquete.competencia =
								evento.morning.competencia.competencia.toUpperCase();
							this.paquete.resultado =
								evento.morning.resultado.toUpperCase();
							this.dialog = true;
							console.log(this.paquete.instructor);
						} catch (error) {
							console.error(
								"Error buscando información del evento:",
								error
							);
						}
					}
					break;
			}
			this.$emit("hideOverlay");
			nativeEvent.stopPropagation();
		},

		async cargarambientes() {
			const response = await axios.get(
				`${this.api}/gestor-ambiente/sede/${this.sede}`
			);
			console.log(response.data);
			this.calendario = response.data[0].ambientes;
			console.log(this.calendario);
		},

		cargardisponibilidad() {
			this.events = [];
			var vm = this;
			var ambiente = this.calendario.filter((e) => {
				return e.id == vm.ambiente;
			});
			console.log(ambiente);
			for (var x = 0; x <= 30; x++) {
				var tempo = x + 1;
				if (tempo < 10) {
					tempo = `0${tempo}`;
				}

				const dia = `${this.year}-0${this.mes}-${tempo}`;
				const starti = new Date(`${dia}T00:00:00`);
				const ffin = new Date(`${dia}T23:59:59`);
				let color = null;
				let even = ambiente[0].calendario[x];

				color = even.morning == null ? this.cdisponible : this.cocupado;
				this.events.push({
					name: "Mañana",
					start: starti,
					end: ffin,
					color: color,
					pos: x,
				});

				color =
					even.afternoon == null ? this.cdisponible : this.cocupado;
				this.events.push({
					name: "Tarde",
					start: starti,
					end: ffin,
					color: color,
					pos: x,
				});

				color = even.night == null ? this.cdisponible : this.cocupado;
				this.events.push({
					name: "Noche",
					start: starti,
					end: ffin,
					color: color,
					pos: x,
				});
			}
		},

		getEvents() {
			const dia = "2023-08-10";
			const starti = new Date(`${dia}T00:00:00`);
			const ffin = new Date(`${dia}T23:59:59`);

			this.events.push({
				name: "aly",
				start: starti,
				end: ffin,
				color: this.colors[this.rnd(0, this.colors.length - 1)],
			}),
				this.events.push({
					name: "aly",
					start: starti,
					end: ffin,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
				}),
				this.events.push({
					name: "aly",
					start: starti,
					end: ffin,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
				});
		},

		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a;
		},
	},

	async mounted() {
		const fecha = await axios.get(`${this.api}/date/`);
		var fechactual = fecha.data;
		this.mes = fechactual.mesNum;
		this.year = fechactual.year;

		let centro = this.$store.getters.usuario.centro;
		const response = await axios.get(`${this.api}/sedes/centro/${centro}`);
		this.ambsedes = response.data;
		/*
      await axios
        .get(`${this.api}/gestor-ambiente`)
        .then(function (response) {
          vm.calendario = response.data.ambientes;
          vm.calendario.push({
             nombre : 'All',
             id : '2'
          })
        
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
       
        });
        */
	},
};
</script>
<style scoped>
.custom-select .v-select__selections .v-select__selection {
	color: red; /* Cambia el color del texto aquí */
	width: 200px;
}
</style>

<style>
.toolbar-disponibilidad > .v-toolbar__content {
	align-content: center;
}

.select-disponibilidad {
	padding: 0 4px;
	height: 30px;
	border-radius: 3px;
	color: #000000;
}
#app .v-select__selection--comma {
	color: #000000;
}
</style>
