<template>
  <v-container>
    <v-row>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small> mdi-chevron-left </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small> mdi-chevron-right </v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-toolbar-title class="mr-5" v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>

          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right> mdi-menu-down </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet height="800">
          <v-calendar
            v-model="focus"
            ref="calendar"
            :weekdays="weekday"
            :value="today"
            :events="eventcalendar"
            :event-overlap-mode="mode"
            :event-overlap-threshold="30"
            first-time="06:00"
            :interval-count="17"
            :type="type"
            @click:more="viewDay"
            @click:date="viewDay"
            color="yellow"
            style="height: 600px; font-size: 12px"
          ></v-calendar>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      eventos: [],
      mode:"column",
      eventcalendar: [],
      weekday: [1, 2, 3, 4, 5, 6, 0],
      mes: null,
      year: null,
      api: `${process.env.VUE_APP_API_URL}`,
      today: null,
      focus: "",
      type: "month",
      typeToLabel: {
        month: "Mes",
        week: "Semana",
      },
      diasShort: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    };
  },

  async mounted() {
    const fecha = await axios.get(`${this.api}/date/`);
    var fechactual = fecha.data;
    this.mes = fechactual.mesNum;
    this.year = fechactual.year;
    this.today = `${this.year}-${this.mes}-12`;
    let usuario = this.$store.getters.usuario.id;
    console.log(usuario);
    const inst = await axios.get(
      `${this.api}/evento/especificos/${this.mes}/${this.year}/instructor/${usuario}`
    );
    this.eventos = inst.data[0].eventos;
    for (let even of this.eventos) {
      let horario = even.horario.split("-");
      console.log(horario);
      for (let dias of even.diastrabajados) {
        const dia = `${this.year}-0${this.mes}-${dias}`;
        const starti = `${dia} ${parseInt(horario[0])}:00:00`;
        const ffin = `${dia} ${parseInt(horario[1])}:00:00`;
        console.log(starti, ffin);
        this.eventcalendar.push({
          name: `Ficha : ${even.ficha.codigo} : ${even.ambiente.ambiente}`,
          start: starti,
          end: ffin,
          color: "blue",
        });
      }
      this.$refs.calendar.checkChange();
    }
  },
  methods: {
    viewDay({ date }) {
      this.focus = date;
      this.type = "week";
    },

    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    setToday() {
      this.focus = "";
    },
    formatDayWeek(date) {
      console.log(date.weekday);

      return this.diasShort[date.weekday];
    },
  },
};
</script>

<style scoped>
.vcal-event-name {
  white-space: normal; /* Allow text to wrap within the event name */
  overflow-wrap: break-word;
}

.row {
  align-items: center;
  justify-content: center;
}
.logo {
  height: 500px;
  width: 800px;
  margin: 0;
  padding: 0;
}
</style>
