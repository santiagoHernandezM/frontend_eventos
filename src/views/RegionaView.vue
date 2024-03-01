<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR REGIONAL' : 'CREAR REGIONAL' }}
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
                <v-col cols="6">
                  <v-text-field
                    v-model="paquete.codigo"
                    label="Codigo de la regional"
                    prepend-icon="mdi-key"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="paquete.nombre"
                    label="Nombre de la regional"
                    prepend-icon="mdi-key"
                    :rules="camposRules"
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
                    label="Seleccione departamento"
                    prepend-icon="mdi-map"
                    :rules="camposRules"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="paquete.municipio"
                    :items="ciudades"
                    label="Seleccione una ciudad"
                    prepend-icon="mdi-map"
                    :rules="camposRules"
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
    <v-dialog v-model="dialogo1EliminarRegional" max-width="600">
      <v-card>
        <v-card-title class="headline">¿Estás seguro que quieres eliminar esta regional?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogo1EliminarRegional = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
        // _id: null,
        codigo: null,
        nombre: null,
        departamento: null,
        municipio: null,
      },
      cabeceraTabla: [
        { text: "Codigo", value: "codigo" },
        { text: "Nombre", value: "nombre" },
        { text: "Municipio", value: "municipio" },
        { text: "Departamento", value: "departamento" },
        { text: "Acciones", value: "actions"},
      ],
      regionales: [],
      departamentos: colombia,
      itemEliminar: null,
      
      modoEdicion: false,
      dialogo1EliminarRegional: false,
      dialogo2EliminarRegional: false,
      dialogoRegionalCreada: false,
      dialogoRegionalActualizada: false,
      loading: false,

      camposRules: [(v) => !!v || "Campo es requerido"],
      
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
  
        try {
          await axios.post(`${this.api}/regional/crear`, this.paquete);
  
        } catch (error) {
          console.error(error);
          
        } finally {
          this.loading = false;
          this.cargarRegionales()
          // this.camposRules = []
          this.limpiarFormulario();
          this.dialogoRegionalCreada = true
        }
      }
    },

    editarRegistro(item) {
      if (item._id){
        item.id = item._id
        delete item._id
      }
      delete item.__v
      this.paquete = { ...item };
      this.modoEdicion = true;
    },

    async guardarEdicion() {
      if (this.$refs.form.validate()){
        this.loading = true
        
        try {
          await axios.put(`${this.api}/regional/actualizar/`, this.paquete);
          
          await this.cargarRegionales()
          this.limpiarFormulario();
          this.modoEdicion = false; 
          this.loading = false
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

      } catch (error) {
        console.error(error);

      } finally {
        await this.cargarRegionales()
      }
    },

    limpiarFormulario() {
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
      const departamentoSeleccionado = this.paquete.departamento;
      const departamento = this.departamentos.find(dep => dep.departamento === departamentoSeleccionado);
      return departamento ? departamento.ciudades : [];
    },
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
}
</style>
