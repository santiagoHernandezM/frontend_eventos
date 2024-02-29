<template>
    <v-row justify="space-around">
      <v-card width="800" class="mt-12">
        <v-data-table :items="items" :headers="cabecera" class="elevation-1 mx-12 my-6">
          <template v-slot:item.acciones="{item}">
            <v-btn icon @click="metodoEditar(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="metodoEliminar(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
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