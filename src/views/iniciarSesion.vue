<template>
  <v-app>
    <v-app-bar
          app         
          dark
          class="fondo">
          <v-divider></v-divider>
                 <v-btn style="background-color:#278d16;color:white; font-size:16px;font-weight: bold;"  @click="dialog=true">Iniciar Sesión</v-btn>
                 <a href=""> <b-icon  icon="question"  style="background-color: #278d16; border-radius:20px;color:white;margin-left:30px" font-scale="3" ></b-icon></a>
                
                </v-app-bar>
       <v-dialog v-model="dialog" max-width="350" height="400"> 
        <div class="container h-60">
          <div class="d-flex justify-content-center h-50">
            <div class="user_card">
              <div class="d-flex justify-content-center">
                <div class="brand_logo_container">
                  <img src="/animation.svg" class="brand_logo"  alt="Logo">
                </div>
              </div>
              <div class="d-flex justify-content-center form_container">
                <form v-on:submit.prevent>
                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text"><i class="fas fa-user"></i></span>
                    </div>
                    <input v-model="users.correo" type="text" name="" class="form-control input_user" placeholder="Username">
                  </div>
                  <div class="input-group mb-2">
                    <div class="input-group-append">
                      <span class="input-group-text"><i class="fas fa-key"></i></span>
                    </div>
                    <input v-model="users.password" type="password" name="" class="form-control input_pass" placeholder="Password">
                  </div>
                    <div class="d-flex justify-content-center mt-3 login_container" v-if="prueba==0">
                 <vs-button dark  class="btn login_btn" @click="login">Iniciar Sesión</vs-button>
                 </div>
                 <div class="d-flex justify-content-center mt-3 login_container" v-if="prueba==1">
                  <vs-button class="btn login_btn"  loading  dark  >
                    Iniciar Sesión
                  </vs-button>

                </div>

                 <v-snackbar
              v-model="isBusy"
              :timeout="2000"
              absolute
              bottom
              
              color="red"
            >
              {{msg}}
            </v-snackbar>
                </form>
              </div>
              
              
              <div class="mt-4">
                <div class="d-flex justify-content-center links">
                  <a href="#" style="color: black">¿olvidaste tu contraseña?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--  <vs-button flat color="#7d33ff" icon
            @click="openNotification('top-center', '#7d33ff')">
            <i class='bx bx-border-top' ></i>
          </vs-button>-->
              </v-dialog>

  
    <v-main>
      
         <v-row justify="end">
           <v-col cols="6" style="background-color:rgb(0, 0, 0)">
            <div class="card">
              <div class="header">
                  <img src="https://logowik.com/content/uploads/images/calendar5662.jpg" width="20%" height="50%">
                  <span class="texto">Eventos</span>
                  <span class="texto2">Software Sena</span>
                
              </div>
              <div class="body typewriter ">
               
                  <p :style="{ marginBottom: paragraph.marginBottom + 'px' }"  v-for="(paragraph, index) in paragraphs" :key="index" >{{ paragraph.text }}</p>
                               
                
                  
              </div>
              <div class="footer">
                 <img src="https://www.opinioncaribe.com/wp-content/uploads/2017/08/sena.jpg" width="70px" height="70px">
              </div>
          </div>
                
           </v-col>
           <v-col cols="6" style="background-color:black">
            <template>
              <object data="/animation.svg" width="720" height="600" type="image/svg+xml"></object>
            </template>
           </v-col>
         </v-row>       
 
    </v-main>
  </v-app>

     
</template>
<script>
import axios from "axios";

