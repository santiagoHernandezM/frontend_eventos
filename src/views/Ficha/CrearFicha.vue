<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="800">

        <!-- Encabezado -->
        <v-app-bar flat color="rgb(52,188,52)">
          <v-toolbar-title class="text-h6 white--text pl-0">
            {{ modoEdicion ? 'EDITAR FICHA' : 'CREAR FICHA' }}
          </v-toolbar-title>

          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Formulario -->
        <v-card-text class="carta">
          <v-form ref="form">
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    label="CÓDIGO"
                    prepend-inner-icon="mdi mdi-key-variant"
                    v-model="paquete.codigo"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
              </v-row>              

              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="paquete.fechaInicio"
                    type="date"
                    label="FECHA DE INICIO"
                    @input="validarFecha"
                    outlined
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="paquete.fechaFin"
                    type="date"
                    label="FECHA DE FINALIZACIÓN"
                    outlined
                    @input="validarFecha"
                    :rules="camposRules"
                  ></v-text-field>
                </v-col>
              </v-row>              

              <v-row>
                <v-col cols="6">
                  <v-select
                    :items="sedes"
                    item-text="nombre"
                    item-value="_id"
                    label="SEDE"
                    v-model="paquete.sede"
                    append-icon="mdi mdi-home-city"
                    @change="cargarambientes"
                    :rules="camposRules"
                    outlined
                  ></v-select>
                </v-col>

                <v-col cols="6">
                  <v-select
                    :items="ambientes"
                    item-text="codigo"
                    item-value="_id"
                    label="AMBIENTE"
                    v-model="paquete.ambiente"
                    append-icon="mdi mdi-home"
                    :rules="camposRules"
                    outlined
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
                    :items="programas"
                    item-text="nombre"
                    item-value="_id"
                    label="PROGRAMA"
                    v-model="paquete.programa"
                    append-icon="mdi mdi-school"
                    @change="instrucsedeprograma"
                    :rules="camposRules"
                    outlined
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
                    label="INSTRUCTOR LIDER DE FICHA"
                    v-model="paquete.instructor"
                    append-icon="mdi mdi-account-tie"
                    :rules="camposRules"
                    outlined
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
                <v-col>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
              
              
            </v-container>
          </v-form>

          <!-- Datos de Jornada -->
          <v-form ref="formJornada">
            <v-container>
              <v-row>
                <v-col cols="5">
                  <v-select
                    :items="diasSemana"
                    item-text="diasSemana"
                    item-value="diasSemana"
                    label="DIA"
                    v-model="dia"
                    append-icon="mdi-calendar"
                    :rules="camposRules"
                    class="ml-5"
                    outlined
                  ></v-select>
                </v-col>
                <v-col cols="5">
                  <v-select
                    :items="jornadas"
                    item-text="descripcion"
                    item-value="descripcion"
                    label="JORNADA"
                    v-model="jornadaInput"
                    append-icon="mdi-calendar"
                    :rules="camposRules"
                    class="ml-5"
                    outlined
                  ></v-select>
                </v-col>
    
                <v-col cols="1">
                  <v-btn
                    class="mx-2 mt-2"
                    fab
                    dark
                    color="green"
                    width="40px"
                    height="40px"
                    @click="agregarLista"
                  >
                    <v-icon dark>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-form>

          <!-- Tabla Jornadas -->
          <v-row>
            <v-col cols="12">
              <v-data-table
                :items="paquete.jornadas"
                :headers="cabeceraTablaHorario"
                class="elevation-1 mx-5"
              ></v-data-table>
            </v-col>
          </v-row>

          <!-- Formulario Jornada -->

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
      :items="fichas"
      :cabecera="cabeceraTablaFichas"
      :metodoEliminar="eliminarRegistro"
      :metodoEditar="editarRegistro"
    />

    <!-- Cargando... -->
    <v-overlay :value="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Dialogo de creación -->
    <Dialogo
      :show="dialogoFichaCreada"
      title="Registro creado con éxito"
      text="Ficha creada"
      @close-dialog="dialogoFichaCreada = $event"
    />

    <!-- Dialogo de actualización -->
    <Dialogo
      :show="dialogoFichaActualizada"
      title="Registro actualizado con éxito"
      text="Ficha actualizada"
      @close-dialog="dialogoFichaActualizada = $event"
    />

    <!-- Dialogos de eliminación -->
    <Dialogo_confirm_delete
      :show="dialogo1EliminarFicha"
      title="Estás seguro que quieres eliminar esta ficha?"
      :confirmDeleteMethod="confirmarEliminacion"
      @close-dialog="dialogo1EliminarFicha = $event"
    />

    <Dialogo
      :show="dialogo2EliminarFicha"
      title="Registro eliminado con éxito"
      text="Ficha eliminada"
      @close-dialog="dialogo2EliminarFicha = $event"
    />

    <!-- Dialogo jornadas vacias -->
    <v-dialog v-model="dialogoJornadasVacias" persistent max-width="670">
      <v-card>
        <v-card-title style="color: rgb(248, 74, 74)" class="headline">No ha asignado ninguna jornada a la ficha</v-card-title>
        <v-card-text>La ficha debe tener al menos una jordana</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogoJornadasVacias = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo fecha inválida -->
    <v-dialog v-model="dialogoFechaInvalida" persistent max-width="670">
      <v-card>
        <v-card-title style="color: rgb(248, 74, 74)" class="headline">Fecha inválida</v-card-title>
        <v-card-text>La fecha de inicio debe ser menor a la fecha de fin</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogoFechaInvalida = false">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <pre>{{ $data }}</pre>
    
  </v-container>
