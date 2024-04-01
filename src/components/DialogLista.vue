<template>
    <v-dialog v-model="show" persistent max-width="600">
      <v-card>
        <v-card-title class="headline">RESULTADO PROCESO</v-card-title>
        <v-card-text>
            <v-data-table
            :headers="headers"
            :items="listado"
            :items-per-page="5"
            class="elevation-1"
          ></v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="closeDialog">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: ["show", "listado"],
    data() {
        return {
            headers: [
             { text: 'OPERACION', value: 'title' },
             { text: 'RESULTADO', value: 'mensaje' }
            ],
        }
    },
    methods: {
      closeDialog() {
        this.$emit("close-dialog", false);
      },
    },
  };
  </script>