<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR PROGRAMA
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <v-card-text class="carta">
          <v-form ref="form">
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

              <v-row>
                <v-col cols="6">
                  <v-select
                    :items="niveles"
                    item-text="paquete.nivel"
                    label="Selecciones nivel de formacion"
                    prepend-icon="map"
                    v-model="paquete.nivel"
                    :rules="camposRules"
                  ></v-select>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    label="Version"
                    prepend-icon="mdi-key"
                    v-model="paquete.version"
                    type="number"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="Duracion"
                    prepend-icon="mdi-key"
                    v-model="paquete.duracion"
                    type="number"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                  :items="inthoraria"
                  label="Intensidad horaria"
                  prepend-icon="map"
                  v-model="paquete.intensidad_horaria"
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
    @close-dialog="dialogoProgramaCreado = $event"/>

    <!-- Dialogo de actualización -->
    <Dialogo
    :show="dialogoProgramaActualizado"
    title="Registro actualizado con éxito"
    text="Programa actualizado"
    @close-dialog="dialogoProgramaActualizado = $event"/>

    <!-- Dialogos de eliminación -->
    <v-dialog v-model="dialogo1EliminarPrograma" max-width="600">
      <v-card>
        <v-card-title class="headline">¿Estás seguro que quieres eliminar este programa?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogo1EliminarPrograma = false">Cancelar</v-btn>
          <v-btn color="green darken-1" text @click="confirmarEliminacion">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <Dialogo
    :show="dialogo2EliminarPrograma"
    title="Registro eliminado con éxito"
    text="Programa eliminado"
    @close-dialog="dialogo2EliminarPrograma = $event"/>

    <pre>{{ $data }}</pre>
    <!-- <mensaje :mensaje="mensaje" :color="color" :show="show"> </mensaje> -->
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../../components/Tabla.vue"
import Dialogo from "../../components/Dialogo.vue"
// import mensaje from "../../components/MensajesView.vue";
export default {
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  components: {
    Tabla,
    Dialogo
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
        {text: "Acciones", value: "acciones"},
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
      this.loading = true;

      try {
        await axios.post(`${this.api}/programas/crear`, this.paquete);

      } catch (error) {
        console.error(error);
        
      } finally {
        this.loading = false;
        this.cargarProgramas()
        this.dialogoProgramaCreado = true
        this.limpiarFormulario();
      }
    },

    // editarRegistro(item){
    //   item.id = item._id
    //   delete item._id
    //   delete item.__v
      
    //   this.paquete = {...item}
    //   this.modoEdicion = true
    // },

    async guardarEdicion(){
      this.loading = true
      console.log(this.paquete)
      try {
        await axios.put(`${this.api}/programas/actualizar`, this.paquete)

        this.loading = false
        this.dialogoProgramaActualizado = true
        this.modoEdicion = false
        this.cargarProgramas()
        this.limpiarFormulario()

      } catch (error) {
        console.error(error)
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
        this.cargarProgramas()
        this.dialogo1EliminarPrograma = false
        this.dialogo2EliminarPrograma = true

      } catch (error) {
        console.error(error)
      }
    },

    limpiarFormulario(){
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
    const response = await axios.get("http://10.187.145.190:3000/regional");
    this.regionales = response.data;
  },
};
</script>
