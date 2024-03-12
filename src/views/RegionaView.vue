<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR REGIONAL' : 'CREAR REGIONAL' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- <Formulario
          :camposForm="camposForm"
          @datos="objTest = $event"
          /> -->
          
        <!-- Formulario -->
        <v-card-text>
          <v-form ref="form">
            <v-container style="padding-bottom: 0;">
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    type="number"
                    v-model="paquete.codigo"
                    label="CÓDIGO"
                    append-icon="mdi mdi-key-variant"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="paquete.nombre"
                    @input="convertToUppercase"
                    label="NOMBRE"                    
                    append-icon="mdi mdi-pencil"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-select
                    v-model="paquete.departamento"
                    :items="departamentos"
                    item-text="departamento"
                    item-value="departamento"
                    label="DEPARTAMENTO"
                    append-icon="mdi mdi-map-search"
                    :rules="camposRules"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="paquete.municipio"
                    :items="ciudades"
                    label="CIUDAD"
                    append-icon="mdi mdi-map-marker-radius"
                    :rules="camposRules"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Acciones: Limpiar / Editar - Cancelar -->
        <v-card-actions style="max-width: 95%; margin: auto;">
          <v-btn :class="['ma-2', colorBtn]" :style="{'color': '#fff'}" @click="modoEdicion ? guardarEdicion() : guardar()">
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
      :items="regionales"
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
    :show="dialogoRegionalCreada"
    title="Registro creado con éxito"
    text="Regional creada"
    @close-dialog="dialogoRegionalCreada = $event"
    @campos-rules="camposRules = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
    :show="dialogoRegionalActualizada"
    title="Registro actualizado con éxito"
    text="Regional actualizada"
    @close-dialog="dialogoRegionalActualizada = $event"/>
    
    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
    :show="dialogo1EliminarRegional"
    title="Estás seguro que quieres eliminar esta regional?"
    text="También se eliminarán los centros asociados y todo lo que estos incluyen"
    :confirmDeleteMethod="confirmarEliminacion"
    @close-dialog="dialogo1EliminarRegional = $event"
    />

    <Dialogo
    :show="dialogo2EliminarRegional"
    title="Registro eliminado con éxito"
    text="Regional eliminada"
    @close-dialog="dialogo2EliminarRegional = $event"
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
        departamento: null,
        municipio: null,
      },
      regionales: [],
      cabeceraTabla: [
        { text: "Codigo", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Departamento", value: "departamento" },
        { text: "Municipio", value: "municipio" },
        { text: "Acciones", value: "actions"},
      ],
      departamentos: colombia,
      itemEliminar: null,
      
      modoEdicion: false,
      dialogo1EliminarRegional: false,
      dialogo2EliminarRegional: false,
      dialogoRegionalCreada: false,
      dialogoRegionalActualizada: false,
      loading: false,
      
      camposRules: [(v) => !!v || "Campo es requerido"],
      // codigoRules: [
      //   (v) => !!v || "Código es requerido",
      //   (v) => this.esCodigoUnico(v) || "La regional ya existe"
      // ],
      // camposForm: [
      //   [
      //     {
      //       type: 'v-text-field',
      //       vModel: 'codigo',
      //       label: 'Código de la regional',
      //       icon: 'mdi mdi-key-variant'
      //     },
      //     {
      //       type: 'v-text-field',
      //       vModel: 'nombre',
      //       label: 'Nombre de la regional',
      //       icon: "mdi mdi-pencil"
      //     }
      //   ],
      //   [
      //     {
      //       type: 'v-select',
      //       vModel: 'departamento',
      //       items: colombia,
      //       itemText: 'departamento',
      //       itemValue: 'departamento',
      //       label: 'Seleccione el departamento',
      //       icon: "mdi mdi-map-search"
      //     },
      //     {
      //       type: 'v-select',
      //       vModel: 'municipio',
      //       items: ciudades(),
      //       itemText: 'departamento',
      //       itemValue: 'departamento',
      //       label: 'Seleccione una ciudad',
      //       icon: "mdi mdi-map-marker-radius"
      //     },
            
      //   ]
      // ]
    };
  },

  methods: {
    async cargarRegionales(){
      try {
        const response = await axios.get(`${this.api}/regional`);
        this.regionales = response.data;

      } catch (error) {
        console.error(error);
      }
    },

    async guardar() {
      if (this.$refs.form.validate()){

        this.loading = true;
        delete this.paquete.codigo
        try {
          await axios.post(`${this.api}/regional/crear`, this.paquete)

          this.loading = false;
          this.cargarRegionales()
          this.limpiarFormulario();
          this.dialogoRegionalCreada = true

        } catch (error) {
          console.error(error);
        }
      }
    },

    editarRegistro(item) {
      if (item._id){
        item.id = item._id
        delete item._id
      }
      delete item.__v
      window.scrollTo(0, 0)
      this.paquete = { ...item };
      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()){
        this.loading = true
        
        try {
          await axios.put(`${this.api}/regional/actualizar/`, this.paquete);
          
          await this.cargarRegionales()
          this.modoEdicion = false; 
          this.loading = false
          this.limpiarFormulario();
          this.dialogoRegionalActualizada = true
          
        } catch (error) {
          console.error(error);
        }
      }
    },

    async eliminarRegistro(item) {
      this.itemEliminar = item;
      this.dialogo1EliminarRegional = true;
    },

    async confirmarEliminacion() {
      this.loading = true;

      try {
        const res = await axios.delete(`${this.api}/regional/eliminar/${this.itemEliminar._id}`);
        console.log(res)
        this.loading = false;
        this.dialogo1EliminarRegional = false;
        this.dialogo2EliminarRegional = true;
        this.itemEliminar = null;
        await this.cargarRegionales()

      } catch (error) {
        console.error(error);
      }
    },

    convertToUppercase(){
      this.paquete.nombre = this.paquete.nombre.toUpperCase()
    },

    limpiarFormulario() {
      this.$refs.form.resetValidation()
      this.paquete = {
        codigo: null,
        nombre: null,
        departamento: null,
        municipio: null,
      };
    },
  },

  async mounted() {
    try {
      const response = await axios.get(`${this.api}/regional`);
      this.regionales = response.data;

    } catch (error) {
      console.error(error);
    }
  },

  computed: {
    ciudades() {
      const departamento = this.departamentos.find(dpto => dpto.departamento === this.paquete.departamento);
      return departamento
        ? departamento.ciudades
        : []
    },

    textColorBtn(){
      return this.modoEdicion ? '#000' : '#fff'
    },

    colorBtn(){
      return this.modoEdicion ? 'colorBtnEditar' : 'colorBtnCrear'
    },

    // isValidCodigo(v){
    //   return (v ===)
    // }

    // esCodigoUnico(codigoIngresado){
    //   this.regionales.forEach(({ codigo }) => {
    //     if (codigo === codigoIngresado){
    //       return false
    //     }
    //   })
    //   return true
    // }
  },
};
</script>

<style>
.fondo {
  background: linear-gradient(
    90deg,
    rgba(74, 138, 22, 0.7820378151260504) 0%,
    rgba(9, 121, 114, 1) 35%,
    rgba(168, 120, 6, 1) 58%,
    rgba(0, 212, 255, 1) 100%
  );
  color: #e66b1a;
}
</style>
