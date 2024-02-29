<template>
    <v-snackbar
    v-model="show"
    :color="color"
    >
    {{ mensaje }}

</v-snackbar>
</template>

<script>
export default {
    props:['mensaje','color','show']
}
</script>