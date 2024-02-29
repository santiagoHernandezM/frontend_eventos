<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="800">
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            CREAR FICHA
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <v-card-text class="carta">
          <v-form>
            <v-container>
              <v-row>
                <v-col>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        label="Código"
                        color="red"
                        append-icon="mdi-key"
                        class="text-green"
                        v-model="paquete.codigo"
                        :rules="camposRules"
                      >
                    
                    </v-text-field>
                    </v-col>
                  </v-row>

                  <v-row cols="12" class="mx-2">
                    <v-text-field
                      class="mr-2"
                      v-model="paquete.fechaInicio"
                      type="date"
                      label="Fecha de inicio"
                      @input="validarFecha"
                      outlined
                      :rules="camposRules"
                    ></v-text-field>
                    <v-text-field
                      class="ml-2"
                      v-model="paquete.fechaFin"
                      type="date"
                      label="Fecha de fin"
                      outlined
                      @input="validarFecha"
                      :rules="camposRules"
                    ></v-text-field>
                  </v-row>

                  <v-row >
                    <v-col cols="6">
                      <v-select
                        :items="sedes"
                        item-text="nombre"
                        item-value="_id"
                        label="Seleccione Sede"
                        v-model="paquete.sede"
                        append-icon="school"
                        @change="cargarambientes()"
                        :rules="camposRules"
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        :items="ambientes"
                        item-text="codigo"
                        item-value="_id"
                        label="Seleccione Ambiente"
                        v-model="paquete.ambiente"
                        append-icon="book"
                        :rules="camposRules"
                      >
                      <template v-slot:item="{ item }">
                        {{ item.bloque.nomenclatura }}-{{ item.codigo }}
                      </template>

                      <template slot="selection" slot-scope="data">
                        {{ data.item.bloque.nomenclatura }} - {{ data.item.codigo }}
                      </template>
                    </v-select>
                    </v-col>
                     </v-row>  

                    <v-row>
                    <v-col cols="6">
                      <v-select
                        :items="programaVista"
                        item-text="nombre"
                        item-value="_id"
                        label="Seleccione Programa"
                        v-model="paquete.programa"
                        append-icon="book"
                        @change="instrucsedeprograma()"
                        :rules="camposRules"
                      >
                      <template v-slot:item="{ item }">
                        {{ item.nivel }} - {{ item.nombre}} - Intensidad horaria : {{item.intensidad_horaria }}
                      </template>

                      <template slot="selection" slot-scope="data">
                        {{ data.item.nivel }} - {{ data.item.nombre }}
                      </template>
                    
                    </v-select>
                    </v-col>
                                  
                    <v-col cols="6">
                      <v-select
                        :items="instructores"
                        item-text="nombre"
                        item-value="_id"
                        label="Seleccione Instructor Lider de Ficha"
                        v-model="paquete.instructor"
                        append-icon="mdi-account"
                        :rules="camposRules"
                      >
                    
                      <template v-slot:item="{ item }">
                        {{ item.nombre}}  {{item.apellido }}
                      </template>

                      <template slot="selection" slot-scope="data">
                        {{ data.item.nombre }}  {{ data.item.apellido }}
                      </template>
                    
                    </v-select>
                    </v-col>
                  </v-row>
                    <v-row>
                     <v-col cols="12">
                      <v-sheet
                      class="d-flex"
                      color="blue lighten-3"
                      height="50"
                      width="100%"
                     >
                     <v-row>
                      <v-col cols="5">
                        <v-select
                          :items="diasSemana"
                          item-text="diasSemana"
                          item-value="diasSemana"
                          label="Seleccione Día"
                          v-model="dia"
                          append-icon="mdi-calendar"
                          :rules="camposRules"
                          class="ml-5"
                        ></v-select>
                      </v-col>
                      <v-col cols="5">
                        <v-select
                          :items="jornadas"
                          item-text="descripcion"
                          item-value="desctipcion"
                          label="Seleccione Jornada"
                          v-model="jornadaInput"
                          append-icon="mdi-calendar"
                          :rules="camposRules"
                        ></v-select>
                      </v-col>
    
                      <v-col cols="2">
                        <v-btn
                        class="mx-2 mt-2"
                        fab
                        dark
                        color="green"
                        width="40px"
                        height="40px"
                        @click="agregarLista"
    
                      >
                        <v-icon dark>
                          mdi-plus
                        </v-icon>
                      </v-btn>
                     
                     </v-col>
                   </v-row>
                  </v-sheet>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                   <v-sheet
                   class="d-flex"
                   
                   height="370"
                   width="100%"
                  >
                  <v-row>
                    <v-col cols="12">
                      <v-data-table
                      :items="paquete.jornadas"
                      :headers="cabeceraTabla"
                      class="elevation-1 mx-12"
                    ></v-data-table>
                    </v-col>
                  </v-row>
                  
                </v-sheet>
                </v-col>
                </v-row>


              </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

       

        <v-card-actions class="mx-12">
          <v-btn class="ma-2" color="rgb(52,188,52)" @click="guardar()">
            Crear Ficha
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>

    <!-- Modal de advertencias y errores -->
    <!-- <v-btn @click="mostrarModal">Mostrar Modal</v-btn> -->
    <v-dialog v-model="mostrar" max-width="500px" class="">
      <v-card>
        <v-card-title>
          <span class="headline text-lg-h4">{{ modalTitle }}</span>
        </v-card-title>
        <v-card-text class="text-lg-h6"> {{ modalText }} </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="cerrarModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <pre>
          {{ $data }}
        </pre
    >
    
  </v-container>
