<template>
	<v-container>
		<v-row justify="space-around">
			<v-card width="600">
				<!-- Encabezado -->
				<v-app-bar flat color="rgb(52,188,52)">
					<v-toolbar-title class="text-h6 white--text pl-0">
						{{ modoEdicion ? "EDITAR FICHA" : "CREAR FICHA" }}
					</v-toolbar-title>

					<v-spacer></v-spacer>
					<v-btn
						class="ma-2"
						@click="modalFichasMasivo = true"
						v-if="!modoEdicion"
					>
						Subir fichas
						<v-icon right dark>mdi-cloud-upload</v-icon>
					</v-btn>
				</v-app-bar>

				<!-- Formulario -->
				<v-card-text class="carta">
					<v-form ref="form">
						<v-container>
							<v-row>
								<v-col cols="6">
									<v-text-field
										label="Código"
										append-icon="mdi mdi-key-variant"
										v-model="paquete.codigo"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									></v-text-field>
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="6">
									<v-text-field
										v-model="paquete.fechaInicio"
										type="date"
										label="Fecha de inicio"
										outlined
										:rules="camposRules"
										color="rgb(52,188,52)"
									></v-text-field>
								</v-col>

								<v-col cols="6">
									<v-text-field
										v-model="paquete.fechaFin"
										type="date"
										label="Fecha de finalización"
										outlined
										:rules="camposRules"
										color="rgb(52,188,52)"
									></v-text-field>
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="6">
									<v-autocomplete
										:items="sedes"
										item-text="nombre"
										item-value="_id"
										label="Sede"
										v-model="paquete.sede"
										append-icon="mdi mdi-home-city"
										@change="cargarAmbientes(paquete.sede)"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									></v-autocomplete>
								</v-col>

								<v-col cols="6">
									<v-autocomplete
										:items="ambientes"
										:item-text="(ambientes)=>`${ambientes.bloque.nomenclatura} - ${ambientes.codigo}`"
										item-value="_id"
										label="Ambiente"
										v-model="paquete.ambiente"
										append-icon="mdi mdi-home"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									>
										<!-- <template v-slot:item="{ item }">
											{{ item.bloque.nomenclatura }}-{{
												item.codigo
											}}
										</template> -->

										<!-- <template
											slot="selection"
											slot-scope="data"
										>
											{{ data.item.bloque.nomenclatura }}
											-
											{{ data.item.codigo }}
										</template> -->
									</v-autocomplete>
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="12">

									<v-autocomplete
									:items="programas"
										:item-text="(programa)=>`${programa.codigo} - ${programa.nombre} v${programa.version}`"
										item-value="_id"
										label="Programa de formación"
										v-model="paquete.programa"
										append-icon="mdi mdi-school"
										@change="
											instructoresPrograma(
												paquete.programa
											)
										"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									>
									</v-autocomplete>

									<!-- <v-select
										:items="programas"
										item-text="nombre"
										item-value="_id"
										label="Programa de formación"
										v-model="paquete.programa"
										append-icon="mdi mdi-school"
										@change="
											instructoresPrograma(
												paquete.programa
											)
										"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									>
									</v-select> -->
								</v-col>
							</v-row>

							<v-row>
								<v-col cols="6">
									<v-select
										:items="instructores"
										item-text="nombre"
										item-value="_id"
										label="Lider de ficha"
										v-model="paquete.instructor"
										append-icon="mdi mdi-account-tie"
										:rules="camposRules"
										outlined
										color="rgb(52,188,52)"
									>
										<template v-slot:item="{ item }">
											{{ item.nombre }}
											{{ item.apellido }}
										</template>

										<template
											slot="selection"
											slot-scope="data"
										>
											{{ data.item.nombre }}
											{{ data.item.apellido }}
										</template>
									</v-select>
								</v-col>
							</v-row>
						</v-container>
					</v-form>

					<v-row>
						<v-col>
							<v-divider></v-divider>
						</v-col>
					</v-row>

					<!-- Datos de Jornada -->
					<v-form ref="formJornada">
						<v-container>
							<v-row>
								<v-col cols="5">
									<v-select
										:items="diasSemana"
										item-text="diasSemana"
										item-value="diasSemana"
										label="Día"
										v-model="dia"
										append-icon="mdi-calendar"
										:rules="camposRules"
										class="ml-5"
										outlined
										color="rgb(52,188,52)"
									></v-select>
								</v-col>

								<v-col cols="5">
									<v-select
										:items="jornadas"
										item-text="descripcion"
										item-value="descripcion"
										label="Jornada"
										v-model="jornadaInput"
										append-icon="mdi-calendar"
										:rules="camposRules"
										class="ml-5"
										outlined
										color="rgb(52,188,52)"
									></v-select>
								</v-col>

								<v-col cols="1">
									<v-btn
										class="mx-2 mt-2"
										fab
										dark
										color="rgb(52,188,52)"
										width="40px"
										height="40px"
										@click="agregarLista"
									>
										<v-icon dark>mdi-plus</v-icon>
									</v-btn>
								</v-col>
							</v-row>
						</v-container>
					</v-form>

					<!-- Tabla Jornadas -->
					<v-row>
						<v-col cols="12">
							<v-data-table
								:items="paquete.jornadas"
								:headers="cabeceraTablaHorario"
								class="elevation-1 mx-5"
							></v-data-table>
						</v-col>
					</v-row>
				</v-card-text>

				<!-- Acciones: Limpiar / Editar - Cancelar -->
				<v-card-actions style="max-width: 95%; margin: auto">
					<v-btn
						:class="['ma-2', colorBtn]"
						:style="{ color: '#fff' }"
						@click="modoEdicion ? guardarEdicion() : guardar()"
					>
						{{ modoEdicion ? "Editar" : "Crear" }}
					</v-btn>

					<v-btn
						class="ma-2 colorBtnLimpiar"
						v-if="!modoEdicion"
						@click="
							limpiarFormulario();
							limpiarDatosHorario();
						"
					>
						Limpiar
					</v-btn>

					<v-spacer></v-spacer>

					<v-btn
						class="ma-2 white--text colorBtnEliminar"
						v-if="modoEdicion"
						@click="
							limpiarFormulario();
							modoEdicion = false;
						"
					>
						Cancelar
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-row>

		<!-- Tabla listar Fichas -->

		<v-row justify="center" class="flex-column mt-4">
			<v-col cols="12">
				<v-card class="px-3 py-3">
					<v-data-table
						:items="fichas"
						:headers="cabeceraTablaFichas"
						class="elevation-0 w-100"
						:search="search"
						:custom-filter="filterOnlyCapsText"
					>
						<!-- Buscador -->
						<template v-slot:top>
							<v-autocomplete
								:items="programas"
								:item-text= "(programas) => `${programas.codigo} - ${programas.nombre} v${programas.version}`" 
								item-value="_id"
								label="Buscar ficha por programa"
								v-model="paquete.programa"
								append-icon="mdi mdi-school"
								@change="
									cargarFichasProgramas(paquete.programa)
								"
								:rules="camposRules"
								outlined
								color="rgb(52,188,52)"
							/>
						</template>
						<template v-slot:item.fechaInicio="{ value }">
							{{ value.slice(0, 10) }}
						</template>
						<template v-slot:item.fechaFin="{ value }">
							{{ value.slice(0, 10) }}
						</template>
						<template v-slot:item.ambiente="{ value }">
							{{ value.bloque.nomenclatura }}-{{ value.codigo }}
						</template>
						<template v-slot:item.instructor="{ value }">
							{{ value ? value.nombre : null }}
							{{ value ? value.apellido : null }}
						</template>
						<template v-slot:item.jornadas="{ value }">
							<ul>
								<li v-for="(dia, index) in value" :key="index">
									{{ dia.dia }} {{ dia.horaInicio }}-{{
										dia.horaFin
									}}
								</li>
							</ul>
						</template>
						<!-- Listado -->
						<template v-slot:item.actions="{ item }">
							<v-btn
								icon
								@click="dialogEditarFicha(item)"
								id="btn-editar"
							>
								<v-icon id="icono-editar">mdi-pencil</v-icon>
							</v-btn>

							<v-btn
								icon
								@click="metodoEliminar(item)"
								id="btn-eliminar"
							>
								<v-icon id="icono-eliminar">mdi-delete</v-icon>
							</v-btn>
						</template>
					</v-data-table>
				</v-card>
			</v-col>
		</v-row>

		<!-- Cargando... -->
		<Spinner :value="loading" />

		<!-- Dialogo de creación -->
		<Dialogo
			:show="dialogoFichaCreada"
			title="Registro creado con éxito"
			text="Ficha creada"
			@close-dialog="dialogoFichaCreada = $event"
		/>

		<!-- Dialogo de actualización -->
		<Dialogo
			:show="dialogoFichaActualizada"
			title="Registro actualizado con éxito"
			text="Ficha actualizada"
			@close-dialog="dialogoFichaActualizada = $event"
		/>

		<!-- Dialogos de eliminación -->
		<Dialogo_confirm_delete
			:show="dialogo1EliminarFicha"
			title="Realmente quieres eliminar esta ficha?"
			:confirmDeleteMethod="confirmarEliminacion"
			@close-dialog="dialogo1EliminarFicha = $event"
		/>

		<Dialogo
			:show="dialogo2EliminarFicha"
			title="Registro eliminado con éxito"
			text="Ficha eliminada"
			@close-dialog="dialogo2EliminarFicha = $event"
		/>

		<!-- Dialogo fecha inválida -->
		<DialogError
			:show="dialogoFechaInvalida"
			title="Fecha inválida !"
			text="La fecha de inicio no puede ser mayor o igual a la fecha de
      finalización"
			@close-dialog="dialogoFechaInvalida = $event"
		/>

		<DialogError
			:show="dialogoHorarioRepetido"
			title="La jornada ya existe!"
			text="No se puede volver a registrar una jornada para el mismo día"
			@close-dialog="dialogoHorarioRepetido = $event"
		/>

		<!-- Dialogo jornadas vacias -->
		<DialogError
			:show="dialogoJornadasVacias"
			title="Se debe establecer el horario de la ficha"
			text="La ficha debe tener al menos el horario para un día en
          específico"
			@close-dialog="dialogoJornadasVacias = $event"
		/>

		<v-dialog v-model="modalFichasMasivo" persistent max-width="650">
			<v-card>
				<v-card-title class="headline"
					>Subir fichas por excel</v-card-title
				>
				<v-card-text>
					<v-row class="flex-column" no-gutters>
						<v-alert
							class="w-100"
							border="top"
							colored-border
							type="info"
							elevation="2"
						>
							<v-row class="flex-column gap-1" no-gutters>
								No olvide que su archivo excel debe cumplir con
								un formato específico para que todo funcione
								correctamente.
								<v-btn
									style="width: max-content"
									color="info"
									@click="descargarFormatoFichas"
								>
									Descargar formato
									<v-icon right dark>mdi-download</v-icon>
								</v-btn>
							</v-row>
						</v-alert>
						<v-form class="w-100" ref="formMasivoFichas">
							<v-row>
								<v-col cols="12">
									<v-file-input
										hint="El archivo debe ser .xls o .xlsx"
										persistent-hint
										accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
										label="Archivo excel"
										filled
										:rules="excelRules"
										v-model="fichasMasivo.fichas"
										prepend-icon=""
										append-icon="mdi mdi-microsoft-excel"
									></v-file-input>
								</v-col>
							</v-row>
						</v-form>
					</v-row>
				</v-card-text>
				<v-card-actions class="justify-end gap-1">
					<v-btn
						color="error darken-1"
						text
						@click="modalFichasMasivo = false"
					>
						Cerrar
					</v-btn>
					<v-btn
						color="green darken-1"
						@click="subirMasivoFichas"
						style="color: #ffffff"
						:disabled="btnSubirFichas"
						:loading="btnSubirFichas"
					>
						Subir
						<template v-slot:loader>
							<span class="custom-loader">
								<v-icon light class="icon-animado">
									mdi-cloud-upload
								</v-icon>
							</span>
						</template>
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<DialogError
			v-bind="dialogMasivoFichas"
			@close-dialog="dialogMasivoFichas.show = false"
		/>
		<!-- Elemento para descargar el formato para crear fichas -->
		<a
			href="/formatos/formato_excel_crear_fichas.xlsx"
			download="formato_excel_crear_fichas.xlsx"
			ref="linkFormatoFichas"
			class="d-none"
		></a>
		<v-snackbar v-model="show" :timeout="timeout">
			{{ text }}
		</v-snackbar>
	</v-container>
