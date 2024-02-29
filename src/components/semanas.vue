<template>
    <v-row>
     <v-col cols="12">
      
      <v-select
            v-model="paquete.diastrabajados"
            :items="diastrabajados"
            @change="enviar()"
            attach
            chips
            label="Dias trabajados"
            multiple
          ></v-select>

     <!-- <v-select
      :items="diastrabajados"
      v-model="paquete.diaIni"
      label="Dia Inicial"
      @change="chequeo1()"
    ></v-select>
     </v-col>
    
      <v-col cols="6">
        <v-select
        :items="diastrabajados"
        label="Dia Final"
        v-model="paquete.diaFin"
        @change="chequeo()"
      ></v-select>
      -->
      </v-col>
    </v-row>    
    
</template>
<script>
 const fc = require('festivos-colombia');
export default {
   props:['dia','mes','year'],
   data() {
     return {
        dias : [],
        festivos : [],
        festivosmes : [],
        diastrabajados : [], 
        paquete : {
            diastrabajados : null
        }
    }
  },
  mounted() {
    this.mfestivos()
   
   
   },
  methods: {
   

    enviar(){
      /*if (this.paquete.diaFin < this.paquete.diaIni)
        {
           alert("El dia final no puede ser menor al dia inicial")
           this.paquete.diaFin = []
        }*/
       // this.paquete.diastrabajados = this.paquete.diastrabajados
        this.$emit('dias',this.paquete)
        

    },
     mfestivos(){
        this.festivos = []
        let holidays = fc.getHolidaysByYear(this.year);
        for (let fecha of holidays)
        {
         let data = fecha.date
         let arr = data.split('/');
         let fech = {
             dia : parseInt(arr[0]),
             mes : parseInt(arr[1])
         }
         this.festivos.push(fech)
        
       }
      },
    
      diasmes(){
        this.dias = []
        const diasmes = this.$moment(`${this.year}-${this.mes}`).daysInMonth()
        for(let dias = 1; dias <= diasmes; dias ++)
        {
            const fecha = this.$moment(`${this.year}-${this.mes}-${dias}`)
            if (fecha.day() === parseInt(this.dia)){
                this.dias.push(dias)
            }
        }
        
      },

      filtrar(){
        for (let obj of this.festivos)
         {
            console.log(obj.mes)
            if (obj.mes == this.mes)
              this.festivosmes.push(obj.dia)
          }
          this.diastrabajados = this.dias.filter(num => !this.festivosmes.includes(num));
         }

  },
  watch: {
    dia(){
        this.diasmes()
        this.filtrar()
      
            
       }
  },

}
</script>