<template>
  <v-dialog v-model="show" persistent max-width="670">
    <v-card>
      <v-card-title style="color: rgb(248, 74, 74)" class="headline">{{
        title
      }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="closeDialog">Aceptar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["show", "title", "text"],
  methods: {
    closeDialog() {
      this.$emit("close-dialog", false);
    },
  },
};
</script>
