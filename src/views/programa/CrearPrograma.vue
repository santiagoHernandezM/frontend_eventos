<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR PROGRAMA' : 'CREAR PROGRAMA' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container style="padding-bottom: 0;">
              <v-row>
                <v-col cols="4">
                  <v-text-field
                    label="Codigo"
                    append-icon="mdi-key-variant"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>    
                
                <v-col cols="8">
                  <v-text-field
                    label="Nombre"
                    append-icon="mdi mdi-pencil"
                    v-model="paquete.nombre"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="7">
                  <v-select
                    :items="niveles"
                    item-text="paquete.nivel"
                    label="Seleccione nivel de formacion"
                    append-icon="mdi mdi-account-school"
                    v-model="paquete.nivel"
                    :rules="camposRules"
                    outlined
                  ></v-select>
                </v-col>

                <v-col cols="5">
                  <v-text-field
                    label="Version"
                    append-icon="mdi mdi-numeric"
                    v-model="paquete.version"
                    type="number"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>              
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Duracion"
                    append-icon="mdi mdi-clock-time-eight-outline"
                    v-model="paquete.duracion"
                    type="number"
                    :rules="camposRules"
                    outlined
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                  :items="inthoraria"
                  label="Intensidad horaria"
                  append-icon="mdi mdi-calendar-clock"
                  v-model="paquete.intensidad_horaria"
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
          <v-btn class="ma-2" color="error" v-if="!modoEdicion" @click="limpiarFormulario()">
            Limpiar
          </v-btn>

          <v-btn class="ma-2" color="success" @click="modoEdicion ? guardarEdicion() : guardar()">
            {{ modoEdicion ? 'Editar' : 'Crear' }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn class="ma-2" color="error" v-if="modoEdicion" @click="limpiarFormulario(); modoEdicion = false">
            Cancelar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-row>

    <!-- Tabla -->
    <Tabla
      :items="programas"
      :cabecera="cabeceraTabla"
      :metodoEliminar="eliminarRegistro"
      :metodoEditar="editarRegistro"
    />

    <!-- Cargando... -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoProgramaCreado"
      title="Registro creado con éxito"
      text="Programa creado"
      @close-dialog="dialogoProgramaCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoProgramaActualizado"
      title="Registro actualizado con éxito"
      text="Programa actualizado"
      @close-dialog="dialogoProgramaActualizado = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialog_confirm_delete
      :show="dialogo1EliminarPrograma"
      title="Estás seguro que quieres eliminar este programa?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarPrograma = $event"
    />

    <Dialogo
      :show="dialogo2EliminarPrograma"
      title="Registro eliminado con éxito"
      text="Programa eliminado"
      @close-dialog="dialogo2EliminarPrograma = $event"
    />

    <!-- <pre>{{ $data }}</pre> -->
    <!-- <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje> -->
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../../components/Tabla.vue"
import Dialogo from "../../components/Dialog.vue"
import Dialog_confirm_delete from "../../components/Dialog-confirm-delete.vue"

// import mensaje from "../../components/MensajesView.vue";
export default {
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  components: {
    Tabla,
    Dialogo,
    Dialog_confirm_delete
    // mensaje,
  },

  data() {
    return {
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      inthoraria : [8,6],
      paquete: {
        codigo: null,
        nombre: null,
        nivel: null,
        version: null,
        duracion: null,
        intensidad_horaria : null
      },
      programas: [],
      cabeceraTabla: [
        {text: "Codigo", value: "codigo"},
        {text: "Nombre", value: "nombre"},
        {text: "Nivel", value: "nivel"},
        {text: "Version", value: "version"},
        {text: "Duración", value: "duracion"},
        {text: "Intensidad horaria", value: "intensidad_horaria"},
        {text: "Acciones", value: "actions"},
      ],
      modoEdicion: false,
      loading: false,
      dialogoProgramaCreado: false,
      dialogoProgramaActualizado: false,
      itemEliminar: null,
      dialogo1EliminarPrograma: false,
      dialogo2EliminarPrograma: false,

      mensaje: "",
      color: "",
      show: false,
      niveles: [
        "Tecnico",
        "Tecnologo",
        "Operario",
        "Auxiliar",
        "Especializacion",
      ],
      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

  methods: {
    async cargarProgramas(){
      try {
        const response = await axios.get(`${this.api}/programas`)
        this.programas = response.data
        
      } catch (error) {
        console.error(error)
      }
    },

    async guardar() {
      if (this.$refs.form.validate()){
        this.loading = true;
  
        try {
          await axios.post(`${this.api}/programas/crear`, this.paquete);
  
          this.loading = false;
          this.cargarProgramas()
          this.limpiarFormulario();
          this.dialogoProgramaCreado = true

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
      this.paquete = {...item}
      this.modoEdicion = true
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){

        this.loading = true
        console.log(this.paquete)
        try {
          await axios.put(`${this.api}/programas/actualizar`, this.paquete)
  
          this.loading = false
          this.modoEdicion = false
          this.cargarProgramas()
          this.limpiarFormulario()
          this.dialogoProgramaActualizado = true
  
        } catch (error) {
          console.error(error)
        }
      }
    },

    eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarPrograma = true

    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/programas/eliminar/${this.itemEliminar._id}`)

        this.loading = false
        this.itemEliminar = null
        this.cargarProgramas()
        this.dialogo1EliminarPrograma = false
        this.dialogo2EliminarPrograma = true

      } catch (error) {
        console.error(error)
      }
    },

    limpiarFormulario(){
      this.$refs.form.resetValidation()
      this.paquete = {
        codigo: null,
        nombre: null,
        nivel: null,
        version: null,
        duracion: null,
        intensidad_horaria : null
      }
    }
  },

  async mounted() {
    this.cargarProgramas()
  },
};
</script>
