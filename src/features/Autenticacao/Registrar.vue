<template>
    <form class="form-signin" @submit.prevent="cadastrar">
        <loading :active.sync="salvando"
                 :can-cancel="false"
                 :is-full-page="true"></loading>

        <h1 class="h3 mb-3 font-weight-normal text-center">Cadastrar no Sistema</h1>

        <label class="sr-only">Nome</label>
        <input type="text" class="form-control" name="name" placeholder="Nome" v-model="dados.name.valor" required>

        <label class="sr-only">E-mail</label>
        <input type="email" class="form-control" name="email" placeholder="E-mail" v-model="dados.email.valor" required>

        <label class="sr-only">Senha</label>
        <input type="password" class="form-control" name="password" placeholder="Senha" v-model="dados.password.valor" required>

        <button class="btn btn-xs btn-primary btn-block" type="submit">Salvar</button>
        <b-link type="button" class="btn btn-xs btn-info btn-block" href="/login">Acessar o Sistema</b-link>
    </form>
</template>

<script>
    import {mapActions} from 'vuex';
    import Loading from 'vue-loading-overlay';

    import '../../../public/css/signin.css';
    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        data(){
            return {
                dados: {
                    name: {
                        valor: ''
                    },
                    email: {
                        valor: ''
                    },
                    password: {
                        valor: '',
                        obrigatorio: true
                    },
                    naoExibirMensagemSucesso: true
                },
                salvando: false
            }
        },
        components: {
            Loading
        },

        methods: {
            ...mapActions('Usuario', ['salvar']),
            cadastrar: function () {
                this.salvando = true;

                this.salvar(this.dados).then((dados) => {
                    this.salvando = false;

                    if (dados.data.status !== 'erro') {
                        this.$swal('Cadastro realizado com sucesso!', 'Acesse o sistema com seus dados.', 'success');
                        this.limparCampos();
                    }
                }).catch(() => {
                    this.salvando = false;
                });
            },
            limparCampos() {
                this.dados.name.valor = '';
                this.dados.email.valor = '';
                this.dados.password.valor = '';
            }
        }
    }
</script>
