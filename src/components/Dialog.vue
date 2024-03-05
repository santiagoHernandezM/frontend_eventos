<template>
    <v-dialog v-model="show" persistent max-width="400">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>
        <v-card-text>
          {{ text }}
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
    props: ['show', 'title', 'text'],
    methods: {
      closeDialog(){
          this.$emit('close-dialog', false)
          this.$emit('campos-rules', [(v) => !!v || "Campo es requerido"])
        }
    }
}
</script>