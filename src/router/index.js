import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store';


Vue.use(VueRouter)

//rutas de elementos del sidebar
const routes = [
    {
        path: '/',
        name: 'Login',
        component: () =>
            import ('../views/iniciarSesion.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () =>
            import ('../views/dashboard'),
        children: [{
                name: 'DashboardWelcome',
                path: '/dashboard/welcome',
                component: () =>
                    import ('../views/welcome.vue'),
            },


            {
                name: 'regional',
                path: '/dashboard/regional',
                component: () =>
                    import ('../views/RegionaView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'sede',
                path: '/dashboard/sede',
                component: () =>
                    import ('../views/SedeView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'centro',
                path: '/dashboard/centro',
                component: () =>
                    import ('../views/CentroView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'ambiente',
                path: '/dashboard/ambiente',
                component: () =>
                    import ('../views/AmbienteView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
                    
            },
            {
                name: 'bloque',
                path: '/dashboard/bloque',
                component: () =>
                    import ('../views/BloqueView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'tipoambiente',
                path: '/dashboard/tipoAmbiente',
                component: () =>
                    import ('../views/TipoAmbienteView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearprograma',
                path: '/dashboard/crearprograma',
                component: () =>
                    import ('../views/programa/CrearPrograma.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearcompetencia',
                path: '/dashboard/crearcompetencia',
                component: () =>
                    import ('../views/Competencia/CrearCompetencia.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearresultadoaprendizaje',
                path: '/dashboard/crearresultadoaprendizaje',
                component: () =>
                    import ('../views/ResultadosAprendizaje/CrearResultadosAprendizaje.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'carguemasivocompetencias',
                path: '/dashboard/carguemasivocompetencias',
                component: () =>
                    import ('../views/Competencia/CargueMasivoCompetencias.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearinstructor',
                path: '/dashboard/crearinstructor',
                component: () =>
                    import ('../views/Instructor/CrearInstructor.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearficha',
                path: '/dashboard/crearficha',
                component: () =>
                    import ('../views/Ficha/CrearFicha.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'crearevento',
                path: '/dashboard/crearevento',
                component: () =>
                    import ('../views/EventoView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Instructor');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'estadistica',
                path: '/dashboard/estadistica',
                component: () =>
                    import ('../views/EstadisticaFichas.vue')
            },
            {
                name: 'disponibilidad',
                path: '/dashboard/disponibilidad',
                component: () =>
                    import ('../views/DisponibilidadView.vue')
            },
            {
                name: 'crearusuario',
                path: '/dashboard/crearusuario',
                component: () =>
                    import ('../views/Usuario/CrearUsuarioView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'listarusuario',
                path: '/dashboard/listarusuario',
                component: () =>
                    import ('../views/Usuario/ListarUsuarioView.vue'),
                    beforeEnter: (_, __, next) => {
                        let rol =  store.getters.usuario.roles
                        let found = rol.find((element) => element == 'Administrator');
                        if (found == undefined) return next('/dashboard/welcome')
                        next()
                      }
            },
            {
                name: 'salida',
                path: '/dashboard/salida',
                component: () =>
                    import ('../views/Usuario/ListarUsuarioView.vue'),
                    beforeEnter: (_, __, next) => {
                        store.commit('setusuario', null)
                        next('/')
                        
                      }
            },


        ],
        beforeEnter: (_, __, next) => {
            const fs =  store.getters.usuario
            if (!fs) return next('/')
            next()
          }
    },


]

const router = new VueRouter({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router