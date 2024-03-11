import '@fortawesome/fontawesome-free/css/all.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'fa' || 'md',
    },
    theme: {
        themes: {
            light: {
                colorBtnCrear: '#34BC34',
                colorBtnLimpiar: '#C5EC9F',
                colorBtnEditar: '#FB9514',
                colorBtnEliminar: '#FF6060'
            }
        }
    }
});