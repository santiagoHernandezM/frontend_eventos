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
        @click="crearArchivoExcel()"
      >
        DESCARGAR ARCHIVO
        <v-icon right dark> mdi-cloud-download </v-icon>
      </v-btn>
    </v-row>

    <v-snackbar v-model="show"> Seleccione un mes ... </v-snackbar>
  </v-app>
</template>
<script>
import axios from "axios";
import XLSX from "xlsx";

export default {
  data() {
    return {
      api: `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
      mes: null,
      data: [],
      show: false,
    };
  },
  methods: {
    generarxls() {
      if (this.mes != null) {
        const workbook = XLSX.utils.book_new();
        const hojaDeTrabajo = XLSX.utils.json_to_sheet(this.data);
        console.log(hojaDeTrabajo);
        let fecha = this.mes.split("-");
        const filename = `Reporte eventos ${fecha[1]} - ${fecha[0]} `;
        XLSX.utils.book_append_sheet(workbook, hojaDeTrabajo, filename);
        XLSX.writeFile(workbook, `${filename}.xlsx`);
      } else {
        this.show = true;
      }
    },

    crearDatosExcel() {
      const encabezados = [
        "MUNICIPIO",
        "AMBIENTE",
        "DOCUMENTOS INSTRUCTOR",
        "NOMBRE",
        "APELLIDO",
        "FICHA",
        "PROGRAMA",
        "NIVEL",
        "HORARIO",
        "DÍA",
        "DIAS TRABAJADOS",
        "COMPETENCIA",
        "RESULTADO",
        "INTENSIDAD HORARIA",
        "No. SESIONES",
        "HORAS",
      ];
      const datos = this.data.map((objeto) => {
        const { instructor, ficha, diastrabajados, programa, nivel, municipio, ambiente, dia, horario, horas, competencia, resultado } =
          objeto;
          let h = horario.split('-')
         let intensidad =  (parseInt(h[1]) - parseInt(h[0])) + 2
        return [
          municipio,
          ambiente.ambiente,
          instructor.documento,
          instructor.nombre,
          instructor.apellido,
          ficha.codigo,
          programa.nombre,
          nivel,
          horario,
          dia,
          diastrabajados.sort((a,b) => a - b).join('-'),
          competencia.competencia,
          resultado.resultado,
          intensidad,
          diastrabajados.length,
          horas,
        ];
      });
      return [encabezados, ...datos];
    },

    crearArchivoExcel() {
      const libro = XLSX.utils.book_new();
      const hoja = XLSX.utils.aoa_to_sheet(this.data);
      XLSX.utils.book_append_sheet(libro, hoja, "Hoja1");
      XLSX.writeFile(libro, "programas.xlsx");
    },

  },

  watch: {
    async mes() {
      let fecha = this.mes.split("-");
      this.data = [];
      let programas = this.$store.getters.usuario.programas;
      let idprograma = programas.map((e) => e._id);
      let strprograma = idprograma.join(",");
      console.log(strprograma);
      const response = await axios.get(
        `${this.api}/evento/${fecha[1]}/${fecha[0]}/${strprograma}`
      );

      for (var datos of response.data) {
        this.data.push(datos);
      }

      this.data = this.crearDatosExcel();
    },
  },
};
</script>

<style>
.custom-date-picker {
  height: 320px; /* Ajusta el valor según tus necesidades */
}
</style>
