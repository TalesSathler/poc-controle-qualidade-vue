import Vue from 'vue';
import Vuex from 'vuex';
import Autenticacao from '@/features/Autenticacao/store';
import Usuario from '@/features/Usuario/store';
import Setor from '@/features/Processos/Setor/store';
import Processo from '@/features/Processos/Processo/store';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Autenticacao,
        Usuario,
        Setor,
        Processo
    }
});
