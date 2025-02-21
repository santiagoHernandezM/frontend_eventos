<template>
	<v-container>
		<v-row justify="space-around">
			<v-card width="100%">
				<!-- Encabezado -->
				<v-app-bar flat color="rgb(52,188,52)">
					<v-toolbar-title class="text-h6 white--text pl-0">
						REPORTAR EVENTO
					</v-toolbar-title>

					<v-spacer></v-spacer>
				</v-app-bar>

				<v-card-text>
					<v-form>
						<v-container>
							<v-row align="end">
								<v-col cols="6">
									<v-row
										justify="start"
										style="gap: 30px"
										align="center"
										no-gutters
									>
										<span
											class="font-weight-bold text-md-h6"
										>
											Año:
											<span
												class="font-weight-bold text-md-h6 blue--text"
											>
												{{ fechactual.year }}
											</span>
										</span>

										<span
											class="font-weight-bold text-md-h6"
										>
											Mes:
											<span
												class="font-weight-bold text-md-h6 blue--text"
											>
												{{
													mesesEvento[
														indexMesActual
													].value
														.toString()
														.padStart(2, "0")
												}}
												{{
													mesesEvento[indexMesActual]
														.title
												}}
											</span>
										</span>
									</v-row>
								</v-col>
								<v-col cols="12">
									<v-select
										label="Mes"
										:items="mesesEvento"
										item-text="title"
										item-value="value"
										v-model="paquete.mes"
										:rules="camposRules"
										append-icon="mdi mdi-calendar-month-outline"
										outlined
									/>
								</v-col>
							</v-row>
							<v-row class="mb-n10">
								<v-col cols="12">
									<v-select
										class="pt-0 mt-0"
										label="Programa"
										:items="programas"
										item-text="nombre"
										item-value="_id"
										v-model="paquete.programa.id"
										:rules="camposRules"
										append-icon="mdi mdi-school"
										outlined
										@change="cargarfichas()"
									>
									</v-select>
								</v-col>
							</v-row>

							<v-row class="mb-n10">
								<v-col cols="3">
									<v-select
										label="Ficha"
										:items="fichas"
										item-text="codigo"
										item-value="_id"
										@change="cargadatos()"
										v-model="paquete.ficha.ficha"
										:rules="camposRules"
										append-icon="mdi mdi-newspaper-variant-multiple-outline"
										outlined
									>
									</v-select>
								</v-col>

								<v-col cols="3">
									<v-text-field
										v-model="paquete.nivel"
										label="Nivel"
										append-icon="mdi mdi-account-school"
										readonly
										outlined
									></v-text-field>
								</v-col>

								<v-col cols="3">
									<v-text-field
										v-model="paquete.municipio"
										label="Municipio"
										append-icon="mdi mdi-map-marker-radius"
										readonly
										outlined
									></v-text-field>
								</v-col>
								<v-col cols="3">
									<v-select
										:items="ambientes"
										item-text="codigo"
										item-value="_id"
										label="Ambiente"
										v-model="paquete.ambiente.id"
										append-icon="mdi mdi-home"
										:rules="camposRules"
										outlined
										@change="cargaambiente()"
									>
										<template v-slot:item="{ item }">
											{{ item.bloque.nomenclatura }}-{{
												item.codigo
											}}
										</template>

										<template
											slot="selection"
											slot-scope="data"
										>
											{{ data.item.bloque.nomenclatura }}
											-
											{{ data.item.codigo }}
										</template>
									</v-select>
								</v-col>
							</v-row>

							<v-row class="mb-n10">
								<v-col cols="4">
									<v-select
										v-model="paquete.dia"
										item-text="dia"
										item-value="dia"
										:items="diasemana"
										@change="horario()"
										append-icon="mdi-calendar"
										label="Día"
										outlined
									>
									</v-select>
								</v-col>
								<v-col cols="4">
									<v-text-field
										v-model="paquete.horario"
										label="Horario"
										append-icon="mdi-calendar"
										readonly
										outlined
									></v-text-field>
								</v-col>

								<semanas
									:dia="diase"
									:mes="paquete.mes"
									:year="fechactual.year"
									@dias="diast"
								></semanas>
							</v-row>

							<v-row class="mb-n10">
								<v-col cols="12">
									<v-select
										v-model="
											paquete.competencia.competencia
										"
										item-text="nombre"
										item-value="nombre"
										:items="competencias"
										@change="cargaresultados()"
										label="Competencia"
										outlined
									>
										<template v-slot:item="slotProps">
											{{ slotProps.item.duracion }}/{{
												slotProps.item.acumulado
											}}
											: {{ slotProps.item.nombre }}
										</template>
									</v-select>
								</v-col>
							</v-row>

							<v-row class="mb-n15">
								<v-col cols="12">
									<v-select
										v-model="paquete.resultado"
										:items="resultados"
										label="Resultado aprendizaje"
										multiple
										:item-value="(item) => item"
										:item-text="
											(item) => {
												return `${item.duracion}/${item.acumulado}: ${item.descripcion}`;
											}
										"
										outlined
									>
									</v-select>
								</v-col>
							</v-row>

							<v-row v-if="paquete.horas != null">
								<v-col cols="12">
									<span>Total horas</span>
									<v-chip
										class="ma-2"
										color="green"
										text-color="white"
									>
										{{ paquete.horas }}
									</v-chip>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
				</v-card-text>

				<v-card-actions class="" style="max-width: 95%; margin: auto">
					<v-btn
						class="colorBtnCrear"
						style="color: #fff"
						outlined
						@click="validador()"
					>
						Crear Evento
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-row>

		<v-row
			class="mt-5"
			justify="space-around"
			v-if="evento.eventos.length > 0"
		>
			<v-expansion-panels>
				<v-expansion-panel>
					<v-expansion-panel-header>
						<v-app-bar flat color="rgb(52,188,52)">
							<v-app-bar-nav-icon
								color="white"
							></v-app-bar-nav-icon>
							<v-toolbar-title class="text-h6 white--text pl-0">
								Eventos A Reportar
							</v-toolbar-title>
						</v-app-bar>
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<LeventoView
							:evento="evento.eventos"
							@enviardatos="enviareventos"
							@eliminarevento="eliminarevento"
						>
						</LeventoView>
						<v-row>
							<v-col>
								<v-btn
									block
									class="ma-2"
									outlined
									color="indigo"
									@click="enviareventos()"
								>
									GUARDAR EVENTOS
								</v-btn>
							</v-col>
						</v-row>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-row>

		<v-row class="mt-5" justify="space-around">
			<v-expansion-panels>
				<v-expansion-panel>
					<v-expansion-panel-header>
						<v-app-bar
							flat
							color="rgb(52,188,52)"
							class="app-bar-eventos-reportados"
						>
							<v-toolbar-title class="text-h6 white--text pl-0">
								Eventos Reportados en el MES
							</v-toolbar-title>
							<div class="info-horas">
								<v-row
									no-gutters
									justify="start"
									align="center"
									style="gap: 10px"
								>
									<h5 class="white--text m-0">
										Total horas reportadas
									</h5>
									<v-chip color="yellow" outlined>
										{{ totalhoras }}
									</v-chip>
								</v-row>
							</div>
						</v-app-bar>
					</v-expansion-panel-header>
					<v-expansion-panel-content>
						<v-col cols="12">
							<v-autocomplete
								v-model="mesShowEventos"
								@change="bdeventos"
								:items="mesesEvento"
								item-text="title"
								item-value="value"
								filled
								label="Meses"
								append-icon="mdi mdi-calendar-month-outline"
							/>
						</v-col>
						<LeventoView
							:evento="saveeventos"
							tipo="2"
							@eliminareventobd="eliminareventobd"
						>
						</LeventoView>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</v-row>
		<v-snackbar v-model="snackbar">
			{{ text }}
			<template v-slot:action="{ attrs }">
				<v-btn
					color="red"
					text
					v-bind="attrs"
					@click="snackbar = false"
				>
					Cerrar
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>
<script>
import axios from "axios";
import semanas from "../components/semanas.vue";
import LeventoView from "../components/LeventoView.vue";
const colombia = require("../json/ciudades");
export default {
	components: {
		semanas,
		LeventoView,
	},

	props: {
		datos: Object,
		mostrar: Boolean,
	},
	data() {
		return {
			snackbar: false,
			text: "",
			horajornada: 0,
			api: `${process.env.VUE_APP_API_URL}`,
			paqdiasmes: null,
			totalhoras: 0,
			saveeventos: [],
			mesShowEventos: null,
			evento: {
				instructor: null,
				eventos: [],
			},
			indexMesActual: 0,
			limpieza: null,
			paquete: {
				mes: null,
				ficha: {
					ficha: null,
					codigo: null,
				},
				programa: {
					nombre: null,
					id: null,
				},
				nivel: null,
				municipio: null,
				ambiente: {
					id: null,
					ambiente: null,
				},
				dia: null,
				horario: null,
				horas: null,
				diastrabajados: [],
				competencia: {
					competencia: null,
					codigo: null,
				},
				resultado: [],
				/* {
           resultado : null,
           orden : null,
        } */ conflict: false,
			},
			centros: null, //Aquí se cargan todos los centros que están en la bd
			fechactual: {
				mes: null,
				mesNum: 0,
				year: 0,
			},
			instructor: null,
			fichas: [],
			ambientes: [],
			competencias: [],
			resultados: [],
			dia: null,
			programas: [],
			diase: null,
			diasemana: [],
			mesesEvento: [
				{ title: "Enero", value: 1 },
				{ title: "Febrero", value: 2 },
				{ title: "Marzo", value: 3 },
				{ title: "Abril", value: 4 },
				{ title: "Mayo", value: 5 },
				{ title: "Junio", value: 6 },
				{ title: "Julio", value: 7 },
				{ title: "Agosto", value: 8 },
				{ title: "Septiembre", value: 9 },
				{ title: "Octubre", value: 10 },
				{ title: "Noviembre", value: 11 },
				{ title: "Diciembre", value: 12 },
			],
			error: null,
			departamentos: colombia,
			camposRules: [(v) => !!v || "Campo es requerido"],
		};
	},

	methods: {
		async cargarfichas() {
			let centro = this.$store.getters.usuario.centro;
			const sedes = await axios.get(`${this.api}/sedes/centro/${centro}`);
			this.fichas = [];
			for (let sed of sedes.data) {
				const fichas = await axios.get(
					`${this.api}/ficha/programa/${this.paquete.programa.id}/sede/${sed._id}`
				);
				for (let x of fichas.data) {
					this.fichas.push(x);
				}
			}
		},

		cargaambiente() {
			let amb = this.ambientes.filter(
				(e) => e._id == this.paquete.ambiente.id
			);
			this.paquete.ambiente.ambiente =
				amb[0].bloque.nomenclatura + "-" + amb[0].codigo;
		},

		async eliminareventobd(pos) {
			let usuario = this.$store.getters.usuario.id;
			let vm = this;
			const paq = {
				instructor: usuario,
				evento: this.saveeventos[pos],
				mes: parseInt(this.saveeventos[pos].mes),
				year: parseInt(this.saveeventos[pos].year),
				eventIndex: pos,
			};
			await axios
				.post(`${this.api}/evento/eliminar/especifico`, paq)
				.then(function () {
					vm.bdeventos();
				});
		},

		eliminarevento(pos) {
			this.evento.eventos.splice(pos, 1);
		},

		async bdeventos() {
			let context = this;
			await axios
				.get(
					`${this.api}/evento/especificos/${context.mesShowEventos}/${context.fechactual.year}/instructor/${this.evento.instructor}`
				)
				.then(function (response) {
					const e =
						response.data.length > 0
							? response.data[0].eventos
							: [];

					context.saveeventos = e.map((ev) => {
						return {
							...ev,
							mes: context.mesShowEventos,
							year: context.fechactual.year,
						};
					});
				})
				.catch((error) => {
					console.log(error.response);
					switch (error.response.data.statusCode) {
						case 400:
							this.text =
								"No se encontraron eventos para este mes";
							break;

						default:
							this.text = "Sucedió un error buscando";
							break;
					}
					context.saveeventos = [];
					this.snackbar = true;
				});
		},
		async enviareventos() {
			var wd = this;
			await axios
				.post(`${this.api}/evento/crear`, this.evento)
				.then(function () {
					wd.evento.eventos = [];
					wd.bdeventos();
				})
				.catch(function (error) {
					{
						wd.evento.eventos = [];
						for (let datos of error.response.data.message) {
							let ele = datos.evento;
							ele.conflict = true;
							ele.mensaje = datos.mensaje;
							wd.evento.eventos.push(
								JSON.parse(JSON.stringify(ele))
							);
						}
					}
				});
		},
		actualizaorden() {
			let r = this.resultados.filter(
				(e) => e.descripcion == this.paquete.resultado.resultado
			);
			this.paquete.resultado.orden = r[0].orden;
		},
		cargaresultados() {
			this.paquete.resultado = [];
			let r = this.competencias.filter(
				(e) => e.nombre == this.paquete.competencia.competencia
			);
			this.paquete.competencia.codigo = r[0].codigo;
			this.resultados = r[0].resultados;
		},
		diast(dias) {
			this.paqdiasmes = dias;
			this.paquete.diastrabajados = this.paqdiasmes.diastrabajados;
			this.paquete.horas =
				this.paquete.diastrabajados.length * this.horajornada;
		},

		horario() {
			const res = this.fichas.filter(
				(e) => e._id === this.paquete.ficha.ficha
			);
			const j = res[0].jornadas.filter((e) => e.dia == this.paquete.dia);

			if (j.length > 0) {
				this.paquete.horario = `${j[0].horaInicio}-${j[0].horaFin}`;
				this.horajornada = 8;
				const inicio_fin = `${parseInt(j[0].horaInicio)}-${parseInt(
					j[0].horaFin
				)}`;
				let horas = parseInt(j[0].horaFin) - parseInt(j[0].horaInicio);
				if (inicio_fin == "6-12" || inicio_fin == "12-18") {
					horas += 2;
				}
				this.horajornada = horas;
				let r = this.diasemana.filter((e) => e.dia == this.paquete.dia);
				this.diase = r[0].ndia;
				this.paqdiasmes.diastrabajados = [];
				this.paquete.horas = 0;
			}
		},

		async cargadatos() {
			const res = this.fichas.filter(
				(e) => e._id === this.paquete.ficha.ficha
			);
			console.log("ficha:", res[0]);

			this.paquete.ficha.codigo = res[0].codigo;
			this.paquete.programa.nombre = res[0].programa.nombre;
			this.paquete.programa.id = res[0].programa._id;
			this.paquete.nivel = res[0].programa.nivel;
			this.paquete.municipio = res[0].sede.municipio;
			this.paquete.ambiente.id = res[0].ambiente._id;
			const dias = [
				"LUNES",
				"MARTES",
				"MIÉRCOLES",
				"JUEVES",
				"VIERNES",
				"SÁBADO",
				"DOMINGO",
			];
			/*
			 * dia: "LUNES", ndia: 1
			 * dia: "MARTES", ndia: 2
			 * dia: "MIÉRCOLES", ndia: 3
			 * dia: "JUEVES", ndia: 4
			 * dia: "VIERNES", ndia: 5
			 * dia: "SÁBADO", ndia: 6
			 */
			this.diasemana = res[0].jornadas.map((jornada) => {
				return {
					dia: jornada.dia,
					ndia: dias.findIndex((d) => d === jornada.dia) + 1,
				};
			});
			const ambientesResponse = await axios.get(
				`${this.api}/ambiente/sede/${res[0].sede._id}`
			);
			this.ambientes = ambientesResponse.data;

			let amb = this.ambientes.filter(
				(e) => e._id == this.paquete.ambiente.id
			);
			this.paquete.ambiente.ambiente =
				amb[0].bloque.nomenclatura + "-" + amb[0].codigo;

			const competenciasgestor = await axios.get(
				`${this.api}/gestor-t/${this.paquete.ficha.ficha}/`
			);

			this.competencias = competenciasgestor.data[0].competencias;

			//const competencias = await axios.get(`${this.api}/competencia/programa/${res[0].programa._id}`);
			//  console.log(competencias.data)
			//this.competencias = competencias.data[0].competencias
		},

		validador() {
			let total = this.paquete.resultado.reduce(
				(accumulator, resultado) =>
					accumulator + (resultado.duracion - resultado.acumulado),
				0
			);
			if (
				this.paquete.diastrabajados.length <
				this.paquete.resultado.length
			) {
				(this.snackbar = true),
					(this.text = `El numero de dias trabajados no es suficiente para el numero de
                        resultados de aprendizajes a reportar`);
				return false;
			} else {
				if (total < this.paquete.horas) {
					(this.snackbar = true),
						(this.text = `El numero de horas trabajadas supera al numero de horas del
          resultado de aprendizaje`);
					return false;
				} else {
					if (this.paquete.resultado.length > 1) {
						let acumulado = this.paquete.horas;
						let diast = this.paquete.diastrabajados;
						let newpaquete = JSON.parse(
							JSON.stringify(this.paquete)
						);
						let ele = 0;
						let presul = 0;

						for (let eresultado of this.paquete.resultado) {
							let diastomar = 1;

							if (acumulado > 0) {
								let horasf =
									eresultado.duracion - eresultado.acumulado;
								if (
									horasf >= this.horajornada &&
									acumulado > this.horajornada
								) {
									diastomar = Math.trunc(
										horasf / this.horajornada
									);
									newpaquete.horas =
										this.horajornada * diastomar;
									acumulado -= this.horajornada * diastomar;
								} else {
									if (horasf > acumulado) {
										newpaquete.horas = acumulado;
										acumulado -= acumulado;
									} else {
										newpaquete.horas = horasf;
										acumulado -= horasf;
									}
								}

								newpaquete.diastrabajados = [];
								for (let x = 1; x <= diastomar; x++) {
									newpaquete.diastrabajados.push(diast[ele]);
									ele += 1;
								}
								console.log(this.paquete.resultado[presul]);

								const { descripcion, orden } =
									this.paquete.resultado[presul];
								var obj = new Object();
								obj.resultado = descripcion;
								obj.orden = orden;
								console.log(obj);

								//    newpaquete.resultado = this.paquete.resultado[presul]
								newpaquete.resultado = obj;
								// a is constant

								this.guardar(newpaquete);
							}

							presul += 1;
						}
						this.paquete = JSON.parse(
							JSON.stringify(this.limpieza)
						);
					} else {
						const { descripcion, orden } =
							this.paquete.resultado[0];
						var obje = new Object();
						obje.resultado = descripcion;
						obje.orden = orden;
						this.paquete.resultado = obje;
						this.guardar(this.paquete);
						this.paquete = JSON.parse(
							JSON.stringify(this.limpieza)
						);
					}
				}
			}
		},

		guardar(paquete) {
			//const p = JSON.parse(JSON.stringify(this.paquete))
			const p = JSON.parse(JSON.stringify(paquete));

			if (this.evento.eventos.length == 0) {
				this.evento.eventos.push({ ...p, year: this.fechactual.year });
				// this.paquete = JSON.parse(JSON.stringify(this.limpieza))
				this.diase = null;
				this.paqdiasmes.diastrabajados = [];
			} else {
				var comun = [];
				for (let data of this.evento.eventos) {
					comun = data.diastrabajados.filter((elemento) =>
						p.diastrabajados.includes(elemento)
					);
					if (comun > 0) break;
				}

				let r = this.evento.eventos.filter(
					(e) =>
						e.mes == p.mes &&
						e.dia == p.dia &&
						e.ambiente.ambiente == p.ambiente.ambiente &&
						e.horario == p.horario &&
						comun.length > 0
				);
				if (r.length > 0) alert("Ya tiene el mismo evento registrado");
				else {
					this.evento.eventos.push({
						...p,
						year: this.fechactual.year,
					});
					//  this.paquete = JSON.parse(JSON.stringify(this.limpieza))
					this.paqdiasmes.diastrabajados = [];
				}
			}
		},
	},

	computed: {
		ciuda() {
			var ciudades = null;
			for (var pos in this.departamentos) {
				if (
					this.departamentos[pos].departamento ==
					this.paquete.departamento
				) {
					ciudades = this.departamentos[pos].ciudades;
				}
			}
			return ciudades;
		},
	},

	async mounted() {
		this.limpieza = JSON.parse(JSON.stringify(this.paquete));
		let instructor = this.$store.getters.usuario.id;

		const fecha = await axios.get(`${this.api}/date/`);
		this.fechactual = fecha.data;
		//Encuentro el index para recortar
		this.indexMesActual = this.mesesEvento.findIndex(
			(mes) => mes.value == this.fechactual.mesNum
		);
		this.mesesEvento = this.mesesEvento.slice(
			this.indexMesActual,
			this.mesesEvento.length
		);
		//Guardo el index actualizado al corte
		this.indexMesActual = this.mesesEvento.findIndex(
			(mes) => mes.value == this.fechactual.mesNum
		);

		this.paquete.mes = this.fechactual.mesNum;
		this.evento.instructor = instructor;
		this.mesShowEventos = this.fechactual.mesNum;
		await this.bdeventos();

		// const inst = await axios.get(`${this.api}/instructor/${instructor}`);
		// this.instructor = inst.data

		this.programas = this.$store.getters.usuario.programas;
	},
	watch: {
		saveeventos() {
			this.totalhoras = this.saveeventos.reduce(
				(accumulator, currentValue) => accumulator + currentValue.horas,
				0
			);
		},
		"paquete.mes"(mes, oldValue) {
			if (mes != null) {
				this.indexMesActual = this.mesesEvento.findIndex(
					(m) => m.value == mes
				);
			} else {
				this.indexMesActual = this.mesesEvento.findIndex(
					(m) => m.value == oldValue
				);
			}
		},
	},
};
</script>
<style>
* {
	box-sizing: border-box;
}
.fondo {
	background: linear-gradient(
		90deg,
		rgba(138, 74, 22, 0.7820378151260504) 15%,
		rgba(6, 92, 23, 1) 49%,
		rgba(226, 175, 56, 1) 82%
	);
}

.numero {
	border: 2px solid rgb(136, 136, 136);
	padding: 2px 20px;
}

.instructor {
	border-bottom: 2px solid rgb(136, 136, 136);
}
.row-height {
	height: 150px; /* Ajusta la altura según tus necesidades */
}

.app-bar-eventos-reportados .v-toolbar__content {
	justify-content: space-between !important;
}
</style>