export default {
    name: 'App',
    data: () => ({
        api : `${process.env.VUE_APP_API_URL}:${process.env.VUE_APP_API_PORT}`,
        entorno: process.env,
        active: 'home',
        dialog: false,

        users : {
          correo: null,
          password: null
        },
       
        noti: null,
        
        error: false,
        msg: "",
        isBusy: false,
        prueba: 0,
        array: [],
        rolMenu: [],
        paragraphs: [
         { text: `El software de eventos, es un software desarrollado para el control y la gestión del resporte de horas 
         dadas por los instructores del Sena. Sus principales caracteristicas :\r`, delay: 1,marginBottom: 20},  // Primer párrafo aparece después de 1 segundo
        { text: `* Controlar el reporte de horas sobre una
          competencia o sobre un resultado de aprenziaje.`, delay: 12000,marginBottom: 20 }, // Segundo párrafo aparece después de 2 segundos
        { text: `* Gestionar que todos los resultados de aprendizaje de una competencia le sean reportadas sus horas.`, delay:22000,marginBottom: 20},   // Tercer párrafo aparece después de 3 segundos
        { text: `* Disminuye el error humano al momento de diligenciar los eventos.`, delay: 30000,marginBottom: 20}, 
        { text: `* Monitorear el avance de las fichas de formación.`, delay: 35000,marginBottom: 20},  // Tercer párrafo aparece después de 3 segundos
        { text: `* Administrar la disponibilidad de los ambientes de las sedes.`, delay: 40000,marginBottom: 20},
        { text: `* Disponibilidad de los horarios de los instructores.`, delay: 45000,marginBottom: 20}  
      ]
    }),

    mounted() {
      this.applyTypewriterEffect();
    },
    methods: {

      applyTypewriterEffect() {
        const paragraphs = this.$el.querySelectorAll('.typewriter p');

paragraphs.forEach((paragraph, index) => {
  const text = paragraph.innerHTML;
  paragraph.innerHTML = '';

  let charIndex = 0;
  

  setTimeout(() => {
    const type = () => {
      const char = text.charAt(charIndex);
      paragraph.innerHTML += char;
      charIndex++;

      if (charIndex < text.length) {
        setTimeout(type, 50); // Velocidad de animación entre caracteres
      }
    };

    type();
  }, this.paragraphs[index].delay);
});
},


       async login() {
       


          let vm = this
           await axios
              .post(`${this.api}/auth/login`,this.users)
              .then(function (response) {
                console.log(response)
                 if (response.status == 200)
                 {
                     vm.$store.commit('setusuario', response.data)
                     vm.$router.push('dashboard/welcome');
                    }
          
               })
               .catch(function () {
                 {
                      vm.msg = 'Usuario / contraseña Invalidos'
                      vm.isBusy = true
               
            }
          
          
         });
       

          

        }
        
    },

      }
  </script>
  <style scoped>
  

  .fondo{
  background-image: url(../assets/imagen8.jpg);
  background-size: 100% 100%;
  background-attachment: fixed;
  width: 100%;
   margin:0; 
  }
  
.fondoGeneral {
    background-image: url(../assets/fondo.png);
    background-size: 100% 100%;
    background-attachment: fixed;
    margin: 0;
}

.letras {
    color: white;
    margin: auto;
    text-align: center;
    font: bold 80px/1 arial;
    text-transform: uppercase;
    color: rgb(244, 244, 244);
    text-shadow: 0 2px 0 black,
        0 4px 0 black,
        0 6px 0 black,
        0 8px 0 black,
        0 10px 0 black,
        0 12px 0 black;
}

.letras2 {
    font-size: 25px;
    color: black;
    margin: auto;
    text-align: justify;
    font-family: "Mystery Quest", cursive;
}

@import url("https://fonts.googleapis.com/css?family=Mystery+Quest");

.user_card {
    height: 500px;
    width: 450px;
    margin-top: auto;
    margin-bottom: auto;
    background: #060606b9;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(175, 189, 179, 1), 0 6px 20px 0 rgba(202, 142, 142, 1);
    -webkit-box-shadow: 0 4px 8px 0 rgb(78, 187, 57), 0 6px 20px 0 rgb(56, 146, 56);
    -moz-box-shadow: 0 4px 8px 0 rgba(202, 93, 93, 0.2), 0 6px 20px 0 rgba(186, 215, 54, 0.19);
    border-radius: 5px;
}

.brand_logo_container {
    position: absolute;
    height: 170px;
    width: 170px;
    top: -75px;
    border-radius: 50%;
    padding: 10px;
    text-align: center;
    margin-top: 70px;
}

.brand_logo {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    border: 2px solid white;
    margin-top: 16px;
}

.form_container {
    margin-top: 100px;
}

.login_btn {
    width: 100%;
    background: #278d16 !important;
    color: #FFFFFF !important;
    font-weight: 700;
}

