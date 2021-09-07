import Vue from 'vue';
import Router from 'vue-router';
import Usuario from '../features/Usuario/Index';
import Setor from '../features/Processos/Setor/Index';
import Processo from '../features/Processos/Processo/Index';
import Login from '../features/Autenticacao/Login';
import Logout from '../features/Autenticacao/Logout';
import Registrar from '../features/Autenticacao/Registrar';
import axios from "axios";

Vue.use(Router);

const naoAutenticado = (to, from, next) => {
    if (!axios.defaults.headers.common['Authorization']) {
        next();
        return;
    }
    else if (to.name === 'Login'&& next.name === '') {
        next('/setor');
        return;
    }
    next(false);
};

const autenticado = (to, from, next) => {
    if (axios.defaults.headers.common['Authorization']) {
        next();
        return;
    }

    next('/login');
};

const rotaNaoEncontrada = (to, from, next) => {
    next('/');
};


export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/usuario',
            name: 'Usuario',
            component: Usuario,
            beforeEnter: autenticado
        },
        {
            path: '/',
            alias: '/setor',
            name: 'Setor',
            component: Setor,
            beforeEnter: autenticado
        },
        {
            path: '/processo',
            name: 'Processo',
            component: Processo,
            beforeEnter: autenticado
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            beforeEnter: naoAutenticado
        },
        {
            path: '/logout',
            name: 'Logout',
            component: Logout,
            beforeEnter: autenticado
        },
        {
            path: '/registrar',
            name: 'Registrar',
            component: Registrar,
            beforeEnter: naoAutenticado
        },
        {
            path: "*",
            beforeEnter: rotaNaoEncontrada
        }
    ]
});
