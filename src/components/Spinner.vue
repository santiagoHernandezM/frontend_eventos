<template>
	<v-overlay :value="value" :z-index="zIndex">
		<v-progress-circular indeterminate size="60" color="#fff" />
	</v-overlay>
</template>

<script>
export default {
	props: {
		value: {
			type: Boolean,
			default: false,
		},
		zIndex: {
			type: Number,
			default: 215,
		},
	},
};
</script>