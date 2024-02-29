<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="100%">
        <v-app-bar flat color="rgb(52,188,52)">
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>

          <v-toolbar-title class="text-h6 white--text pl-0">
            Eventos
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn color="white" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-app-bar>

        <v-card-text>
          <v-form>
            <v-container>
              <v-row align="end" class="mb-n10" >
                <v-col cols="4">
                  <spam>Mes: <spam>{{fechactual.mesNum}}</spam> {{fechactual.mes}}</spam>
                </v-col>
                <v-col cols="4">
                  <spam>Año: <spam>{{fechactual.year}}</spam></spam>
                </v-col>

                </v-row>
              
              <v-row align="end" class="row-height mb-n10 mt-n5" >
                <v-col cols="2">
                   <v-select class="pt-0 mt-0"
                    label="Ficha"
                    :items="fichas"
                    item-text="codigo"
                    item-value="_id"
                    @change="cargadatos()"
                    v-model="paquete.ficha.ficha"
                    :rules="camposRules"
                    >
                    
                    </v-select
                  >
                </v-col>
                 <v-col cols="4">
                  <v-text-field
                  class="ml-2"
                  v-model="paquete.programa.nombre"
                  label="Programa"
                  readonly
                ></v-text-field>

                 </v-col>
                 <v-col cols="2">
                  <v-text-field
                  class="ml-2"
                  v-model="paquete.nivel"
                  label="Nivel"
                  readonly
                ></v-text-field>

                 </v-col>
                 <v-col cols="2">
                  <v-text-field
                  class="ml-2"
                  v-model="paquete.municipio"
                  label="Municipio"
                  readonly
                ></v-text-field>

                 </v-col>

                 <v-col cols="2">
                  <v-select
                    :items="ambientes"
                    item-text="codigo"
                    item-value="_id"
                    label="Ambiente"
                    v-model="paquete.ambiente.id"
                    append-icon="book"
                    :rules="camposRules"
                    @change="cargaambiente()"
                  >
                  <template v-slot:item="{ item }">
                    {{ item.bloque.nomenclatura }}-{{ item.codigo }}
                  </template>

                   <template slot="selection" slot-scope="data">
                    {{data.item.bloque.nomenclatura}} - {{data.item.codigo}}
                  </template>
                
                </v-select>
                </v-col>
                </v-row>
              <v-row class="row-height mt-n8">
                <v-col cols="2">
                  <v-select 
                  v-model="paquete.dia"
                  item-text="dia" 
                  item-value="dia" 
                  :items="diasemana"
                  @change="horario()"
                  label="Día">
                  </v-select>
                </v-col>
                <v-col cols="1">
                  <v-text-field
                  class="ml-2"
                  v-model="paquete.horario"
                  label="Horario"
                  readonly
                ></v-text-field>

                 </v-col>

                <v-col cols="3">
                  <semanas
                  :dia="diase"
                  :mes="fechactual.mesNum"
                  :year="fechactual.year"
                  @dias="diast"
                  ></semanas>
                </v-col>

                <v-col cols="3">
                  <v-select 
                  v-model="paquete.competencia.competencia"
                  item-text="nombre" 
                  item-value="nombre" 
                  :items="competencias"
                  @change="cargaresultados()"
                  label="Competencias">
                  <template v-slot:item="slotProps">
                    {{slotProps.item.duracion}}/{{slotProps.item.acumulado}} : {{slotProps.item.nombre}}
                  </template>
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-select 
                  v-model="paquete.resultado"
                  
                  :items="resultados"
                  
                  multiple
                
                  label="Resultado aprendizaje">
                  <template v-slot:item="slotProps">
                    {{slotProps.item.duracion}}/{{slotProps.item.acumulado}} : {{slotProps.item.descripcion}}
                    </template>

                  <template slot="selection" slot-scope="data">
                    <v-chip>
                      {{data.item.descripcion}}
                    </v-chip>
                  </template>
                  </v-select>
                  <!-- 
                     
                      item-value="descripcion" 
                    @change="actualizaorden()" -->
                </v-col>
              </v-row>


                <v-row v-if="paquete.horas != null" class="row-height mt-n16">
                  <v-col cols="1">
                    <span>Total horas</span>
                    <v-chip
                    class="ma-2"
                    color="green"
                    text-color="white"
                  >
                    {{paquete.horas}}
                  </v-chip>
                  
                </v-col>
               </v-row>
             
             
            </v-container>
          
            <v-btn class="ma-2 mt-n16" outlined color="indigo" @click="validador()">
              Crear Evento
            </v-btn>
          </v-form>
        </v-card-text>
        </v-card>
    </v-row>
   

    <v-row class="mt-5" justify="space-around" v-if="evento.eventos.length > 0">

      <v-expansion-panels>
        <v-expansion-panel>
         <v-expansion-panel-header>
             <v-app-bar flat color="rgb(52,188,52)">
                <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
                 <v-toolbar-title class="text-h6 white--text pl-0">
                  Eventos A Reportar
                </v-toolbar-title>
                  </v-app-bar>
                  </v-expansion-panel-header>
                   <v-expansion-panel-content>
                      <LeventoView
                          :evento="evento.eventos"
                           @enviardatos="enviareventos"
                           @eliminarevento="eliminarevento"
                           
                           >
                      </LeventoView>
                      <v-row>
                        <v-col>
                          <v-btn block  class="ma-2" outlined color="indigo"  @click="enviareventos()">
                            GUARDAR EVENTOS
                          </v-btn>
                        </v-col>
                      </v-row>
                   </v-expansion-panel-content>
                 </v-expansion-panel>
                </v-expansion-panels>
       </v-row>

       <v-row class="mt-5" justify="space-around">

        <v-expansion-panels>
          <v-expansion-panel>
             <v-expansion-panel-header>
                <v-app-bar flat color="rgb(52,188,52)">
                   <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
                      <v-toolbar-title class="text-h6 white--text pl-0">
                              Eventos Reportados en el MES
                      </v-toolbar-title>
                      <v-divider></v-divider>
                      <h5 class="white--text">Total horas reportadas</h5>
                        <v-chip
                          class="ma-2"
                          color="yellow"
                          outlined
                         >
                        {{ totalhoras }}
                      </v-chip>

                </v-app-bar>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <LeventoView
                    :evento="saveeventos"
                    tipo="2"
                    @eliminareventobd="eliminareventobd"
                 >
                </LeventoView>
              
               </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        
      </v-row>
      <v-snackbar
        v-model="snackbar"
         >
           {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
      
   
      <pre>
        {{ $data }}
      </pre>
    
  </v-container>
</template>
<script>
import axios from "axios";
import semanas from "../components/semanas.vue"
import LeventoView from "../components/LeventoView.vue"
const colombia = require("../json/ciudades");
export default {
  components:{
       semanas,
       LeventoView
        },

  
  props: {
    datos: Object,
    mostrar: Boolean,
  },
  data() {
    return {
      snackbar : false,
      text : '',
      horajornada : 0,
      api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      paqdiasmes : null,
      totalhoras : 0,
      saveeventos : [],
      
      evento : {
        mes : null,
        year : null,
        instructor : null,
        eventos : []
      },

      limpieza : null,
   paquete: {
        ficha: {
           ficha : null,
           codigo : null,
        }, 
        programa : {
           nombre : null,
           id : null
        },
        nivel : null,
        municipio : null,
        ambiente : {
            id : null,
            ambiente : null,
        },
        dia : null,
        horario : null,
          
        horas : null,
        diastrabajados : null,
        competencia : {
          competencia : null,
          codigo : null,
        },
        resultado : []
        /* {
           resultado : null,
           orden : null,
        } */,
        conflict : false
      },
      centros: null, //Aquí se cargan todos los centros que están en la bd

      fechactual : null,
      instructor : null,
      fichas: [],
      ambientes : [],
      competencias : [],
      resultados : [],
      dia : null,
      
      diase : null,
      diasemana : [
        {
         dia : "Lunes",
         ndia : 1
        },
        {
         dia : "Martes",
         ndia : 2
        },
        {
         dia : "Miercoles",
         ndia : 3
        },
        {
         dia : "Jueves",
         ndia : 4
        },
        {
         dia : "Viernes",
         ndia : 5
       },
       {
         dia : "Sabado",
         ndia : 6
      },

    ],
      error : null,
      departamentos: colombia,
      camposRules: [(v) => !!v || "Campo es requerido"],
    };
  },

  methods: {
    cargaambiente(){
      let amb = this.ambientes.filter(e => e._id == this.paquete.ambiente.id)
      this.paquete.ambiente.ambiente = amb[0].bloque.nomenclatura + '-' + amb[0].codigo

    },

    async eliminareventobd(pos){
      let usuario = this.$store.getters.usuario.id
      let vm = this
      const paq = {
          instructor : usuario,
          evento : this.saveeventos[pos],
          eventIndex : pos
      }
         await axios
        .post(`${this.api}/evento/eliminar/especifico`,paq)
        .then(function (response) {
             console.log(response)
              vm.bdeventos()
          })
       
       



    },

    eliminarevento(pos)
    {
      this.evento.eventos.splice(pos,1)
    },

   async bdeventos(){
   
      var wd = this
      await axios
      .get(`${this.api}/evento/especificos/${this.evento.mes}/${this.evento.year}/instructor/${this.evento.instructor}`)
      .then(function (response) {
          console.log(response)
          wd.saveeventos = response.data[0].eventos
       })
   
      .catch(error => {
          {
           console.log(error.response)
         
          }
        })
   
   },
   async enviareventos()
    {
      var wd = this
      await axios
        .post(`${this.api}/evento/crear`, this.evento)
        .then(function () {
         wd.evento.eventos = []
         wd.bdeventos();
          })
        .catch(function (error) {
          {
           
                wd.evento.eventos = []
                for (let datos of error.response.data.message)
                 {
                    let ele = datos.evento
                    ele.conflict = true
                    ele.mensaje = datos.mensaje
                    wd.evento.eventos.push(JSON.parse(JSON.stringify(ele)))
                 }
            }
          
          
         });

      
    },
    actualizaorden()
    {
      let r = this.resultados.filter(e => e.descripcion == this.paquete.resultado.resultado)
      this.paquete.resultado.orden = r[0].orden
    },
    cargaresultados()
    {
      let r = this.competencias.filter(e => e.nombre == this.paquete.competencia.competencia)
      this.paquete.competencia.codigo = r[0].codigo
      this.resultados = r[0].resultados
    
    },
    diast(dias){
      this.paqdiasmes = dias
      this.paquete.diastrabajados = this.paqdiasmes.diastrabajados
      this.paquete.horas = this.paquete.diastrabajados.length * this.horajornada
    },

    horario(){
      const res = this.fichas.filter(e => e._id === this.paquete.ficha.ficha)
      const j =  res[0].jornadas.filter(e => e.dia == this.paquete.dia);
      this.paquete.horario = `${j[0].horaInicio}-${j[0].horaFin}`
      this.horajornada = (parseInt(j[0].horaFin) - parseInt(j[0].horaInicio)) + 2
      let r = this.diasemana.filter(e => e.dia == this.paquete.dia)
      this.diase = r[0].ndia
      this.paqdiasmes.diastrabajados = []
      this.paquete.horas = 0
     },

    async cargadatos(){
     const res = this.fichas.filter(e => e._id === this.paquete.ficha.ficha)
     this.paquete.ficha.codigo = res[0].codigo
     this.paquete.programa.nombre = res[0].programa.nombre
     this.paquete.programa.id = res[0].programa._id
     this.paquete.nivel =res[0].programa.nivel
     this.paquete.municipio = res[0].sede.municipio
     this.paquete.ambiente.id = res[0].ambiente._id

     const ambientesResponse = await axios.get(`${this.api}/ambiente/sede/${res[0].sede._id}`);
     this.ambientes = ambientesResponse.data;

      console.log(this.ambientes)
     let amb = this.ambientes.filter(e => e._id == this.paquete.ambiente.id)
       this.paquete.ambiente.ambiente = amb[0].bloque.nomenclatura + '-' + amb[0].codigo

       const competenciasgestor = await axios.get(`${this.api}/gestor-t/${this.paquete.ficha.ficha}/`);
     console.log(competenciasgestor.data)
     this.competencias = competenciasgestor.data[0].competencias

    //const competencias = await axios.get(`${this.api}/competencia/programa/${res[0].programa._id}`);
   //  console.log(competencias.data)
    //this.competencias = competencias.data[0].competencias
   
    },

    validador(){
     let total = this.paquete.resultado.reduce((accumulator, resultado) =>
          accumulator + (resultado.duracion - resultado.acumulado), 0);
    if (this.paquete.diastrabajados.length < this.paquete.resultado.length )
     {
          this.snackbar = true,
          this.text = `El numero de dias trabajados no es suficiente para el numero de
                        resultados de aprenizajes a reportar`
          return false
     }
     else 
     {
      if (total < this.paquete.horas)
      {
          this.snackbar = true,
          this.text = `El numero de horas trabajadas supera al numero de horas del
          resultado de aprendizaje`
          return false
      }
      else{
        if (this.paquete.resultado.length > 1)
        {
          let acumulado = this.paquete.horas
          let diast = this.paquete.diastrabajados
          let newpaquete = JSON.parse(JSON.stringify(this.paquete))
          let ele = 0
          let presul = 0
          
            for(let eresultado of this.paquete.resultado)
             {
              let diastomar = 1
              
              if (acumulado > 0)
              {
                let horasf =  eresultado.duracion - eresultado.acumulado
                if ((horasf >= this.horajornada) && (acumulado > this.horajornada))
                 {
                                  diastomar = Math.trunc(horasf / this.horajornada)
                                  newpaquete.horas = (this.horajornada * diastomar)
                                  acumulado -= this.horajornada * diastomar

                 }
               else{
                 
                  if (horasf > acumulado)
                  {
                  newpaquete.horas = acumulado
                  acumulado -= acumulado
                  }
                  else
                  {
                    newpaquete.horas = horasf
                  acumulado -= horasf

                  }
                  
                  
               }

                  
               
                  newpaquete.diastrabajados = []
                    for(let x=1;x<=diastomar;x++){
                    newpaquete.diastrabajados.push(diast[ele])
                    ele +=1
                    }
                
                    const { descripcion,orden } = this.paquete.resultado[presul]
                    var obj = new Object()
                    obj.resultado = descripcion
                    obj.orden = orden
                    console.log(obj)

              //    newpaquete.resultado = this.paquete.resultado[presul]
              newpaquete.resultado = obj
                  // a is constant
                
                   this.guardar(newpaquete)
                 }

                presul += 1
               
            }
            this.paquete = JSON.parse(JSON.stringify(this.limpieza)) 
        }
        else
        {
          const { descripcion,orden } = this.paquete.resultado[0]
          var obje = new Object()
          obje.resultado = descripcion
          obje.orden = orden
          this.paquete.resultado = obje
          this.guardar(this.paquete)
          this.paquete = JSON.parse(JSON.stringify(this.limpieza))

        }
      }
    }

    },

    guardar(paquete) {
      //const p = JSON.parse(JSON.stringify(this.paquete))
      const p = JSON.parse(JSON.stringify(paquete))
      
      if (this.evento.eventos.length == 0)
       {
       this.evento.eventos.push(p)
      // this.paquete = JSON.parse(JSON.stringify(this.limpieza))
       this.diase = null
       this.paqdiasmes.diastrabajados = []
       }
      else
       {
        var  comun = []
        for (let data of this.evento.eventos)
        {
          comun =   data.diastrabajados.filter(elemento => p.diastrabajados.includes(elemento));
          if (comun > 0)
           break;
        }
         
        let r = this.evento.eventos.filter(e => (e.dia == p.dia)
         && (e.ambiente.ambiente == p.ambiente.ambiente) 
         && (e.horario == p.horario)
         && (comun.length > 0)
         )
        if (r.length > 0)
         alert('igual')
       
       else
        {
        this.evento.eventos.push(p)
      //  this.paquete = JSON.parse(JSON.stringify(this.limpieza))
        this.paqdiasmes.diastrabajados = []
        }
       }
    
   }
  },

  computed: {
    ciuda() {
      var ciudades = null;
      for (var pos in this.departamentos) {
        if (this.departamentos[pos].departamento == this.paquete.departamento) {
          ciudades = this.departamentos[pos].ciudades;
        }
      }
      return ciudades;
    },
  },
  async mounted() {
  
    this.limpieza = JSON.parse(JSON.stringify(this.paquete))
    let instructor = this.$store.getters.usuario.id
    const fecha = await axios.get(`${this.api}/date/`);
    this.fechactual = fecha.data;
    this.evento.mes = this.fechactual.mesNum
    this.evento.year = this.fechactual.year
    this.evento.instructor = instructor

    this.bdeventos()

   // const inst = await axios.get(`${this.api}/instructor/${instructor}`);
   // this.instructor = inst.data
   
   let programas = this.$store.getters.usuario.programas
   let centro = this.$store.getters.usuario.centro
   const sedes  = await axios.get(`${this.api}/sedes/centro/${centro}`);
   console.log(sedes)
    for (let data of programas)
     {
      for (let sed of sedes.data)
       {
          const fichas  = await axios.get(`${this.api}/ficha/programa/${data}/sede/${sed._id}`);
          for (let x of fichas.data)
           {
            this.fichas.push(x)
           }
      }
     } 
 },
 watch: {
   saveeventos(){
    this.totalhoras = this.saveeventos.reduce((accumulator, currentValue) => accumulator + currentValue.horas, 0);
    
       }
 },
};
</script>
<style>
* {
  box-sizing: border-box;
}
.fondo {
  background: linear-gradient(
    90deg,
    rgba(138, 74, 22, 0.7820378151260504) 15%,
    rgba(6, 92, 23, 1) 49%,
    rgba(226, 175, 56, 1) 82%
  );
}

.numero {
  border: 2px solid rgb(136, 136, 136);
  padding: 2px 20px;
}

.instructor {
  border-bottom: 2px solid rgb(136, 136, 136);
}
.row-height {
  height: 150px; /* Ajusta la altura según tus necesidades */
}
</style>
