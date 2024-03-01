<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR SEDE
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="white" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Nombre de la sede"
                    v-model="paquete.nombre"
                    :rules="camposRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-select
                    :items="centros"
                    item-text="nombre"
                    item-value="_id"
                    label="Seleccione centro"
                    prepend-icon="map"
                    v-model="paquete.centro"
                    :rules="camposRules"
                    @change="cargarDpto()"
                  ></v-select>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    label="Lugar de funcionamiento"
                    v-model="paquete.lugar_funcionamiento"
                    :rules="camposRules"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="paquete.departamento"
                    :items="departamentos"
                    item-text="departamento"
                    item-value="departamento"
                    label="Departamento"
                    prepend-icon="mdi-map"
                    :rules="camposRules"
                    readonly
                  ></v-select>
                </v-col>

                <v-col cols="6">
                  <v-select
                    :items="ciuda"
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

        <!-- Acciones: Crear / Editar -->
        <v-card-actions>
          <v-btn class="ma-2" outlined color="indigo" @click="modoEdicion ? guardarEdicion() : guardar()">
            {{ modoEdicion ? 'Editar' : 'Crear' }}
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-row>
<!-- 
  const santiago = true
 -->
    <!-- Tabla -->
    <Tabla
    :items="sedes"
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
    :show="dialogoSedeCreada"
    title="Registro creado con éxito"
    text="Sede creada"
    @close-dialog="dialogoSedeCreada = $event"/>

    <!-- Dialogo de actualización -->
    <Dialogo
    :show="dialogoSedeActualizada"
    title="Registro actualizado con éxito"
    text="Sede actualizada"
    @close-dialog="dialogoSedeActualizada = $event"/>

    <!-- Dialogos de eliminación -->
    <v-dialog v-model="dialogo1EliminarSede" max-width="600">
      <v-card>
        <v-card-title class="headline">¿Estás seguro que quieres eliminar esta sede?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogo1EliminarSede = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialogo
    :show="dialogo2EliminarSede"
    title="Registro eliminado con éxito"
    text="Sede eliminada"
    @close-dialog="dialogo2EliminarSede = $event"/>
    
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
  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        nombre: null,
        centro: null,
        lugar_funcionamiento: null,
        departamento: null,
        municipio: null,
      },
      sedes: [],
      cabeceraTabla: [
        {text: "Nombre", value: "nombre"},
        {text: "Centro", value: "centro.nombre"},
        {text: "Lugar_funcionamiento", value: "lugar_funcionamiento"},
        {text: "Departamento", value: "departamento"},
        {text: "Municipio", value: "municipio"},
        {text: "Acciones", value: "actions"},
      ],
      centros: null, //Aquí se cargan todos los centros que están en la bd
      departamentos: colombia,
      loading: false,
      dialogoSedeCreada: false,
      dialogoSedeActualizada: false,
      dialogo1EliminarSede: false,
      dialogo2EliminarSede: false,

      modoEdicion: false,
      itemEliminar: null,

      camposRules: [(v) => !!v || "Campo es requerido"],
      mensaje : null,
      color : null,
      mostrar : false,

    };
  },

  methods: {
    async cargarSedes(){
      try {
        const response = await axios.get(`${this.api}/sedes`)
        this.sedes = response.data
        
      } catch (error) {
        console.error(error)
      }
    },

    async cargarDpto(){
      try {
        const centro  = await axios.get(`${this.api}/centro/${this.paquete.centro}`);
        console.log(centro)
        this.paquete.departamento = centro.data.regional.departamento
        
      } catch (error) {
        console.error(error)
      }
    },

    async guardar() {
      if (this.$refs.form.validate()){
        this.loading = true;
  
        try {
          await axios.post(`${this.api}/sedes/crear`, this.paquete);
  
        } catch (error) {
          console.error(error);
          
        } finally {
          this.loading = false;
          this.cargarSedes()
          this.dialogoSedeCreada = true
          this.limpiarFormulario();
        }
      }
    },

    editarRegistro(item){
      if (item._id){
        item.id = item._id
        delete item._id
      }
      delete item.__v
      
      this.paquete = {...item, centro: item.centro._id}
      console.log(this.paquete)
      this.modoEdicion = true
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){
        this.loading = true
  
        try {
          await axios.put(`${this.api}/sedes/actualizar`, this.paquete)
  
          this.loading = false
          this.dialogoSedeActualizada = true
          this.modoEdicion = false
          this.cargarSedes()
          this.limpiarFormulario()
  
        } catch (error) {
          console.error(error)
        }
      }
    },

    eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarSede = true

    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/sedes/${this.itemEliminar._id}`)

        this.loading = false
        this.cargarSedes()
        this.dialogo1EliminarSede = false
        this.dialogo2EliminarSede = true

      } catch (error) {
        console.error(error)
      }
    },

    limpiarFormulario(){
      this.paquete = {
        nombre: null,
        centro: null,
        lugar_funcionamiento: null,
        departamento: null,
        municipio: null,
      }
    }
  },

  async mounted() {
    // this.paquete.centro = this.$store.getters.usuario.centro
    const responseCentros = await axios.get(`${this.api}/centro`);
    this.centros = responseCentros.data

    await this.cargarSedes()

    // this.paquete.departamento = response.data
   
  },

  computed: {
    ciuda() {
      var ciudades = null;
      for (var pos in this.departamentos) {
        if (this.departamentos[pos].departamento == this.paquete.departamento) {
          ciudades = this.departamentos[pos].ciudades;
        }
      }
      return ciudades;
    },
  },
};
</script>
<style>
.fondo {
  background: linear-gradient(
    90deg,
    rgba(138, 74, 22, 0.7820378151260504) 15%,
    rgba(6, 92, 23, 1) 49%,
    rgba(226, 175, 56, 1) 82%
  );
}
</style>
