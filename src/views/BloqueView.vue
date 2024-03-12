<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR BLOQUE' : 'CREAR BLOQUE' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container style="padding-bottom: 0;">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="NOMBRE"
                    append-icon="mdi mdi-pencil"
                    v-model="paquete.nombre"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="NOMENCLATURA"
                    append-icon="mdi mdi-draw-pen"
                    v-model="paquete.nomenclatura"
                    @input="convertToUppercase"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                  :items="sedes"
                  label="SEDE"
                  item-text="nombre"
                  item-value="_id"
                  v-model="paquete.sede"
                  :rules="camposRules"
                  color="black"
                  item-color="black"
                  append-icon="mdi mdi-home-city"
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
    <Dialogo_confirm_delete
      :show="dialogo1EliminarBloque"
      title="Estás seguro que quieres eliminar este bloque?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarBloque = $event"
    />

    <Dialogo
      :show="dialogo2EliminarBloque"
      title="Registro eliminado con éxito"
      text="Bloque eliminado"
      @close-dialog="dialogo2EliminarBloque = $event"
    />

    <!-- <pre>{{ $data }}</pre> -->
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla.vue"
import Dialogo from "../components/Dialog.vue"
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue"

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete },

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
        {text: "Acciones", value: "actions"}
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
      if (this.$refs.form.validate()){
        this.loading = true
  
        try {
          await axios.post(`${this.api}/bloque/crear`, this.paquete)
          
          this.loading = false
          this.cargarBloques()
          this.limpiarFormulario()
          this.dialogoBloqueCreado = true

        } catch (error) {
          console.error(error)
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
      this.paquete = { ...item, sede: item.sede._id }
      this.modoEdicion = true
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){
        this.loading = true
  
        try {
          await axios.put(`${this.api}/bloque/actualizar`, this.paquete)
  
          this.loading = false
          this.modoEdicion = false
          this.cargarBloques()
          this.limpiarFormulario()
          this.dialogoBloqueActualizado = true
  
        } catch (error) {
          console.error(error)
        }
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
        this.itemEliminar = null
        this.cargarBloques()
        this.dialogo1EliminarBloque = false
        this.dialogo2EliminarBloque = true

      } catch (error) {
        console.error(error)
      }
    },

    convertToUppercase(){
      this.paquete.nombre = this.paquete.nombre.toUpperCase()
      this.paquete.nomenclatura = this.paquete.nomenclatura.toUpperCase()
    },

    limpiarFormulario(){
      this.$refs.form.resetValidation()
      this.paquete = {
        nombre: null,
        nomenclatura: null,
        sede : null
      }
    }
  },
  async mounted() {
    
    let centro = this.$store.getters.usuario.centro
    const response = await axios.get(`${this.api}/sedes/centro/${centro}`);
    this.sedes = response.data
    await this.cargarBloques()
  },

  computed: {
    colorBtn(){
      return this.modoEdicion ? 'colorBtnEditar' : 'colorBtnCrear'
    }
  },
};
</script>

<style></style>
