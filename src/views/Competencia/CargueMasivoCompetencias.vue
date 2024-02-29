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

    <v-row>
      <v-col cols="6">
        <v-select
          :items="programas"
          item-text="nombre"
          item-value="_id"
          label="Seleccione Programa"
          v-model="programa"
          append-icon="book"
          :rules="camposRules"
        >
        <template v-slot:item="{ item }">
          {{ item.nivel }} - {{ item.nombre}} - Intensidad Horario : {{ item.intensidad_horaria }}
        </template>

        <template slot="selection" slot-scope="data">
          {{ data.item.nivel }} - {{ data.item.nombre }}
        </template>
      
      </v-select>
      </v-col>
    </v-row>

        <v-file-input
        :rules="rules"
        placeholder="csv file"
        accept=".csv"
        v-model="file"
        prepend-icon="mdi-camera"
        label="CSV"
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
                  const formData = new FormData();
                   formData.append('file', this.file);
                   formData.append('programa', this.programa);

                    await axios
                    .post(`${this.api}/carguemasivocompetencias/cargar/`, formData)
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