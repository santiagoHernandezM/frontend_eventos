<template>
<v-app>
    <v-container>
      <v-row justify="space-around">
        <v-card width="100%">
          <v-app-bar flat color="rgb(255, 128, 0)" height="70px" >
            <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
  
            <v-toolbar-title class="text-h6 white--text pl-0" >
              Disponibilidad
            </v-toolbar-title>

            <v-row justify="center">
              <v-col cols="6">
                <v-select
                :items="ambsedes"
                item-text="nombre"
                item-value="_id"
                v-model="sede"
                class="mt-5 custom-select"
                color="white"
                label="Seleccione una sede"
                @change="cargarambientes()"

                >
              </v-select>

              </v-col>
              <v-col cols="5">
                <v-select
                :items="calendario"
                item-text="nombre"
                item-value="id"
                v-model="ambiente"
                class="mt-5 custom-select"
                color="white"
                   label="Seleccione Ambiente"
                @change="cargardisponibilidad()"
              >
               </v-select>

              </v-col>
            
            </v-row>
           
          
  
            <v-spacer></v-spacer>
  
         
          <v-chip
            class="ma-2"
            color="rgb(177, 231, 111)"
            text-color="black"
                     >
                     
            Disponible
          </v-chip>
          <v-chip
            class="ma-2"
            :color="cocupado"
            text-color="black"
                     >
                     
            Ocupado
          </v-chip>
            <v-btn color="white" icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-app-bar>
          <v-card-text v-if="ambiente !=null">
              <v-row>
                <v-col>
                    <v-sheet height="600">
                    <v-calendar
                       ref="calendar"
                       :events="events"
                       color="blue"
                       :event-overlap-mode="mode"
                       :event-overlap-threshold="30"
                       @click:event="showEvent"
                      ></v-calendar>
                    </v-sheet>
                </v-col>
              </v-row>
          </v-card-text>
        </v-card>
      </v-row>
      <v-dialog
      v-model="dialog"
      width="600"
    >
     
      <v-card>
        <v-card-title class="text-h5 cyan accent-1">
         FICHA : {{paquete.ficha}}
        </v-card-title>
        <v-card-title class="mb-n5">
          Programa : {{ paquete.programa }}
        </v-card-title>
        <v-card-title >
          Instructor : {{ paquete.instructor }}
        </v-card-title>

        <v-textarea
        filled
        auto-grow
        label="Competencia"
        rows="4"
        class="ml-10 mr-10"
        row-height="20"
        v-model="paquete.competencia"
        readonly
        shaped
      >
     
    </v-textarea>
    <v-textarea
        filled
        auto-grow
        label="Resultado de Aprendizaje"
        rows="4"
        class="ml-10 mr-10"
        row-height="20"
        v-model="paquete.resultado"
        readonly
        shaped
      >
     
    </v-textarea>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            CERRAR
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <pre>
      {{ $data }}
    </pre>
    </v-container>
</v-app>
    
</template>
<script>
import  axios  from 'axios';

export default {
    data() {
        return {
            api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
            ambsedes : [],
            mode: 'stack',
            events : [],
            calendario : [],
            dialog : false,
            mes : null,
            year : null,
            sede : null,
            cdisponible : 'rgb(177, 231, 111)',
            cocupado : 'rgb(245, 120, 120)',
            ambiente : null,
            paquete : {
               instructor : null,
               ficha : null,
               nivel : null,
               programa : null,
               codigo_competencia : null,
               competencia : null,
               resultado : null
            }
            }
    },
    methods: {
     async showEvent ({ nativeEvent, event }) {
       
        let selectedElement = nativeEvent.target
        let elemento = selectedElement.textContent
        let calendar =  this.calendario.findIndex((e) =>{return e.id == this.ambiente })
        let evento =  this.calendario[calendar].calendario[event.pos]
        console.log(evento)
        switch(elemento) {
          case "Tarde":
            if (evento.afternoon != null)
            {
              
              const response = await axios.get(`${this.api}/user/instructor/${evento.afternoon.instructor}`);
              this.paquete.instructor = `${response.data.nombre} ${response.data.apellido}`
              this.paquete.programa = evento.afternoon.programa
              this.paquete.ficha = evento.afternoon.ficha
              let compe = evento.afternoon.competencia.competencia
              this.paquete.competencia = compe.toUpperCase();
              this.paquete.resultado = evento.afternoon.resultado
              this.dialog = true
              console.log(this.paquete.instructor)
            }
            break;
          case "Noche":
            console.log('por la noche')
           break;
          case "Mañana":
            console.log('por la manana')
           break;
        default:
    // code block
}
                        /*
     
        console.log(evento)
        console.log(evento.instructor)
        this.dialog = true*/
        nativeEvent.stopPropagation()
      },

      async cargarambientes(){
        const response = await  axios.get(`${this.api}/gestor-ambiente/sede/${this.sede}`);
        console.log(response.data)
       this.calendario = response.data[0].ambientes
       console.log(this.calendario)
      },

      cargardisponibilidad()
      {
        this.events = []
        var vm = this
        var ambiente =    this.calendario.filter((e) => {
             return  e.id == vm.ambiente
          })
          console.log(ambiente)
        for (var x=0;x<=30;x++){
            var tempo = x + 1
               if (tempo  < 10){
                tempo = `0${tempo}`
                }
          
            const dia = `${this.year}-0${this.mes}-${tempo}`;
            const starti = new Date(`${dia}T00:00:00`)
            const ffin = new Date(`${dia}T23:59:59`)
            let color = null
            let even = ambiente[0].calendario[x] 
                    
           color =   (even.morning == null) ? this.cdisponible:this.cocupado
           this.events.push({
            name: 'Mañana',
            start: starti,
            end: ffin,
            color :color,
            pos : x
            
          })

          
          color =   (even.afternoon == null) ? this.cdisponible:this.cocupado
           this.events.push({
            name: 'Tarde',
            start: starti,
            end: ffin,
            color :color,
            pos : x
          
          })

      
          color =   (even.night == null) ? this.cdisponible:this.cocupado
           this.events.push({
            name: 'Noche',
            start: starti,
            end: ffin,
            color :color,
            pos : x
            
          })
        }
      },

        getEvents(){
          
               const dia = "2023-08-10";
               const starti = new Date(`${dia}T00:00:00`)
               const ffin = new Date(`${dia}T23:59:59`)
              
      
        this.events.push({
            name: 'aly',
            start: starti,
            end: ffin,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
           }),
           this.events.push({
            name: 'aly',
            start: starti,
            end: ffin,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
           }),
           this.events.push({
            name: 'aly',
            start: starti,
            end: ffin,
            color: this.colors[this.rnd(0, this.colors.length - 1)],
           })
        },

        rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },

      
    },

    async mounted() {
    
      const fecha = await axios.get(`${this.api}/date/`);
      var fechactual = fecha.data;
      this.mes = fechactual.mesNum
      this.year = fechactual.year

      let centro = this.$store.getters.usuario.centro
      const response = await  axios.get(`${this.api}/sedes/centro/${centro}`);
      this.ambsedes = response.data
      /*
      await axios
        .get(`${this.api}/gestor-ambiente`)
        .then(function (response) {
          vm.calendario = response.data.ambientes;
          vm.calendario.push({
             nombre : 'All',
             id : '2'
          })
        
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })
        .finally(function () {
       
        });
        */
    }
    
}
</script>
<style scoped>
.custom-select .v-select__selections .v-select__selection {
  color: red; /* Cambia el color del texto aquí */
  width: 200px;
}
</style>
