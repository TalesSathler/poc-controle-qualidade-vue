import axios from "axios";
import actions from "../features/Autenticacao/store/actions";
import router from "../router";
import Vue from "vue";

const exibirMensagemLogin = (mensagem, tipo = 'info') => {
    localStorage.setItem('mensagemLogin', mensagem);
    localStorage.setItem('mensagemLoginTipo', tipo);
}

const exibirMensagemRegistro = (mensagem) => {
    localStorage.setItem('mensagemRegistro', mensagem);
}

const verificarAcesso = () => {
    axios.interceptors.response.use(response => {
        return response;
    }, error => {
        if (error.response.status === 401) {
            const token = Vue.$cookies.get('token');
            const expiresIn = Vue.$cookies.get('expiresIn');

            if (expiresIn && token) {
                var dataAtual = new Date();
                var data = new Date(expiresIn * 1000);

                if (data < dataAtual) {
                    actions.limparDadosSessao();

                    exibirMensagemLogin('Sessão expirada, por favor efetue novamente o login no sistema!');
                    router.go('/logout');
                }
            }
        }
        return error;
    });
}

/**
 *
 * @param dataString
 * @returns {string}
 */
const formatarDataBrasileiro = (dataString) => {
    if (dataString) {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dataString).toLocaleDateString('pt-BR', options)
    }

    return '';
};

/**
 *
 * @param resp
 * @returns {string}
 */
const formatarMensagem = (resp) => {
    return (resp.data.mensagem !== undefined ? resp.data.mensagem : '');
};

/**
 *
 * @param resp
 * @returns {string}
 */
const formatarMensagemErro = (resp) => {
    var mensagemResposta = '';

    if (resp.data.dados !== undefined) {
        // eslint-disable-next-line no-unused-vars
        for (var [key, value] of Object.entries(resp.data.dados)) {
            mensagemResposta = mensagemResposta + '\n ' + value.reduce((a, b) => {
                return a + '\n ' + b;
            });

        }
    }

    return mensagemResposta;
};

export default {
    verificarAcesso,
    formatarDataBrasileiro,
    formatarMensagem,
    formatarMensagemErro,
    exibirMensagemLogin,
    exibirMensagemRegistro
}
