<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR BLOQUE
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Nombre"
                    prepend-icon="mdi-key"
                    v-model="paquete.nombre"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Nomenclatura"
                    prepend-icon="mdi-key"
                    v-model="paquete.nomenclatura"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-select
                  :items="sedes"
                  label="Seleccione una sede"
                  item-text="nombre"
                  item-value="_id"
                  v-model="paquete.sede"
                  :rules="camposRules"
                  color="black"
                  item-color="black"
                  prepend-icon="map"
                ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Acciones: Crear / Editar -->
        <v-card-actions>
          <v-btn class="ma-2" outlined color="indigo" @click="modoEdicion ? guardarEdicion() : guardar()">
            {{ modoEdicion ? 'Editar' : 'Crear' }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-row>

    <Tabla
    :items="bloques"
    :cabecera="cabeceraTabla"
    :metodoEditar="editarRegistro"
    :metodoEliminar="eliminarRegistro"
    />

    <!-- Cargando... -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Dialogo de creación -->
    <Dialogo
    :show="dialogoBloqueCreado"
    title="Registro creado con éxito"
    text="Bloque creado"
    @close-dialog="dialogoBloqueCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
    :show="dialogoBloqueActualizado"
    title="Registro actualizado con éxito"
    text="Bloque actualizado"
    @close-dialog="dialogoBloqueActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <v-dialog v-model="dialogo1EliminarBloque" max-width="600">
      <v-card>
        <v-card-title class="headline">¿Estás seguro que quieres eliminar este bloque?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogo1EliminarBloque = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialogo
    :show="dialogo2EliminarBloque"
    title="Registro eliminado con éxito"
    text="Registro eliminado"
    @close-dialog="dialogo2EliminarBloque = $event"
    />

    <pre>{{ $data }}</pre>
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla.vue"
import Dialogo from "../components/Dialogo.vue"

export default {
  components: { Tabla, Dialogo },

  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        nombre: null,
        nomenclatura: null,
        sede : null
      },
      bloques: [],
      sedes : [],
      cabeceraTabla: [
        {text: "Nombre", value: "nombre"},
        {text: "Nomenclatura", value: "nomenclatura"},
        {text: "Sede", value: "sede.nombre"},
        {text: "Acciones", value: "acciones"}
      ],
      modoEdicion: false,
      loading: false,
      dialogoBloqueCreado: false,
      dialogoBloqueActualizado: false,

      itemEliminar: null,
      dialogo1EliminarBloque: false,
      dialogo2EliminarBloque: false,
      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

  methods: {
    async cargarBloques(){
      try {
        const response = await axios.get(`${this.api}/bloque`)
        this.bloques = response.data

      } catch (error) {
        console.error(error) 
      }
    },

    async guardar() {
      this.loading = true

      try {
        await axios.post(`${this.api}/bloque/crear`, this.paquete)
        
      } catch (error) {
        console.error(error)

      } finally {
        this.loading = false
        this.cargarBloques()
        this.dialogoBloqueCreado = true
        this.limpiarFormulario()
      }
        
    },

    editarRegistro(item){
      item.id = item._id
      delete item._id
      delete item.__v
      this.paquete = { ...item }
      this.modoEdicion = true
    },

    async guardarEdicion(){
      this.loading = true

      try {
        await axios.put(`${this.api}/bloque/actualizar`, this.paquete)

        this.loading = false
        this.dialogoBloqueActualizado = true
        this.cargarBloques()
        this.limpiarFormulario()

      } catch (error) {
        console.error(error)
      }
    },

    eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarBloque = true
    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/bloque/eliminar/${this.itemEliminar._id}`)

        this.loading = false
        this.cargarBloques()
        this.dialogo1EliminarBloque = false
        this.dialogo2EliminarBloque = true

      } catch (error) {
        console.error(error)
      }
    },

    limpiarFormulario(){
      this.paquete = {
        nombre: null,
        nomenclatura: null,
        sede : null
      }
    }
  },
  async mounted() {
    
    // let centro = this.$store.getters.usuario.centro
    // const response = await axios.get(`${this.api}/sedes/centro/${centro}`);
    const response = await axios.get(`${this.api}/sedes`);
    this.sedes = response.data
    await this.cargarBloques()
  },

  // computed: {
  //   ambient() {
  //     var tipoAmb = null;
  //     for (let pos in this.typeAmbiente) {
  //       if (this.typeAmbiente[pos] == this.paquete.tipo) {
  //         tipoAmb = this.typeAmbiente[pos].tipoAmb;
  //       }
  //     }
  //     return tipoAmb;
  //   },
  // },
};
</script>

<style></style>
