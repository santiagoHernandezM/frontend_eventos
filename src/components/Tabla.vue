<template>
  <v-row justify="space-around">
    <v-card class="mt-12 px-10 py-10">
      <v-data-table
        :items="items"
        :headers="cabecera"
        class="elevation-1"
        :search="search"
        :custom-filter="filterOnlyCapsText"
      >
        <!-- Buscador -->
        <template v-slot:top>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            @input="convertToUpperCase"
            class="mx-4"
            color="rgb(52,188,52)"
          ></v-text-field>
        </template>

        <!-- Listado -->
        <template v-slot:item.actions="{ item }">

          <v-row justify="center" class="gap-2 g-2" style="gap: 9px; flex-wrap: nowrap;">
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="blue"
                  v-bind="attrs"
                  v-on="on"
                  fab
                  x-small
                  dark
                  @click="editar(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Editar</span>
            </v-tooltip>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="black"
                  v-bind="attrs"
                  v-on="on"
                  fab
                  x-small
                  dark
                  @click="eliminar(item)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Eliminar</span>
            </v-tooltip>
          </v-row>

          <v-card-actions style="padding: 0">
            <!-- <v-btn
              icon
              @click="metodoEditar(item)"
              @mouseover="mostrarTooltip = true"
              @mouseleave="mostrarTooltip = false"
              id="btn-editar"
            >
              <v-icon @click="editar(item)" id="icono-editar">mdi-pencil</v-icon>
            </v-btn> -->

<!-- 
            <v-btn icon @click="eliminar(item)" id="btn-eliminar">
              <v-icon id="icono-eliminar">mdi-delete</v-icon>
            </v-btn>

            <v-btn
            color="yellow"
            v-if="item.competencia" icon id="btn-eliminar">
              <v-icon  >mdi-eye</v-icon>
            
            </v-btn> -->

          </v-card-actions>
        </template>
      </v-data-table>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: ["items", "cabecera"],
  data() {
    return {
      mostrarTooltip: false,
      search: "",
    };
  },
  methods: {
    eliminar(item){
      this.$emit("eliminar",item)
    },

    editar(item){
      this.$emit("editar", item)
    },

    filterOnlyCapsText(value, search) {
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value.toString().toLocaleUpperCase().indexOf(search) !== -1
      );
    },

    convertToUpperCase() {
      this.search = this.search.toUpperCase();
    },
  },
};
</script>

<style>
#btn-editar,
#btn-eliminar {
  width: 35px;
  height: 35px;
  color: #fff;
}

#btn-editar {
  margin-right: 7px;
  background-color: #34bc34;
}

#btn-eliminar {
  background-color: #222;
}

#icono-editar,
#icono-eliminar {
  font-size: 20px;
}
</style>
