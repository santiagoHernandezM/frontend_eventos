<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="600">
        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR AMBIENTE
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <v-card-text class="carta">
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field
                    label="Codigo"
                    prepend-icon="mdi-key"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="sedes"
                    label="Selecciones una sede"
                    v-model="paquete.sede"
                    :rules="camposRules"
                    @change="cargabloque()"
                    item-text="nombre"
                    item-value="_id"
                    color="black"
                    item-color="black"
                    prepend-icon="map"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-select
                    :items="bloques"
                    label="Selecciones un bloque"
                    v-model="paquete.bloque"
                    :rules="camposRules"
                    item-value="_id"
                    item-text="nombre"
                    color="black"
                    item-color="black"
                    prepend-icon="map"
                  ></v-select>  
                </v-col>
                <v-col>
                  <v-select
                    :items="tiposDeAmbiente"
                    label="Tipo de ambiente"
                    v-model="paquete.tipo"
                    :rules="camposRules"
                     color="black"
                    item-text="nombre"
                    item-value="_id"
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

    <Tabla
    :items="ambientes"
    :cabecera="cabeceraTabla"
    :metodoEditar="editarRegistro"
    :metodoEliminar="eliminarRegistro"
    />
    
    <pre>{{ $data }}</pre>
  </v-container>
</template>

<script>
import axios from "axios";
import Tabla from "../components/Tabla"
//const tipoAmbiente = require("../json/tipoAmbiente");
// const sedes = require("../json/pruebaSedes");

export default {
  components: { Tabla },
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
      cabeceraTabla: [
        {text: "Codigo", value: "codigo"},
        {text: "Sede", value: "sede.nombre"},
        {text: "bloque", value: "bloque.nombre"},
        {text: "Tipo", value: "tipo.nombre"},
        {text: "Acciones", value: "acciones"}
      ],
      bloques : null,
      tiposDeAmbiente: null,
      sedes: null,

      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

 
  methods: {
    async cargarbloques(){
      const response = await axios.get(`${this.api}/bloque/sede/${this.paquete.sede}`);
      this.bloques = response.data
      console.log(`data : ${response.data}`)
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
    },

    // async guardar() {
    //     await axios
    //     .post(`${this.api}/ambiente/crear`, this.paquete)
    //     .then(function (response) {
    //       console.log(response);
    //     })
    //     .catch(function (error) {
    //       // handle error
    //       console.log(error);
    //     })
    //     .finally(function () {
    //       // always executed
    //     });
    // },
  },

  async mounted() {

    // try {
      const responseBloques = await axios.get(`${this.api}/bloque/sede/${this.paquete.sede}`);
      this.bloques = responseBloques.data
    
    // } catch (error) {
      
    // }


    // this.paquete.centro = this.$store.getters.usuario.centro
    // const response = await axios.get(`${this.api}/sedes/centro/${this.paquete.centro}`);
   
    // //const response = await axios.get(`${this.api}/sedes/`);
    // const tipambiente = await axios.get(`${this.api}/tipo-ambiente/`);
    //   this.sedes = response.data;
    //   this.tipoambiente = tipambiente.data
     
    },

  // async mounted() {
  //   const response = await axios.get("http://10.187.145.190:3000/regional");
  //   this.regionales = response.data;
  // },

  computed: {

    combineText(item) {
      alert(JSON.stringify(item))
      return `${item.nombre}`;
    },

    ambient() {
      var tipoAmb = null;
      for (let pos in this.typeAmbiente) {
        if (this.typeAmbiente[pos] == this.paquete.tipo) {
          tipoAmb = this.typeAmbiente[pos].tipoAmb;
        }
      }
      return tipoAmb;
    },
  },
};
</script>

<style></style>
