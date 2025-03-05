import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		usuario: null,
		borradorEventos: [],
	},
	mutations: {
		setusuario(state, data) {
			state.usuario = data;
		},
		setBorradorEventos(state, data) {
			state.borradorEventos = data;
		},
	},

	getters: {
		usuario(state) {
			return state.usuario;
		},
		borradorEventos(state) {
			return state.borradorEventos;
		},
	},

	actions: {},
	modules: {},
	plugins: [createPersistedState()],
});