</template>

<script>
import axios from "axios";
import dia from "../../json/dia";
// import Tabla from "../../components/Tabla.vue"
import Dialogo from "../../components/Dialog.vue";
import Dialogo_confirm_delete from "../../components/Dialog-confirm-delete.vue";
import Spinner from "../../components/Spinner.vue";
import DialogError from "../../components/DialogError.vue";

export default {
	components: { Dialogo, Dialogo_confirm_delete, Spinner, DialogError },
	props: {
		datos: Object,
	},
	data() {
		return {
			api: `${process.env.VUE_APP_API_URL}`,
			fichasMasivo: {
				fichas: null,
			},
			paquete: {
				codigo: null,
				fechaInicio: null,
				fechaFin: null,
				sede: null,
				ambiente: null,
				programa: null,
				instructor: null,
				jornadas: [],
			},
			dialogMasivoFichas: {
				show: false,
				showList: false,
				title: "",
				text: "",
				problemas: [],
			},
			btnSubirFichas: false,
			modalFichasMasivo: false,
			modalEditarFicha: false,
			fichas: [],
			sedes: [],
			ambientes: [],
			programas: [],
			camposRules: [(v) => !!v || "Requerido !"],
			excelRules: [
				(v) => !!v || "Debes seleccionar un archivo",
				(v) => {
					if (v != null) {
						const extension = v.name.split(".").pop().toLowerCase();
						const allow = ["xls", "xlsx"];
						return allow.includes(extension)
							? true
							: "Solo se aceptan archivos .xls o .xlsx";
					}
					return "Debes seleccionar un archivo";
				},
			],
			modoEdicion: false,
			// titulos de la primera tabla
			cabeceraTablaHorario: [
				{ text: "Dia", value: "dia" },
				{ text: "Jornada", value: "jornada" },
				{ text: "Hora inicio", value: "horaInicio" },
				{ text: "Hora Fin", value: "horaFin" },
			],
			cabeceraTablaFichas: [
				{ text: "Código", value: "codigo" },
				{
					text: "Fecha inicio",
					value: "fechaInicio",
					cellClass: "text-nowrap",
				},
				{
					text: "Fecha fin",
					value: "fechaFin",
					width: "max-content",
					cellClass: "text-nowrap",
				},
				{
					text: "Sede",
					value: "sede.nombre",
					cellClass: "text-nowrap",
				},
				{
					text: "Ambiente",
					value: "ambiente",
					cellClass: "text-nowrap",
				},
				{
					text: "Programa",
					value: "programa.nombre",
					cellClass: "text-nowrap",
				},
				{
					text: "Lider de ficha",
					value: "instructor",
					cellClass: "text-nowrap",
				},
				{
					text: "Jornadas",
					value: "jornadas",
					witdh: "max-content",
					cellClass: "text-nowrap",
				},
				{ text: "Acciones", value: "actions" },
			],
			// items de la tabla
			listItems: [],
			// datos de del backend
			instructores: [],
			diasSemana: dia,
			dia: null,
			jornadaInput: null,
			mostrar: false,
			modalTitle: "",
			modalText: "",
			textoBusqueda: "",
			programaVista: [],
			loading: false,
			dialogoFichaCreada: false,
			dialogoFichaActualizada: false,
			dialogo1EliminarFicha: false,
			dialogo2EliminarFicha: false,
			dialogoJornadasVacias: false,
			dialogoFechaInvalida: false,
			dialogoHorarioRepetido: false,
			itemEliminar: null,
			jornadas: [],
			show: false,
			text: null,
			timeout: 3000,

			mostrarTooltip: false,
			search: "",
		};
	},

	methods: {
		dialogEditarFicha(ficha) {
			console.log(ficha);
			//this.modalEditarFicha = true;
		},
		descargarFormatoFichas() {
			const link = this.$refs.linkFormatoFichas;
			if (link) {
				link.click();
			}
		},
		async cargarFichas() {
			await axios.get(`${this.api}/ficha`).then((resp) => {
				this.fichas = resp.data;
			});
		},
		async cargarFichasProgramas(programa) {
			this.$emit('showOverlay');
			const fichasResponse = await axios.get(
				`${this.api}/ficha/programas/${programa}`
			);
			this.fichas = fichasResponse.data;
			this.$emit('hideOverlay');
		},

		async cargarAmbientes(sede) {
			// obtener los ambientes por sede
			if(sede != null) {
				this.loading = true;

			const ambientesResponse = await axios.get(
				`${this.api}/ambiente/sede/${sede}`
			);

			if (ambientesResponse.data.length == 0) {
				this.text = "No existen ambientes asociados a la sede ...";
				this.show = true;
				this.loading = false;
			}
			this.ambientes = ambientesResponse.data;
			this.loading = false;
			}
		},

		async instructoresPrograma(programa) {
			this.loading = true;
			const vm = this;
			this.paquete.instructor = null;
			this.instructores = [];
			//const instructoresResponse = await axios.get(`${this.api}/instructor/programa/${this.paquete.programa}/sede/${this.paquete.sede}`);
			let centro = this.$store.getters.usuario.centro;
			/*  const instructoresResponse = await axios.get(
        `${this.api}/users/instructores/programa/${programa}/centro/${centro}`
      );*/
			axios
				.get(
					`${this.api}/users/instructores/programa/${programa}/centro/${centro}`
				)
				.then(function (response) {
					vm.instructores = response.data;
				})
				.catch(function () {
					vm.text = "No existen instructores asociados al programa";
					vm.show = true;
				})
				.finally(function () {
					vm.loading = false;
				});
		},

		async guardar() {
			if (this.$refs.form.validate()) {
				if (!this.validarFecha()) {
					this.dialogoFechaInvalida = true;
					return;
				}

				if (this.paquete.jornadas.length < 1) {
					this.dialogoJornadasVacias = true;
					return;
				}

				this.loading = true;
				try {
					await axios.post(`${this.api}/ficha/crear`, this.paquete);

					await this.cargarFichas();
					this.limpiarFormulario();
					this.loading = false;
					this.dialogoFichaCreada = true;
				} catch (error) {
					console.error(error);
				}
			}

			window.scrollTo(0, 0);
		},

		async subirMasivoFichas() {
			const form = this.$refs.formMasivoFichas;
			if (form.validate()) {
				this.btnSubirFichas = true;
				await axios
					.postForm(
						`${this.api}/carguemasivocompetencias/cargarfichas`,
						this.fichasMasivo,
						{
							headers: {
								Authorization: null,
							},
						}
					)
					.then((resp) => {
						this.cargarFichas();
						form.reset();
						//this.fichasMasivo.fichas=null;
						this.dialogMasivoFichas.title = "Crear fichas";
						this.dialogMasivoFichas.text =
							resp.data.messages.length > 0
								? "Sucedieron algunos problemas creando las fichas"
								: "Fichas creadas correctamente";
						this.dialogMasivoFichas.showList =
							resp.data.messages.length > 0;
						this.dialogMasivoFichas.problemas = resp.data.messages;
						this.dialogMasivoFichas.show = true;
					})
					.catch((error) => {
						this.dialogMasivoFichas.title = "Crear fichas";
						this.dialogMasivoFichas.text = "Sucedió un problema";
						this.dialogMasivoFichas.show = true;
						console.log(error);
					});

				this.btnSubirFichas = false;
			}
		},
		async editarRegistro(item) {
			this.loading = true;
			window.scrollTo(0, 0);

			// Para cargar ambientes e instructores, ya que estos métodos
			// principalmente se ejecutan en el @change de sede y programa
			await this.cargarAmbientes(item.sede._id);
			await this.instructoresPrograma(item.programa._id);

			let {
				_id,
				codigo,
				fechaInicio,
				fechaFin,
				sede,
				ambiente,
				programa,
				instructor,
				jornadas,
			} = item;

			const fechaFormateada = this.agregarFormatoFecha(
				fechaInicio,
				fechaFin
			);
			fechaInicio = fechaFormateada[0];
			fechaFin = fechaFormateada[1];

			this.paquete = {
				id: _id,
				codigo,
				fechaInicio,
				fechaFin,
				sede: sede._id,
				ambiente: ambiente._id,
				programa: programa._id,
				instructor: instructor._id,
				jornadas,
			};

			this.modoEdicion = true;

			this.loading = false;
		},

		async guardarEdicion() {
			if (this.$refs.form.validate()) {
				this.loading = true;
				try {
					await axios.put(
						`${this.api}/ficha/actualizar`,
						this.paquete
					);

					await this.cargarFichas();
					this.limpiarFormulario();
					this.modoEdicion = false;
					this.loading = false;
					this.dialogoFichaActualizada = true;
				} catch (error) {
					console.error(error);
				}
			}

			window.scrollTo(0, 0);
		},

		eliminarRegistro(item) {
			this.itemEliminar = item;
			this.dialogo1EliminarFicha = true;
		},

		async confirmarEliminacion() {
			this.dialogo1EliminarFicha = false;
			this.loading = true;

			try {
				await axios.delete(
					`${this.api}/ficha/eliminar/${this.itemEliminar._id}`
				);

				await this.cargarFichas();
				this.itemEliminar = null;
				this.loading = false;
				this.dialogo2EliminarFicha = true;
			} catch (error) {
				console.error(error);
			}
		},

		agregarLista() {
			if (this.$refs.formJornada.validate()) {
				const existeHorario = this.paquete.jornadas.some(
					(jornada) =>
						jornada.dia == this.dia &&
						jornada.jornada == this.jornadaInput
				);

				if (!existeHorario) {
					let indice = null;

					for (const jornada of this.jornadas) {
						if (jornada.descripcion.includes(this.jornadaInput)) {
							indice = this.jornadas.indexOf(jornada);
							break; // Si se encuentra el item, se sale del bucle
						}
					}

					this.paquete.jornadas.push({
						dia: this.dia,
						jornada: this.jornadaInput,
						horaInicio: this.jornadas[indice].horaInicio,
						horaFin: this.jornadas[indice].horaFin,
					});
				} else {
					this.dialogoHorarioRepetido = true;
				}

				this.limpiarDatosHorario();
			}
		},

		agregarFormatoFecha(fechaInicio, fechaFin) {
			if (fechaInicio != null && fechaFin != null) {
				if (fechaInicio.includes("T") && fechaFin.includes("T")) {
					// this.paquete.fechaInicio = this.paquete.fechaInicio + "T00:00:00.000Z";
					// this.paquete.fechaFin = this.paquete.fechaFin + "T00:00:00.000Z";
					fechaInicio = fechaInicio.slice(0, 10);
					fechaFin = fechaFin.slice(0, 10);
					return [fechaInicio, fechaFin];
				}
			}
			return false;
		},

		validarFecha() {
			const fechaInicio = this.paquete.fechaInicio.split("-");
			const fechaFin = this.paquete.fechaFin.split("-");

			const fechaInicioObj = new Date(
				fechaInicio[0],
				fechaInicio[1] - 1,
				fechaInicio[2]
			);

			const fechaFinObj = new Date(
				fechaFin[0],
				fechaFin[1] - 1,
				fechaFin[2]
			);

			// Verifica si las fechas son válidas
			if (
				isNaN(fechaInicioObj.getTime()) ||
				isNaN(fechaFinObj.getTime()) ||
				fechaInicioObj > fechaFinObj ||
				fechaInicioObj === fechaFinObj
			) {
				return false; // Las fechas no son válidas
			}

			return true; // Las fechas son válidas
		},

		actualizarProgramas() {
			this.programaVista = this.programas.filter(
				(item) =>
					item.codigo.includes(this.textoBusqueda) ||
					item.nombre.includes(this.textoBusqueda)
			);
		},

		limpiarFormulario() {
			this.$refs.form.resetValidation();
			this.paquete = {
				codigo: null,
				fechaInicio: null,
				fechaFin: null,
				sede: null,
				ambiente: null,
				programa: null,
				instructor: null,
				jornadas: [],
			};
		},

		limpiarDatosHorario() {
			this.$refs.formJornada.resetValidation();

			this.dia = null;
			this.jornadaInput = null;
		},

		filterOnlyCapsText(value, search) {
			return (
				value != null &&
				search != null &&
				typeof value === "string" &&
				value.toString().toLocaleUpperCase().indexOf(search) !== -1
			);
		},

		convertToUpperCase() {
			this.search = this.search.toUpperCase();
		},
	},

	async mounted() {
		this.loading = true;

		// await this.cargarFichas();

		const response = await axios.get(`${this.api}/jornada`);
		this.jornadas = response.data;

		const centro = this.$store.getters.usuario.centro;

		const responseSedes = await axios.get(
			`${this.api}/sedes/centro/${centro}`
		);
		this.sedes = responseSedes.data;

		let found = this.$store.getters.usuario.roles.find(
			(element) => element == "Coordinador"
		);
		if (found) this.programas = this.$store.getters.usuario.programas;
		else {
			const responseProgramas = await axios.get(`${this.api}/programas`);
			this.programas = responseProgramas.data;
		}
		const isAdmin =
			this.$store.getters.usuario.roles.includes("Administrator");
		if (isAdmin) {
			await this.cargarFichas();
		}
		// obtener los programas
		// const programasResponse = await axios.get(`${this.api}/programas/`);
		// this.programas = programasResponse.data;
		// this.programaVista = this.programas;

		// obtener instructores

		this.loading = false;
	},

	computed: {
		ambientesVista() {
			if (this.paquete.sede == null) {
				return [];
			}

			return this.ambientes.filter(
				(item) => item.sede == this.paquete.sede
			);
		},

		colorBtn() {
			return this.modoEdicion ? "colorBtnEditar" : "colorBtnCrear";
		},
	},
};
</script>

