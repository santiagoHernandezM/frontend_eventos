<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR SEDE' : 'CREAR SEDE' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text>
          <v-form ref="form">
            <v-container style="padding-bottom: 0;">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    append-icon="mdi mdi-pencil"
                    label="NOMBRE"
                    v-model="paquete.nombre"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="CENTRO"
                    append-icon="mdi mdi-bank"
                    v-model="nombreCentro"
                    readonly
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-text-field
                    append-icon="mdi mdi-map-marker-outline"
                    label="UBICACIÓN"
                    v-model="paquete.lugar_funcionamiento"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    append-icon="mdi mdi-map-search"
                    label="DEPARTAMENTO"
                    v-model="paquete.departamento"
                    outlined
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-select
                    :items="ciuda"
                    label="CIUDAD"
                    v-model="paquete.municipio"
                    :rules="camposRules"
                    color="black"
                    item-color="black"
                    append-icon="mdi mdi-map-marker-radius"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Acciones: Limpiar / Editar - Cancelar -->
        <v-card-actions style="max-width: 95%; margin: auto;">
          <v-btn :class="['ma-2', colorBtn]" color="success" @click="modoEdicion ? guardarEdicion() : guardar()">
            {{ modoEdicion ? 'Editar' : 'Crear' }}
          </v-btn>

          <v-btn class="ma-2 colorBtnLimpiar" v-if="!modoEdicion" @click="limpiarFormulario()">
            Limpiar
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn class="ma-2 white--text colorBtnEliminar" v-if="modoEdicion" @click="limpiarFormulario(); modoEdicion = false">
            Cancelar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-row>

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
      @close-dialog="dialogoSedeCreada = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoSedeActualizada"
      title="Registro actualizado con éxito"
      text="Sede actualizada"
      @close-dialog="dialogoSedeActualizada = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarSede"
      title="Estás seguro que quieres eliminar esta sede?"
      text="También se eliminarán los bloques y ambientes asociados"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarSede = $event"
    />

    <Dialogo
      :show="dialogo2EliminarSede"
      title="Registro eliminado con éxito"
      text="Sede eliminada"
      @close-dialog="dialogo2EliminarSede = $event"
    />
    
    <pre>{{ $data }}</pre>
  </v-container>
</template>
<script>
import axios from "axios";
import Dialogo from "../components/Dialog.vue"
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue"
import Tabla from "../components/Tabla.vue"

let colombia = require("../json/ciudades");
colombia = colombia.map(dpto => ({
  id: dpto.id,
  departamento: dpto.departamento.toUpperCase(),
  ciudades: dpto.ciudades.map(ciudad => ciudad = ciudad.toUpperCase())
}))

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete },
  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      nombreCentro: null,
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
      const centro = this.$store.getters.usuario.centro
      try {
        const response = await axios.get(`${this.api}/sedes/centro/${centro}`)
        this.sedes = response.data
        console.log(this.sedes)
        
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
          
          this.loading = false;
          this.cargarSedes()
          this.limpiarFormulario();
          this.dialogoSedeCreada = true

        } catch (error) {
          console.error(error);
        } 
      }
    },

    editarRegistro(item){
      if (item._id){
        item.id = item._id
        delete item._id
      }
      delete item.__v
      window.scrollTo(0, 0)
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
          this.modoEdicion = false
          this.cargarSedes()
          this.limpiarFormulario()
          this.dialogoSedeActualizada = true
  
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
        this.itemEliminar = null
        this.cargarSedes()
        this.dialogo1EliminarSede = false
        this.dialogo2EliminarSede = true

      } catch (error) {
        console.error(error)
      }
    },

    convertToUppercase(){
      this.paquete.nombre = this.paquete.nombre.toUpperCase()
      this.paquete.lugar_funcionamiento = this.paquete.lugar_funcionamiento.toUpperCase()
    },

    limpiarFormulario(){
      this.$refs.form.resetValidation()
      this.paquete = {
        nombre: null,
        centro: this.paquete.centro,
        lugar_funcionamiento: null,
        departamento: this.paquete.departamento,
        municipio: null,
      }
    }
  },

  async mounted() {
    const centroId = this.$store.getters.usuario.centro
    this.paquete.centro = centroId

    const responseCentro = await axios.get(`${this.api}/centro/${centroId}`);

    this.nombreCentro = responseCentro.data.nombre
    this.paquete.departamento = responseCentro.data.regional.departamento

    //const responseCentros = await axios.get(`${this.api}/centro`);

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

    colorBtn(){
      return this.modoEdicion ? 'colorBtnEditar' : 'colorBtnCrear'
    }
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
