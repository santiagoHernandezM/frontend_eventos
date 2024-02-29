import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        usuario : null,
          },
    mutations: {
        setusuario (state, data) {
            state.usuario = data
          },

        
    },

     getters: {
        usuario (state) {
            return state.usuario
          },

         
    },
    
    actions: {

    },
    modules: {},
    plugins: [createPersistedState()]
 
})