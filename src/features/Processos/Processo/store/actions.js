import Vue from "vue";
import axios from 'axios';
import helpers from "../../../../plugins/helpers";

let config = {
    accept: 'application/json'
};

const buscarProcessos = async ({commit}, dados) => {
    var parametros = '?pagina='+ dados.pagina +'&porPagina='+ dados.porPagina;
    parametros += '&ordenarCampo='+ dados.ordenar.campo +'&ordenarTipo='+ dados.ordenar.tipo;

    config = {config, ...{headers: {Authorization: `Bearer ` + axios.defaults.headers.common['Authorization'] + '`'}}};

    const request = (await axios.get(process.env.VUE_APP_URL +'/api/processo'+ parametros, config)).data;
    if (request !== undefined) {
        const lista = request.dados;
        commit('SET_LISTA', {lista});
        return true;
    }
};

// eslint-disable-next-line no-unused-vars
const salvar = async ({commit}, dados) => {
    const dadosPost = {
        processo_nome: dados.processo_nome.valor,
        processo_descricao: dados.processo_descricao.valor,
        processo_horario: dados.processo_horario.valor,
        setor_id: dados.setor_id.valor.setor_id
    };


    if (dados.processo_id !== undefined && dados.processo_id.valor !== '') {
        return new Promise((resolve, reject) => {
            config = {config, ...{headers: {Authorization: `Bearer ` + axios.defaults.headers.common['Authorization'] + '`'}}};
            axios.put(process.env.VUE_APP_URL +'/api/processo/'+ dados.processo_id.valor, dadosPost, config)
                .then(resp => {
                    var resposta = helpers.formatarMensagem(resp);

                    if (resp.data.status === 'erro') {
                        var mensagemResposta = helpers.formatarMensagemErro(resp);
                        Vue.swal(resposta, mensagemResposta, 'error');
                    }
                    else if (resposta) {
                        Vue.swal(resposta, '', 'success');
                    }

                    resolve(resp);
                })
                .catch(err => {
                    var resposta = '';
                    var mensagemResposta = '';

                    if (err.data !== undefined) {
                        resposta = helpers.formatarMensagem(err);

                        if (err.data.status === 'erro') {
                            mensagemResposta = helpers.formatarMensagemErro(err);
                        }
                    }
                    else {
                        resposta = 'Não foi possível salvar o registro, por favor tente novamente!';
                    }

                    Vue.swal(resposta, mensagemResposta, 'error');

                    reject(err)
                });
        });
    }

    return new Promise((resolve, reject) => {
        config = {config, ...{headers: {Authorization: `Bearer ` + axios.defaults.headers.common['Authorization'] + '`'}}};
        axios.post(process.env.VUE_APP_URL +'/api/processo', dadosPost, config)
            .then(resp => {
                var resposta = helpers.formatarMensagem(resp);

                if (resp.data.status === 'erro') {
                    var mensagemResposta = helpers.formatarMensagemErro(resp);
                    Vue.swal(resposta, mensagemResposta, 'error');
                }
                else if (resposta) {
                    Vue.swal(resposta, '', 'success');
                }

                resolve(resp);
            })
            .catch(err => {
                var resposta = '';
                var mensagemResposta = '';

                if (err.data !== undefined) {
                    resposta = helpers.formatarMensagem(err);

                    if (err.data.status === 'erro') {
                        mensagemResposta = helpers.formatarMensagemErro(err);
                    }
                }
                else {
                    resposta = 'Não foi possível salvar o registro, por favor tente novamente!';
                }

                Vue.swal(resposta, mensagemResposta, 'error');

                reject(err)
            });
    });
};

// eslint-disable-next-line no-unused-vars
const excluir = async ({commit}, dados) => {
    return new Promise((resolve, reject) => {
        config = {config, ...{headers: {Authorization: `Bearer ` + axios.defaults.headers.common['Authorization'] + '`'}}};
        axios.delete(process.env.VUE_APP_URL +'/api/processo/'+ dados.processo_id, config)
            .then(resp => {
                var resposta = helpers.formatarMensagem(resp);

                if (resp.data.status === 'erro') {
                    var mensagemResposta = helpers.formatarMensagemErro(resp);
                    Vue.swal(resposta, mensagemResposta, 'error');
                }
                else if (resposta) {
                    Vue.swal(resposta, '', 'success');
                }
                resolve(resp);
            })
            .catch(err => {
                var resposta = '';
                var mensagemResposta = '';

                if (err.data !== undefined) {
                    resposta = helpers.formatarMensagem(err);

                    if (err.data.status === 'erro') {
                        mensagemResposta = helpers.formatarMensagemErro(err);
                    }
                }
                else {
                    resposta = 'Não foi possível excluir o registro, por favor tente novamente!';
                }

                Vue.swal(resposta, mensagemResposta, 'error');

                reject(err)
            });
    });
};

export default {
    buscarProcessos,
    salvar,
    excluir
}
