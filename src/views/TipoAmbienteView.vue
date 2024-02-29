<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR TIPO AMBIENTE
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
                    label="Codigo"
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
    :items="tiposDeAmbientes"
    :cabecera="cabeceraTabla"
    />
    <!-- 
      :metodoEditar="editarRegistro"
      :metodoEliminar="eliminarRegistro"
     -->

    <!-- Cargando... -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Dialogo de creación -->
    <Dialogo
    :show="dialogoTipoAmbienteCreado"
    title="Registro creado con éxito"
    text="Tipo de ambiente creado"
    @close-dialog="dialogoTipoAmbienteCreado = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
    :show="dialogoTipoAmbienteActualizado"
    title="Registro actualizado con éxito"
    text="Tipo de ambiente actualizado"
    @close-dialog="dialogoTipoAmbienteActualizado = $event"
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
      },
      tiposDeAmbientes: [],
      cabeceraTabla: [
        {text: "Codigo", value: "codigo"},
        {text: "Nombre", value: "nombre"},
        {text: "Acciones", value: "acciones"},
      ],
      modoEdicion: false,
      loading: false,
      dialogoTipoAmbienteCreado: false,
      dialogoTipoAmbienteActualizado: false,
      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

  methods: {
    async cargarTiposDeAmbientes(){
      try {
        const response = await axios.get(`${this.api}/tipo-ambiente`)
        this.tiposDeAmbientes = response.data

      } catch (error) {
        console.error(error) 
      }
    },

    async guardar() {
      this.loading = true

      try {
        await axios.post(`${this.api}/tipo-ambiente/crear`, this.paquete)
        
      } catch (error) {
        console.error(error)

      } finally {
        this.loading = false
        this.cargarTiposDeAmbientes()
        this.dialogoTipoAmbienteCreado = true
        this.limpiarFormulario()
      }
     
    },

    // editarRegistro(item){
    //   item.id = item._id
    //   delete item._id
    //   delete item.__v
    //   this.paquete = { ...item }
    //   this.modoEdicion = true
    // },

    // async guardarEdicion(){
    //   this.loading = true

    //   try {
    //     await axios.put(`${this.api}/tipo-ambiente/...`, this.paquete)

    //     this.loading = false
    //     this.dialogoTipoAmbienteActualizado = true
    //     this.cargarTiposDeAmbientes()
    //     this.limpiarFormulario()

    //   } catch (error) {
    //     console.error(error)
    //   }
    // },

    limpiarFormulario(){
      this.paquete = {
        codigo: null,
        nombre: null
      }
    }
  },

  async mounted(){
    this.cargarTiposDeAmbientes()
  }
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
