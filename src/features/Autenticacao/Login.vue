<template>
    <form class="form-signin" @submit.prevent="login">
        <loading :active.sync="salvando"
                 :can-cancel="false"
                 :is-full-page="true"></loading>

        <h1 class="h3 mb-5 font-weight-normal text-center">Acessar o Sistema</h1>

        <label class="sr-only">E-mail</label>
        <input type="email" class="form-control" name="email" placeholder="E-mail" v-model="email" required>

        <label class="sr-only">Senha</label>
        <input type="password" class="form-control" name="password" placeholder="Senha" v-model="password" required>

        <button class="btn btn-xs btn-primary btn-block" type="submit">Entrar</button>

<!--        <b-link type="button" class="btn btn-xs btn-info btn-block" href="/registrar">Cadastrar</b-link>-->
    </form>
</template>

<script>
    import {mapActions} from 'vuex';
    import router from '../../router';
    import Loading from 'vue-loading-overlay';

    import '../../../public/css/signin.css';
    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        data(){
            return {
                email: '',
                password: '',
                salvando: false
            }
        },
        components: {
            Loading
        },

        methods: {
            ...mapActions('Autenticacao', ['getLogin']),
            login: function () {
                this.salvando = true;
                const {email, password} = this;

                this.getLogin({email, password}).then((status) => {
                    this.salvando = false;

                    if (status) {
                        router.go('/setor');
                    }
                }).catch(() => {
                    this.salvando = false;
                });
            }
        },

        mounted() {
            if (localStorage.getItem('mensagemLogin')) {
                var mensagemLoginTipo = localStorage.getItem('mensagemLoginTipo') || 'info';

                this.$swal(localStorage.getItem('mensagemLogin'), '', mensagemLoginTipo);
                localStorage.setItem('mensagemLogin', '');
            }
        }
    }
</script>
