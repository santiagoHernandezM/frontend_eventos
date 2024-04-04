<template>
    <div>
      <v-row class="d-flex justify-center align-center">
       <v-col cols="8">
        <v-chip
        class="ma-2"
        color="primary"
        >
      Cargue Masivo Programa
    </v-chip>

    

        <v-file-input
        :rules="rules"
        placeholder="excel file"
        accept=".xlsx"
        v-model="file"
        prepend-icon="mdi-file-excel"
        label="Excel file"
      ></v-file-input>
      <v-btn
      class="ma-2"
      outlined
      color="indigo"
      @click="cargarprogramas()"
    >
      Cargar archivo
    </v-btn>
    </v-col>
    </v-row>  
   
    </div>
</template>
<script>
import axios from "axios";
export default {
    data() {
        return {
            api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
            file : null,
            rules: [
            value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
           ],
        }
     },

    async mounted() {
     

     },
        methods: {
          async  cargarprogramas()
            {
                if(this.file!=null)
                {
                  const formData = new FormData();
                   formData.append('file', this.file);
                    await axios
                    .post(`${this.api}/carguemasivocompetencias/cargarprogramas/`, formData)
                       .then(function (response) {
                          console.log(response)
                      })
                   .catch(function (error) {
                     {
                         console.log(error)
                     }
                     })
                 }
          }
        }
    
   
}
</script>
<style scoped>

</style>