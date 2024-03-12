<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR AMBIENTE' : 'CREAR AMBIENTE' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container style="padding-bottom: 0;">
              <v-row>
                <v-col>
                  <v-text-field
                    label="CÓDIGO"
                    append-icon="mdi-key-variant"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                    outlined
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="sedes"
                    item-value="_id"
                    label="SEDE"
                    v-model="paquete.sede"
                    :rules="camposRules"
                    @change="cargarBloques()"
                    item-text="nombre"
                    color="black"
                    item-color="black"
                    append-icon="mdi mdi-home-city"
                    outlined
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="bloques"
                    label="BLOQUE"
                    v-model="paquete.bloque"
                    :rules="camposRules"
                    item-value="_id"
                    item-text="nombre"
                    color="black"
                    item-color="black"
                    append-icon="mdi mdi-home-outline"
                    outlined
                  ></v-select>  
                </v-col>
                <v-col>
                  <v-select
                    :items="tiposDeAmbiente"
                    label="TIPO DE AMBIENTE"
                    v-model="paquete.tipo"
                    :rules="camposRules"
                     color="black"
                    item-text="nombre"
                    item-value="_id"
                    item-color="black"
                    append-icon="mdi mdi-format-list-bulleted"
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
      :items="ambientes"
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
      :show="dialogoAmbienteCreado"
      title="Registro creado con éxito"
      text="Ambiente creado"
      @close-dialog="dialogoAmbienteCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoAmbienteActualizado"
      title="Registro actualizado con éxito"
      text="Ambiente actualizado"
      @close-dialog="dialogoAmbienteActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarAmbiente"
      title="Estás seguro que quieres eliminar este ambiente?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarAmbiente = $event"
    />

    <Dialogo
      :show="dialogo2EliminarAmbiente"
      title="Registro eliminado con éxito"
      text="Ambiente eliminado"
      @close-dialog="dialogo2EliminarAmbiente = $event"
    />

    <!-- <pre>{{ $data }}</pre> -->
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla"
import Dialogo from "../components/Dialog.vue"
import Dialogo_confirm_delete from "../components/Dialog-confirm-delete.vue"
//const tipoAmbiente = require("../json/tipoAmbiente");
// const sedes = require("../json/pruebaSedes");

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete },
  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        codigo: null,
        bloque: null,
        tipo: null,
        sede: null,
      },
      ambientes: [],
      sedes: [],
      bloques : [],
      tiposDeAmbiente: [],
      cabeceraTabla: [
        {text: "Codigo", value: "codigo"},
        {text: "Sede", value: "sede.nombre"},
        {text: "bloque", value: "bloque.nombre"},
        {text: "Tipo", value: "tipo.nombre"},
        {text: "Acciones", value: "actions"}
      ],
      dialogoAmbienteCreado: false,
      dialogoAmbienteActualizado: false,
      dialogo1EliminarAmbiente: false,
      dialogo2EliminarAmbiente: false,

      loading: false,
      modoEdicion: false,
      itemEliminar: null,

      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

 
  methods: {
    async cargarBloques(){
      const response = await axios.get(`${this.api}/bloque/sede/${this.paquete.sede}`);
      this.bloques = response.data
    },

    async cargarAmbientes(){
      try {
        const response = await axios.get(`${this.api}/ambiente`)
        this.ambientes = response.data

      } catch (error) {
        console.error(error) 
      }
    },

    async guardar() {
      if (this.$refs.form.validate()){
        this.loading = true;
  
        try {
          await axios.post(`${this.api}/ambiente/crear`, this.paquete);
  
          this.loading = false;
          this.cargarAmbientes()
          this.limpiarFormulario();
          this.dialogoAmbienteCreado = true
  
        } catch (error) {
          console.error(error); 
        }
      }
    },

    editarRegistro(item){
      window.scrollTo(0, 0)
      this.paquete = {
        id: item._id,
        codigo: item.codigo,
        bloque: item.bloque._id,
        tipo: item.tipo._id,
        sede: item.sede._id,
      }
      this.cargarBloques()
      
      this.modoEdicion = true
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){
        this.loading = true
  
        try {
          await axios.put(`${this.api}/ambiente/editar`, this.paquete)
  
          this.loading = false
          this.modoEdicion = false
          this.cargarAmbientes()
          this.limpiarFormulario()
          this.dialogoAmbienteActualizado = true
  
        } catch (error) {
          console.error(error)
        }
      }
    },

    eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarAmbiente = true
    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/ambiente/${this.itemEliminar._id}`)

        this.loading = false
        this.itemEliminar = null
        this.cargarAmbientes()
        this.dialogo1EliminarAmbiente = false
        this.dialogo2EliminarAmbiente = true

      } catch (error) {
        console.error(error)
      }
    },

    limpiarFormulario(){
      this.$refs.form.resetValidation()
      this.paquete = {
        codigo: null,
        bloque: null,
        tipo: null,
        sede: null,
      }
    }
  },

  async mounted() {

    await this.cargarAmbientes()


    this.paquete.centro = this.$store.getters.usuario.centro
    const response = await axios.get(`${this.api}/sedes/centro/${this.paquete.centro}`);
    this.sedes = response.data;

    //const responseSedes = await axios.get(`${this.api}/sedes`);
   // this.sedes = responseSedes.data

    const resTiposAmbientes = await axios.get(`${this.api}/tipo-ambiente`);
    this.tiposDeAmbiente = resTiposAmbientes.data
    
    // const responseBloques = await axios.get(`${this.api}/bloque/sede/${this.paquete.sede}`);
    // this.bloques = responseBloques.data
    // try {
    
    // } catch (error) {
      
    // }


    // this.paquete.centro = this.$store.getters.usuario.centro
    // const response = await axios.get(`${this.api}/sedes/centro/${this.paquete.centro}`);
   
    // //const response = await axios.get(`${this.api}/sedes/`);
    // const tipambiente = await axios.get(`${this.api}/tipo-ambiente/`);
    //   this.sedes = response.data;
    //   this.tipoambiente = tipambiente.data
     
  },


  computed: {
    colorBtn(){
      return this.modoEdicion ? 'colorBtnEditar' : 'colorBtnCrear'
    }
  },
};
</script>

<style></style>
