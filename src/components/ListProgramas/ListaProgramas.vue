<template>
	<v-card class="mx-auto" max-width="400">
		<v-toolbar
			color="rgb(52,188,52)"
			dark
			min-height="100"
			class="d-flex justify-center flex-column"
		>
			<v-row
				no-gutters
				align="center"
				dense
				class="flex-wrap flex-column w-100"
			>
				<v-toolbar-title class="w-100"> Programas </v-toolbar-title>
				<v-text-field
					v-model="buscarPrograma"
					filled
					prepend-inner-icon="mdi-magnify"
					class="w-100"
					label="Buscar"
					clearable
					dense
					autofocus
					hide-details
				/>
			</v-row>
		</v-toolbar>

		<v-list flat subheader three-line>
			<v-list-item-group multiple active-class="">
				<v-list-item v-for="data in programasData" :key="data._id">
					<v-list-item-action>
						<v-checkbox
							:value="data._id"
							v-model="lprogramas"
							@click="enviarprogramas"
							color="rgb(52,188,52)"
						></v-checkbox>
					</v-list-item-action>

					<v-list-item-content>
						<v-list-item-subtitle class="titulo">
							{{ data.nombre }}
						</v-list-item-subtitle>

						<v-list-item-subtitle
							>Version : {{ data.version }} - Intensidad Horaria :
							{{ data.intensidad_horaria }}
						</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-card>
</template>
<script>
export default {
	props: {
		programas: {
			type: Array,
			required: true,
			default: () => [], // Default value if no value is provided.
		},
		programasSeleccionados: {
			type: Array,
			default: () => [], // Default value if no value is provided.
		},
	},
	data() {
		return {
			lprogramas: [],
			buscarPrograma: "",
			programasData: [],
			programasCopia: [],
		};
	},
	watch: {
		programas: {
			handler(newVal) {
				this.programasData = newVal;
				this.programasCopia = newVal;
			},
			deep: true,
			immediate: true, // Ensure the watcher runs immediately on component creation
		},
		programasSeleccionados: {
			handler(newValue) {
				this.lprogramas = newValue;
			},
			deep: true,
			immediate: true,
		},
		buscarPrograma: {
			handler(newVal) {
				if (newVal == null || newVal.trim().length == 0) {
					this.programasData = [...this.programasCopia];
				} else {
					this.programasData = this.programasCopia.filter(
						(programa) =>
							programa.nombre
								.normalize("NFD")
								.replace(/[\u0300-\u036f]/g, "")
								.toLowerCase()
								.includes(
									newVal
										.normalize("NFD")
										.replace(/[\u0300-\u036f]/g, "")
										.toLowerCase()
								)
					);
				}
			},
		},
	},
	methods: {
		enviarprogramas() {
			this.$emit("envioprogramas", this.lprogramas);
		},
	},
};
</script>

<style scoped>
.wrap-text {
	word-wrap: break-word;
}

.titulo {
	font-size: 16px;
	font-weight: bold;
}
</style>
