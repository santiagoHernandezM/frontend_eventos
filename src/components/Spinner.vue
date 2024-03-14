<template>
    <v-overlay :value="value">
      <v-progress-circular indeterminate color="#fff"></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    props: [ 'value' ]
}
</script>