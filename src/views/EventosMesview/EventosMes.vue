<template>
    <v-app>
    <v-row justify="center" class="mt-5">
      <v-date-picker
        type="month"
        v-model="mes"
        color="blue-grey lighten-1"
      >
    </v-date-picker>
    </v-row>
    <v-row justify="center">
    <v-btn
    @click="generarxls()">
      Generar archivo
    </v-btn>
     </v-row>
   
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
 
 </style>