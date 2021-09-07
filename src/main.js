import Vue from 'vue';
import axios from 'axios';
import App from "./components/App";
import Login from "./features/Autenticacao/Login";
import Registrar from "./features/Autenticacao/Registrar";
import router from './router';
import store from './store';
import {BootstrapVue, IconsPlugin} from "bootstrap-vue";
import VueSweetalert2 from 'vue-sweetalert2';
import VueCookies from 'vue-cookies';
import helpers from "./plugins/helpers";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';


Vue.use(BootstrapVue);

Vue.use(IconsPlugin);

Vue.use(VueSweetalert2);

Vue.use(VueCookies);
Vue.$cookies.config('1d');

Vue.config.productionTip = false;

helpers.verificarAcesso();

let render = Login;


//Refazer login
axios.defaults.headers.common['Authorization'] = Vue.$cookies.get('token');


new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App, Login, Registrar},
    render: h => h(render),
    methods: {
        renderizar() {
            if (router.currentRoute && router.currentRoute.name) {
                render = router.currentRoute.name;
            }

            if (axios.defaults.headers.common['Authorization']) {
                render = App;
            }

            return render;
        }
    },
    beforeMount() {
        this.renderizar();
    }
});
