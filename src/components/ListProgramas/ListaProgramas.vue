<template>
	<v-card class="mx-auto" max-width="400">
		<v-toolbar color="rgb(52,188,52)" dark>
			<v-toolbar-title>Programas</v-toolbar-title>

			<v-spacer />

			<v-btn icon>
				<v-icon>mdi-magnify</v-icon>
			</v-btn>
		</v-toolbar>

		<v-list flat subheader three-line>
			<v-list-item-group v-model="lprogramas" multiple>
				<v-list-item
					v-for="data in programas"
					:key="data.codigo"
					:value="data._id"
				>
					<template v-slot:default>
						<v-list-item-action>
							<v-checkbox
								:input-value="data._id"
								color="rgb(52,188,52)"
								v-model="lprogramas"
							/>
						</v-list-item-action>

						<v-list-item-content>
							<v-list-item-subtitle class="titulo">{{
								data.nombre
							}}</v-list-item-subtitle>

							<v-list-item-subtitle
								>Version : {{ data.version }} - Intensidad
								Horaria :
								{{ data.intensidad_horaria }}
							</v-list-item-subtitle>
						</v-list-item-content>
					</template>
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
	},
	data() {
		return {
			lprogramas: [],
			infoProgramas: [],
		};
	},
	watch: {
		programas: {
			deep: true,
			handler(newVal) {
				this.infoProgramas = newVal;
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
