<template>
    <div>
      <v-row class="d-flex justify-center align-center">
       <v-col cols="8">
        <v-chip
        class="ma-2"
        color="primary"
        >
      Cargue Masivo
    </v-chip>

            <v-file-input
        :rules="rules"
        placeholder="excel file"
        accept=".xlsx"
        v-model="file"
        prepend-icon="mdi-camera"
        label="EXCEL"
      ></v-file-input>
      <v-btn
      class="ma-2"
      outlined
      color="indigo"
      @click="cargarCSV()"
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
            programa : null,
            programas : [],
            rules: [
            value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
           ],
        }
     },

    async mounted() {
        const programasResponse = await axios.get(`${this.api}/programas/`);
         this.programas = programasResponse.data;
    

     },
        methods: {
          async  cargarCSV()
            {
                if(this.file!=null)
                {
                  let centro = this.$store.getters.usuario.centro
                  const formData = new FormData();
                   formData.append('file', this.file);
                   formData.append('centro', centro);
                 
                    await axios
                      .post(`${this.api}/carguemasivocompetencias/cargarinstructor/`, formData)
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