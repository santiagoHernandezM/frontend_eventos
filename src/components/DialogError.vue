<template>
	<v-dialog v-model="show" persistent max-width="670">
		<v-card>
			<v-card-title style="color: rgb(248, 74, 74)" class="headline">{{
				title
			}}</v-card-title>
			<v-card-text>
				<v-row no-gutters class="flex-column">
					{{ text }}
					<h2 class="m-0" v-if="showList">Problemas</h2>
					<ul v-if="showList">
						<li v-for="(problema, index) in problemas" :key="index">
							{{ problema }}
						</li>
					</ul>
				</v-row>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn color="green darken-1" text @click="closeDialog"
					>Aceptar</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	props: {
		show: {
			type: Boolean,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		showList: {
			type: Boolean,
			default: false,
		},
		problemas: {
			type: Array,
			default: () => [],
		},
	},
	methods: {
		closeDialog() {
			this.$emit("close-dialog", false);
		},
	},
};
</script>