.login_btn:focus {
    box-shadow: none !important;
    outline: 0px !important;
}

.login_container {
    padding: 0 2rem;
}

.input-group-text {
    background: #278d16 !important;
    color: #FFFFFF !important;
    border: 0 !important;
    padding-right: 20px;
    border-radius: 0.25rem 0 0 0.25rem !important;
}

.input_user,
.input_pass:focus {
    box-shadow: none !important;
    outline: 0px !important;
}

.custom-checkbox .custom-control-input:checked~.custom-control-label::before {
    background-color: #c0392b !important;
}

/*
  .navbar{
    background-image:url("../assets/Tulbar.png");
    background-attachment: fixed;
    max-height: 55px;
  }*/



body{
  background: #11998e; 
  background: -webkit-linear-gradient(to right, #38ef7d, #11998e); 
  background: linear-gradient(to right, #38ef7d, #11998e); 
}

.card {
  position: relative;
  height: 560px;
  width: 80%;
  background-color: #fff;
  margin: 50px auto;
  margin-right: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.header {
  position: absolute;
  height: 80px;
  width: 95%;
  margin:0 auto;
  left: 0;
  right: 0;
  top:-30px;
  border-radius: 12px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-image: linear-gradient(to right, #078138, #30b05f);
}

.texto {
  position : absolute;
  left: 170px;
  top: 20px;
  font-size: x-large;
  color: white;
}

.texto2 {
  position : absolute;
  left: 170px;
  top: 48px;
  font-size: x-small;
  color: white;
}


.header img {
  position: absolute;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  left: 90px;
  top: 10px;
}

.header h3 {
  position: absolute;
  font-family: sans-serif;
  color: white;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
  top: 118px;
  left: 90px;
}

.header p {
  position: absolute;
  font-family: sans-serif;
  color: rgb(236, 233, 233);
  font-size: 13px;
  top: 166px;
  left: 90px
}

.body {
  position: absolute;
  height: 126px;
  left: 5px;
  right: 5px;
  top: 15%;
  border-radius: 12px;
}

.body ul {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
  
}

.body ul li {
  position: absolute;
  list-style: none;
  display: block;
  height: 40px;
  width: 100%;
  left: 0;
  right: 0;
  border-radius: 12px;
  background-color: transparent;
  transition: all .3s ease-in-out;
}

.body ul li p,
h3,
i {
  position: absolute;
}

.body ul li h3 {
  top: -17px;
  left: 58px;
  color: #16a085;
  
}

.body ul li p {
  top: 14px;
  left: 59px;
  font-size: 12px;
  font-family: sans-serif;
  color: #16a085;
}

.body ul li i {
  left: 8px;
  top: 7px;
  color: #16a085;
  font-size: 26px;
}

.body ul li:nth-child(1) {
  top: -16px;
}

.body ul li:nth-child(2) {
  top: 26px;
}

.body ul li:nth-child(3) {
  top: 68px;
}

.body ul li:nth-child(1) i {
  left: 12px;
}

.body li:hover {
  background-color: #16a085;
  cursor: pointer;
}

.body li:hover i{color:#fff}
.body li:hover h3{color:#fff}
.body li:hover p{color:#fff}
/*footer*/

.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 80px;
  bottom: -30px;
  left: 0;
  right: 0;
  border-radius: 12px;
  width:95%;
  margin: 0 auto;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  background-image: linear-gradient(to right, #078138, #30b05f);
}

.footer ul {
  position: absolute;
  left: -60px;
}

.footer ul li {
  display: inline-block;
  margin-left: 60px;
}

.footer ul li i {
  font-size: 30px;
  color: #000;
  transition: all .3s ease-in;
}

.footer ul li:hover i {
  transform: scale(0.9);
  color: #fff;
  cursor: pointer;
}

.credit a{
  text-decoration: none;
  color: #fff;
  
}

.credit{
  text-align: center;
}


@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: orange; }
}

.margen{
  margin-bottom: 80px;

}

.typewriter p {
  overflow: hidden;
  border-right: .15em solid orange;

 /* white-space: nowrap;*/
  margin: 0;
  letter-spacing: .15em;
  animation: typing 3s steps(40, end), blink-caret .75s step-end infinite;
}




</style>