</template>

<script>
import axios from "axios";
import dia from "../../json/dia";
import Tabla from "../../components/Tabla.vue"
import Dialogo from "../../components/Dialog.vue"
import Dialogo_confirm_delete from "../../components/Dialog-confirm-delete.vue"

export default {
  components: { Tabla, Dialogo, Dialogo_confirm_delete},
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
      fichas: [],
      sedes: [],
      ambientes: [],
      programas: [],
      camposRules: [(v) => !!v || "Campo es requerido"],
      modoEdicion: false,
      // titulos de la primera tabla
      cabeceraTablaHorario: [
        { text: "Dia", value: "dia" },
        { text: "Jornada", value: "jornada" },
        { text: "Hora inicio", value: "horaInicio" },
        { text: "Hora Fin", value: "horaFin" },
      ],
      cabeceraTablaFichas: [
        { text: "Código", value: "codigo" },
        { text: "Fecha inicio", value: "fechaInicio" },
        { text: "Fecha fin", value: "fechaFin" },
        { text: "Sede", value: "sede.nombre" },
        { text: "Ambiente", value: "ambiente.codigo" },
        { text: "Programa", value: "programa.nombre" },
        { text: "Lider Ficha", value: `instructor.nombre` },
        { text: "Jornadas", value: "jornadas" },
        { text: "Acciones", value: "actions" },
      ],
      // items de la tabla
      listItems: [],
      // datos de del backend
      instructores: [],
      diasSemana: dia,
      dia: null,
      jornadaInput: null,
      mostrar: false,
      modalTitle: "",
      modalText: "",
      textoBusqueda: "",
      programaVista: [],
      loading: false,
      dialogoFichaCreada: false,
      dialogoFichaActualizada: false,
      dialogo1EliminarFicha: false,
      dialogo2EliminarFicha: false,
      dialogoJornadasVacias: false,
      dialogoFechaInvalida: false,
      itemEliminar: null,
      jornadas: []
    };
  },

  methods: {
    async cargarFichas(){
      const fichasResponse = await axios.get(`${this.api}/ficha`)
      this.fichas = fichasResponse.data
      console.log(this.fichas)
    },

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
    
      if (this.$refs.form.validate()){

        if (!this.validarFecha()){
          this.dialogoFechaInvalida = true
          return
        }

        if (this.paquete.jornadas.length < 1){
          this.dialogoJornadasVacias = true
          return
        }

        this.agregarFormatoFecha;
      
        this.loading = true;
        try {
          await axios.post(`${this.api}/ficha/crear`, this.paquete);
  
          this.loading = false;
          this.cargarFichas()
          this.limpiarFormulario();
          this.dialogoFichaCreada = true

        } catch (error) {
          console.error(error) 
        }
      }
    },

    // async guardar() {
    //   this.agregarFormatoFecha;

    //   let respuesta = null;
    //   await axios
    //     .post(`${this.api}/ficha/crear`, this.paquete)
    //     .then(function (response) {
    //       console.log(response);
    //       respuesta = response;
    //     })
    //     .catch(function (error) {
    //       console.log(error);
    //       respuesta = error.response;
    //     });

    //   if (respuesta.status == 201) {
    //     this.mostrarModal("Exito", "Ficha creada correctamente");
    //   } else if (respuesta.status == 400) {
    //     let errores = JSON.parse(respuesta.request.response);
    //     this.mostrarModal(
    //       "Error al crear la ficha, vuelva a intentarlo",
    //       errores.message
    //     );
    //   }
    // },

    editarRegistro(item){
      if (item._id){
        item.id = item._id
        delete item._id
      }
      delete item.__v

      window.scrollTo(0, 0)
      this.paquete = {
        ...item,
        ambiente: item.ambiente._id,
        programa: item.programa._id,
        instructor: item.instructor._id
      }
      this.modoEdicion = true
    },

    async guardarEdicion(){
      if (this.$refs.form.validate()){

        this.loading = true
        try {
          await axios.put(`${this.api}/ficha/actualizar`, this.paquete)
  
          this.loading = false
          this.modoEdicion = false
          this.cargarFichas()
          this.limpiarFormulario()
          this.dialogoFichaActualizada = true
  
        } catch (error) {
          console.error(error)
        }
      }
    },

    eliminarRegistro(item){
      this.itemEliminar = item
      this.dialogo1EliminarFicha = true
    },

    async confirmarEliminacion(){
      this.loading = true

      try {
        await axios.delete(`${this.api}/ficha/eliminar/${this.itemEliminar._id}`)

        this.loading = false
        this.itemEliminar = null
        this.cargarFichas()
        this.dialogo1EliminarFicha = false
        this.dialogo2EliminarFicha = true

      } catch (error) {
        console.error(error)
      }
    },

    agregarLista() {
      if (this.$refs.formJornada.validate()){
        if (this.dia == null || this.jornadaInput == null) {
          this.mostrarModal("Error", "Debe seleccionar un día y una jornada");
          return;
        }
  
        let v = this.paquete.jornadas.filter(e => e.dia == this.dia && e.jornada == this.jornadaInput)
        if (v.length ==0){
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
          })

          this.limpiarDatosJornada()
        }
        else {
          this.mostrarModal("Error", "Ya esta registrado un horario similar")
        }
  
        this.limpiarDatosJornada()
      }
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

    limpiarFormulario(){
      this.$refs.form.resetValidation()
      this.paquete = {
        codigo: null,
        fechaInicio: null,
        fechaFin: null,
        sede: null,
        ambiente: null,
        programa: null,
        instructor: null,
        jornadas: [],
      }
    },

    limpiarDatosJornada(){
      this.$refs.formJornada.resetValidation()

      this.dia = null
      this.jornadaInput = null
    }
  },

  async mounted() {
    await this.cargarFichas()

    // obtenemos las jornadas
    
    const response = await axios.get(`${this.api}/jornada`);
    this.jornadas = response.data;

    // obtener los ambientes
    // this.paquete.centro = this.$store.getters.usuario.centro

    // Creando sedes del centro con el id especificado (centro1), modificarlo
    const centro = this.$store.getters.usuario.centro
    console.log(centro)
    const responseSedes = await axios.get(`${this.api}/sedes/centro/${centro}`);
    this.sedes = responseSedes.data;
    
    // Creando ambientes de la sede con el id especificado (sede1), modificarlo
    const responseAmbientes = await axios.get(`${this.api}/ambiente/sede/65e386914055ac8b84439867`);
    this.ambientes = responseAmbientes.data;


    const responseProgramas = await axios.get(`${this.api}/programas`);
    this.programas = responseProgramas.data;

   
    // obtener los programas
    // const programasResponse = await axios.get(`${this.api}/programas/`);
    // this.programas = programasResponse.data;
    // this.programaVista = this.programas;

    // obtener instructores
    
  },

  computed: {
    ambientesVista() {
      if (this.paquete.sede == null) {
        return [];
      }

      return this.ambientes.filter((item) => item.sede == this.paquete.sede);
    },

    colorBtn(){
      return this.modoEdicion ? 'colorBtnEditar' : 'colorBtnCrear'
    }
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
