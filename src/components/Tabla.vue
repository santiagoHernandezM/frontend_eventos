<template>
    <v-row justify="space-around">
      <v-card max-width="1000" class="mt-12">
        <v-data-table :items="items" :headers="cabecera" class="elevation-1 mx-12 my-6">
          <template v-slot:item.actions="{item}">
            <!-- <v-card-actions> -->
              <v-btn icon @click="metodoEditar(item)" style="margin: 0;">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="metodoEliminar(item)" style="margin: 0;">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            <!-- </v-card-actions> -->
          </template>
        </v-data-table>
      </v-card>
    </v-row>
</template>

<script>
export default {
    props: ['items', 'cabecera', 'metodoEditar', 'metodoEliminar']
}
</script>