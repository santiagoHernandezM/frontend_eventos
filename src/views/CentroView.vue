<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR CENTRO
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Codigo del centro"
                    prepend-icon="mdi-key"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Nombre"
                    prepend-icon="mdi-key"
                    v-model="paquete.nombre"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="regionales"
                    item-text="nombre"
                    item-value="_id"
                    label="Seleccione regional"
                    prepend-icon="map"
                    v-model="paquete.regional"
                    :rules="camposRules"
                    @change="cargarDptoYMunicipio()"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    prepend-icon="mdi-key"
                    label="Departamento"
                    v-model="paquete.departamento"
                    :rules="camposRules"
                    readonly
                  ></v-text-field>
                 <!-- <v-select
                    :items="departamentos"
                    item-text="departamento"
                    item-value="departamento"
                    label="Seleccione departamento"
                    v-model="paquete.departamento"
                    :rules="camposRules"
                    prepend-icon="map"
                  ></v-select>
                 -->
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="ciudades"
                    label="Seleccione una ciudad"
                    v-model="paquete.municipio"
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

        <!-- Acciones: Crear / Actualizar -->
        <v-card-actions>
          <v-btn class="ma-2" outlined color="indigo" @click="modoEdicion ? guardarEdicion() : guardar()">
            {{ modoEdicion ? 'Editar' : 'Crear' }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-row>

    <!-- Tabla -->
    <Tabla
    :items="centros"
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
    :show="dialogoCentroCreado"
    title="Registro creado con éxito"
    text="Centro creado"
    @close-dialog="dialogoCentroCreado = $event"
    />

    <!-- Dialogo de actualización  -->
    <Dialogo
    :show="dialogoCentroActualizado"
    title="Registro actualizado con éxito"
    text="Centro actualizado"
    @close-dialog="dialogoCentroActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <v-dialog v-model="dialogo1EliminarCentro" max-width="600">
      <v-card>
        <v-card-title class="headline">¿Estás seguro que quieres eliminar este centro?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogo1EliminarCentro = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <Dialogo
    :show="dialogo2EliminarCentro"
    title="Registro eliminado con éxito"
    text="Centro eliminado"
    @close-dialog="dialogo2EliminarCentro = $event"
    />

    <pre>{{ $data }}</pre>

  </v-container>
</template>

<script>
import axios from "axios";
import Dialogo from "../components/Dialogo.vue"
import Tabla from "../components/Tabla.vue"
const colombia = require("../json/ciudades");

export default {
  components: { Tabla, Dialogo },
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        codigo: null,
        nombre: null,
        regional: null,
        // dpto no es requerido para crear un centro
        departamento: null,
        municipio: null,
      },

      cabeceraTabla: [
        {text: "Codigo", value: "codigo"},
        {text: "Nombre", value: "nombre"},
        {text: "Regional", value: "regional.nombre"},
        {text: "Municipio", value: "municipio"},
        {text: "Acciones", value: "acciones"},
      ],

      loading: false,
      dialogoCentroCreado: false,
      dialogoCentroActualizado: false,
      dialogo1EliminarCentro: false,
      dialogo2EliminarCentro: false,

      itemEliminar: null,

      centros: [],
      regionales: null,
      departamentos: colombia,
      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

  methods: {
    async cargarDptoYMunicipio(){
      try {
        const regional  = await axios.get(`${this.api}/regional/${this.paquete.regional}`);
        this.paquete.departamento = regional.data.departamento
        this.paquete.municipio = regional.data.municipio
        
      } catch (error) {
        console.log(error)
      }
    },

    async cargarCentros(){
      try {
        const response = await axios.get(`${this.api}/centro`);
        this.centros = response.data;
        
      } catch (error) {
        console.error(error)
      }

    },

    async guardar() {
      if (this.$refs.form.validate()){
        this.loading = true
  
        try {
          await axios.post(`${this.api}/centro/crear`, this.paquete)
  
        } catch (error) {
          console.error(error)
  
        } finally {
          this.loading = false,
          this.limpiarFormulario()
          await this.cargarCentros()
          this.dialogoCentroCreado = true
        }
      }
    },

    editarRegistro(item){
      item.id = item._id
      item.departamento = item.regional.departamento
      delete item._id
      delete item.__v
      this.paquete = {...item, regional: item.regional._id}
      console.log(this.paquete)
      this.modoEdicion = true
      
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){
        this.loading = true
        
        try {
          await axios.put(`${this.api}/centro/editar`, this.paquete)
  
          await this.cargarCentros()
          this.limpiarFormulario()
          this.modoEdicion = false
          this.loading = false
  
          this.dialogoCentroActualizado = true
  
        } catch (error) {
          console.error(error)  
        }
      }
    },

    async eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarCentro = true
    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/centro/eliminar/${this.itemEliminar._id}`)
        
        this.loading = false
        this.dialogo1EliminarCentro = false
        this.dialogo2EliminarCentro = true
        this.itemEliminar = null

      } catch (error) {
        console.error(error)

      } finally {
        await this.cargarCentros()
      }
    },

    limpiarFormulario(){
      this.paquete = {
        codigo: null,
        nombre: null,
        regional: null,
        departamento: null,
        municipio: null,
      }
    }

  },
  
  async mounted() {
    await this.cargarCentros()
    const response = await axios.get(`${this.api}/regional`);
    this.regionales = response.data;
  },

  computed: {
    ciudades() {
      let ciudades = null;
      this.departamentos.find(dpto => {
        if (dpto.departamento === this.paquete.departamento){
          ciudades = dpto.ciudades
        }
      })

      // for (var pos in this.departamentos) {
      //   if (this.departamentos[pos].departamento == this.paquete.departamento) {
      //     ciudades = this.departamentos[pos].ciudades;
      //   }
      // }
      return ciudades;
    },
  },
};
</script>

<style></style>
