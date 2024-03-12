<template>
    <v-row justify="space-around">
      <v-card max-width="1000" class="mt-12">
        <v-data-table
          :items="items"
          :headers="cabecera"
          class="elevation-1 mx-12 my-6"
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
            ></v-text-field>
          </template>
          

          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item, index) in items" :key="index">
                <td>{{ item.codigo}}</td>
                <td>{{ item.fechaInicio }}</td>
                <td>{{ item.fechaFin }}</td>
                <td>{{ item.sede.nombre }}</td>
                <td>{{ item.ambiente.bloque.nomenclatura }}-{{ item.ambiente.codigo }}</td>
                <td>{{ item.programa.nombre }} - Ver : {{ item.programa.version }} Int. H : {{ item.programa.intensidad_horaria }}</td>
                <td>{{ item.instructor.nombre }} {{ item.instructor.apellido }}</td>
                <td>
                   <span v-for="data in item.jornadas" :key="data.dia">
                    
                         ({{ data.dia[0] }} {{ data.dia[1] }} )
                  </span>

                </td>
               <td>
                <v-btn
                icon
                @click="metodoEditar(item)"
                @mouseover="mostrarTooltip = true"
                @mouseleave="mostrarTooltip = false"
                id="btn-editar"
                
              >
                <v-icon id="icono-editar">mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                @click="metodoEliminar(item)"
                id="btn-eliminar"
              >
                <v-icon id="icono-eliminar">mdi-delete</v-icon>
              </v-btn>
            <!-- </v-card-actions> -->

               </td>
              </tr>
            </tbody>
          </template>

          <!-- Listado -->
          <template v-slot:item.actions="{item}">
            <!-- <v-card-actions> -->
              <v-btn
                icon
                @click="metodoEditar(item)"
                @mouseover="mostrarTooltip = true"
                @mouseleave="mostrarTooltip = false"
                id="btn-editar"
                
              >
                <v-icon id="icono-editar">mdi-pencil</v-icon>
              </v-btn>

              <v-btn
                icon
                @click="metodoEliminar(item)"
                id="btn-eliminar"
              >
                <v-icon id="icono-eliminar">mdi-delete</v-icon>
              </v-btn>
            <!-- </v-card-actions> -->
          </template>
        </v-data-table>
      </v-card>
    </v-row>
</template>

<script>
export default {
    props: ['items', 'cabecera', 'metodoEditar', 'metodoEliminar'],
    data(){
      return {
        mostrarTooltip: false,
        search: ''
      }
    },
    methods: {
      filterOnlyCapsText (value, search) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleUpperCase().indexOf(search) !== -1
      },

      convertToUpperCase(){
        this.search = this.search.toUpperCase()
      }
    }
}
</script>

<style>

#btn-editar, #btn-eliminar{
  width: 35px;
  height: 35px;
  color: #fff;  
}

#btn-editar{
  margin-right: 7px;
  background-color: #34BC34;
}

#btn-eliminar{
  background-color: #222;
}

#icono-editar, #icono-eliminar{
  font-size: 20px;
}

</style>