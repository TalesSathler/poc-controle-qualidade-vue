import axios from 'axios';
import Vue from "vue";

let config = {
    accept: 'application/json'
};


// eslint-disable-next-line no-unused-vars
const getLogin = ({commit}, user) => {
    return new Promise((resolve, reject) => {
        axios.post(process.env.VUE_APP_URL +'/api/login', user, config)
            .then(resp => {
                if (resp.response && resp.response.status === 401) {
                    Vue.swal(resp.response.data.error, '', 'error');

                    resolve(false);
                    return false;
                }

                axios.defaults.headers.common['Authorization'] = resp.data.token;

                Vue.$cookies.set('token', resp.data.token, {httpOnly: true});
                Vue.$cookies.set('expiresIn', resp.data.expires_in, {httpOnly: true});

                resolve(true);
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err => {
                Vue.swal('Ocorreu um erro ao efetuar o login, por favor tente novamente!', '', 'error');
                limparDadosSessao();
                reject(false);
            });
    })
};


// eslint-disable-next-line no-unused-vars
const getLogout = ({commit}) => {
    return new Promise((resolve, reject) => {
        config = {config, ...{headers: {Authorization: `Bearer ` + axios.defaults.headers.common['Authorization'] + '`'}}};
        axios.post(process.env.VUE_APP_URL +'/api/logout', {}, config)
            .then(resp => {
                limparDadosSessao();
                resolve(resp);
            })
            .catch(err => {
                limparDadosSessao();
                reject(err)
            });
    });
};


const limparDadosSessao = () => {
    axios.defaults.headers.common['Authorization'] = '';
    Vue.$cookies.set('token', '');
    Vue.$cookies.set('expiresIn', '');
};


export default {
    getLogin,
    getLogout,
    limparDadosSessao
}
