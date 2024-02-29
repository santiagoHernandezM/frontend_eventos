<template>
  <v-navigation-drawer v-model="drawer" 
  color="white"
  app
  class="fon" 
  width="320px">

    <vuescroll :ops="ops">
      <router-link
      to="/dashboard/welcome"
      >
      <div style="text-align: center" >
        <label class="letra" for="">EVENTOS SENA</label>
      </div>
   
      <div style="text-align: center">
        <label class="letra2" for="">{{centro.nombre}}</label>
      </div>
    </router-link>
      <div class="centrar">
      
        <img
          src="../../assets/logos/Diseno.png"
          alt="Evento"
          width="100px"
        >
      </div>
       <div class="app-sidebar-content">
        <sidebar-menu  showOneChild :menu="menu"/>
      </div>
    </vuescroll>
  </v-navigation-drawer>
</template>

<script>
const menut = require("../../json/menu");

import { SidebarMenu } from "vue-sidebar-menu";
import vuescroll from "vuescroll";
import axios from 'axios';
//import LogoSVG from "@/assets/logos/DisenoAnimado.svg";

export default {
  components: {
    SidebarMenu,
    vuescroll,
   // LogoSVG,
  },

  props: ["drawer"],
  data: () => ({
    centro : null,
    api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
    ops: {
      scrollPanel: {
        initialScrollY: false,
        initialScrollX: false,
        scrollingX: false,
        scrollingY: true,
        speed: 300,
        easing: undefined,
        verticalNativeBarPos: "right",
      },
      rail: {
        background: "rgba(0, 0, 0, 0.158)",
        opacity: 1,
        size: "10px",
        specifyBorderRadius: false,
        gutterOfEnds: null,
        gutterOfSide: "2px",
        keepShow: false,
      },
      bar: {
        showDelay: 500,
        onlyShowBarOnScroll: true,
        keepShow: false,
        background: "#0378a677",
        opacity: 1,
        hoverStyle: false,
        specifyBorderRadius: false,
        minSize: 0,
        size: "9px",
        disable: false,
      },
    },

    links: [
      ["mdi-inbox-arrow-down", "Inbox"],
      ["mdi-send", "Send"],
      ["mdi-delete", "Trash"],
      ["mdi-alert-octagon", "Spam"],
    ],

    menu : [],

  }),
 async  mounted() {
    let rol = this.$store.getters.usuario.roles
    let centro = this.$store.getters.usuario.centro
    const response = await axios.get(`${this.api}/centro/${centro}`);
    console.log(`centro ${response}`)
    this.centro = response.data
  
    const found = rol.find((element) => element == 'Administrator');
    if (found != undefined)
      {
      this.menu = menut[0].admin
      }
    else
    {
      const inst = rol.find((element) => element == 'Instructor');
      if (inst != undefined)
         this.menu = menut[1].instructor
    }

    },

    methods: {
      inicio(){
        this.$router.push('/dashboard/welcome');
      }
    },
   
  
};
</script>
<style>
.fon {
  /* background-image:url("../../assets/images/sidebar/abstract4.jpg");*/
  /*background-image: url("../../assets/6079758.jpg"); 
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-attachment: fixed;*/
  background-color:rgb(194, 240, 155);
  color:black;
  width: 100%;
  height: 100%;
  margin: 0;
}
.letra {
  color: black;
  font-size: 40px;
  font-family:'Courier New', Courier, monospace;
  font-weight: 400;
  text-shadow: 2px 2px 3px rgb(88, 214, 74);
}

.letra2 {
  color: black;
  font-size: 20px;
  font-family:'Courier New', Courier, monospace;
  font-weight: 400;
  text-shadow: 2px 2px 3px rgb(88, 214, 74);
}

.centrar{
  display: flex;
  justify-content: center;
}

.vsm-arrow {
  color: rgb(125, 234, 132);
  font-size: 14px;
  font-weight: 800;
}

.v-sidebar-menu .vsm-title {
  color:black;
  font-weight: 800;
  font-size: 15px;
  font-family:'Courier New', Courier, monospace;
}

.vsm-icon{
  float:right;
  

  border-radius: 50%;
  
   
}

.v-sidebar-menu .vsm-icon {
  color : black;

  margin-left:-10px;
  width:  36px;
  height: 36px;
}

.v-sidebar-menu .vsm-header {
  color : black;
  font-size: 20px;
}


</style>