<style>
.text-green input {
	color: red !important;
	font-family: "Lumanosimo", cursive;
	font-weight: 400;
	font-size: 22;
}

#btn-editar,
#btn-eliminar {
	width: 35px;
	height: 35px;
	color: #fff;
}

#btn-editar {
	margin-right: 7px;
	background-color: #34bc34;
}

#btn-eliminar {
	background-color: #222;
}

#icono-editar,
#icono-eliminar {
	font-size: 20px;
}
.custom-loader {
	transition: all 0.3s ease !important;
	animation: subirYbajar 1.2s infinite ease;
	display: flex;
}
.theme--light.v-btn.v-btn--disabled .v-icon.icon-animado::before {
	animation: cambiarColor 1s infinite ease;
}
@-moz-keyframes subirYbajar {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-12px);
	}
	100% {
		transform: translateY(0);
		color: blue;
	}
}
@-webkit-keyframes subirYbajar {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-12px);
	}
	100% {
		transform: translateY(0);
		color: blue;
	}
}
@-o-keyframes subirYbajar {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-12px);
	}
	100% {
		transform: translateY(0);
		color: blue;
	}
}
@keyframes subirYbajar {
	0% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-12px);
	}
	100% {
		transform: translateY(0);
		color: blue;
	}
}

@-moz-keyframes cambiarColor {
	25% {
		color: #007bff;
	}
	100% {
		color: #28a745;
	}
}
@-webkit-keyframes cambiarColor {
	25% {
		color: #007bff;
	}
	100% {
		color: #28a745;
	}
}
@-o-keyframes cambiarColor {
	25% {
		color: #007bff;
	}
	100% {
		color: #28a745;
	}
}
@keyframes cambiarColor {
	25% {
		color: #007bff;
	}
	100% {
		color: #28a745;
	}
}
</style>
