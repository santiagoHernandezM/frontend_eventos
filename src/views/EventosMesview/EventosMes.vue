<template>
    <v-app>
    <v-row justify="center" class="mt-5">
        <v-date-picker
        type="month"
        v-model="mes"
        class="custom-date-picker"
        flat
        elevation="15"
               color="green accent-4"
      >
    </v-date-picker>
        
    </v-row>
    <v-row justify="center" class="mt-n15">
      <v-btn
      color="green accent-4"
      class="ma-2 white--text"
      @click="generarxls()">
    
      DESCARGAR ARCHIVO
      <v-icon
        right
        dark
      >
        mdi-cloud-download
      </v-icon>
    </v-btn>

     
     </v-row>

     <v-snackbar
     v-model="show"
   >
     Seleccione un mes ...
     </v-snackbar>
   
</v-app>
  </template>
 <script>
 import axios from "axios";
 import XLSX from 'xlsx';
 export default {
   data() {
    return {
       api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        mes : null,
        data : [],
        show : false
       
    }
   },
   methods: {
     generarxls(){
      if (this.mes != null)
      {
      const workbook = XLSX.utils.book_new();
      const hojaDeTrabajo =   XLSX.utils.json_to_sheet(this.data);
      let fecha = this.mes.split('-')
      const filename = `Reporte eventos ${fecha[1]} - ${fecha[0]} `;
      XLSX.utils.book_append_sheet(workbook, hojaDeTrabajo, filename);
      XLSX.writeFile(workbook, `${filename}.xlsx`);
      }
      else
       {
         this.show = true
       }

     

   },
   },
   watch: {
    async mes(){
      let fecha = this.mes.split('-')
        const response = await axios.get(`${this.api}/evento/reporte/${fecha[0]}/${fecha[1]}`);
        for (var datos of response.data)
         {
           for (var n of datos)
             this.data.push(n)
         }
          
        },
   
 }
}
 </script>
 
 <style>
 .custom-date-picker {
  height: 320px; /* Ajusta el valor según tus necesidades */
}
 </style>