</template>

<script>
import axios from "axios";
import dia from "../../json/dia";

export default {
  props: {
    datos: Object,
  },
  data() {
    
    return {
       api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paquete: {
        codigo: null,
        fechaInicio: null,
        fechaFin: null,
        sede: null,
        ambiente: null,
        programa: null,
        instructor: null,
        jornadas: [],
      },
      camposRules: [(v) => !!v || "Campo es requerido"],
      // titulos de la primera tabla
      cabeceraTabla: [
        { text: "Día", value: "dia" },
        { text: "Jornada", value: "jornada" },
        { text: "Hora Inicio", value: "horaInicio" },
        { text: "Hora Fin", value: "horaFin" },
      ],
      // items de la tabla
      listItems: [],
      // datos de del backend
      ambientes: null,
      programas: null,
      sedes: null,
      instructores: null,
      diasSemana: null,
      jornadaInput: null,
      mostrar: false,
      modalTitle: "",
      modalText: "",
      dia: null,
      textoBusqueda: "",
      programaVista: [],
    };
  },

  methods: {
    async cargarambientes(){
       // obtener los ambientes por sede
    const ambientesResponse = await axios.get(`${this.api}/ambiente/sede/${this.paquete.sede}`);
    this.ambientes = ambientesResponse.data;
   },

   async instrucsedeprograma(){

    //const instructoresResponse = await axios.get(`${this.api}/instructor/programa/${this.paquete.programa}/sede/${this.paquete.sede}`);
    let centro = this.$store.getters.usuario.centro
    const instructoresResponse = await axios.get(`${this.api}/user/programa/centro/${this.paquete.programa}/${centro}`);
    console.log(instructoresResponse.data)
    this.instructores = instructoresResponse.data

   },
    async guardar() {
      this.agregarFormatoFecha;

      let respuesta = null;
      await axios
        .post(`${this.api}/ficha/crear`, this.paquete)
        .then(function (response) {
          console.log(response);
          respuesta = response;
        })
        .catch(function (error) {
          console.log(error);
          respuesta = error.response;
        });

      if (respuesta.status == 201) {
        this.mostrarModal("Exito", "Ficha creada correctamente");
      } else if (respuesta.status == 400) {
        let errores = JSON.parse(respuesta.request.response);
        this.mostrarModal(
          "Error al crear la ficha, vuelva a intentarlo",
          errores.message
        );
      }
    },

    agregarLista() {
      if (this.dia == null || this.jornadaInput == null) {
        this.mostrarModal("Error", "Debe seleccionar un día y una jornada");
        return;
      }

      let v = this.paquete.jornadas.filter(e => e.dia == this.dia && e.jornada == this.jornadaInput)
      if (v.length ==0)
       {
      let indice = null;
      for (let i = 0; i < this.jornadas.length; i++) {
        if (this.jornadas[i].descripcion.includes(this.jornadaInput)) {
          indice = i;
          break; // Si se encuentra el item, se sale del bucle
        }
      }

      this.paquete.jornadas.push({
        dia: this.dia,
        jornada: this.jornadaInput,
        horaInicio: this.jornadas[indice].horaInicio,
        horaFin: this.jornadas[indice].horaFin,
      });
    }
    else{
      this.mostrarModal("Error", "Ya esta registrado un horario similar");
    }

      this.dia = null;
      this.jornadaInput = null;
    },

    agregarFormatoFecha() {
      if (this.paquete.fechaInicio != null && this.paquete.fechaFin != null) {
        if (
          !this.paquete.fechaInicio.includes("T") &&
          !this.paquete.fechaFin.includes("T")
        ) {
          this.paquete.fechaInicio =
            this.paquete.fechaInicio + "T00:00:00.000Z";
          this.paquete.fechaFin = this.paquete.fechaFin + "T00:00:00.000Z";
          return true;
        }
      }
      return false;
    },

    validarJoornadas() {
      if (this.paquete.jornadas.length == 0) {
        this.mostrarModal(
          "Error",
          "Debe agregar al menos una jornada a la ficha"
        );
        return false;
      }
      return true;
    },

    validarFecha() {
      const fechaInicio = this.paquete.fechaInicio.split("-");
      const fechaFin = this.paquete.fechaFin.split("-");

      const fechaInicioObj = new Date(
        fechaInicio[0],
        fechaInicio[1] - 1,
        fechaInicio[2]
      );
      const fechaFinObj = new Date(fechaFin[0], fechaFin[1] - 1, fechaFin[2]);

      // Verifica si las fechas son válidas
      if (
        isNaN(fechaInicioObj.getTime()) ||
        isNaN(fechaFinObj.getTime()) ||
        fechaInicioObj > fechaFinObj
      ) {
        this.mostrarModal(
          "Error",
          "La fecha de inicio debe ser menor a la fecha de fin"
        );
        return false; // Las fechas no son válidas
      }

      return true; // Las fechas son válidas
    },

    actualizarProgramas() {
      this.programaVista = this.programas.filter(
        (item) =>
          item.codigo.includes(this.textoBusqueda) ||
          item.nombre.includes(this.textoBusqueda)
      );
    },

    mostrarModal(title, message) {
      this.modalTitle = title;
      this.modalText = message;
      this.mostrar = true;
    },
    cerrarModal() {
      this.mostrar = false;
    },
  },

  created() {
    this.diasSemana = dia;
  },

  async mounted() {
    // obtenemos las jornadas
    
    const response = await axios.get(`${this.api}/jornada/`);
    this.jornadas = response.data;

    // obtener los ambientes
    this.paquete.centro = this.$store.getters.usuario.centro
    const responsede = await axios.get(`${this.api}/sedes/centro/${this.paquete.centro}`);
   
    
    this.sedes = responsede.data;

   
    // obtener los programas
    const programasResponse = await axios.get(`${this.api}/programas/`);
    this.programas = programasResponse.data;
    this.programaVista = this.programas;

    // obtener instructores
    
  },

  computed: {
    ambientesVista() {
      if (this.paquete.sede == null) {
        return [];
      }

      return this.ambientes.filter((item) => item.sede == this.paquete.sede);
    },
  },
};
</script>

<style>
.text-green input {
  color: red !important;
  font-family: 'Lumanosimo', cursive;
  font-weight: 400;
  font-size: 22;

}

</style>
