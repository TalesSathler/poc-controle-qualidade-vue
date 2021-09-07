<template>
    <div>
        <b-modal
                :id="modalPropriedades.id"
                :title="modalPropriedades.titulo"
                ref="modal"
                @hidden="limparModal"
                @ok="modalSubmit"
                ok-title="Salvar"
                cancel-title="Fechar"
        >
            <loading :active.sync="salvando"
                     :can-cancel="false"
                     :is-full-page="true"></loading>

            <form ref="form" @submit.stop.prevent="modalSubmit">
                <b-form-group
                        :state="modalDados.name.estado"
                        label="Nome"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            id="name-input"
                            v-model="modalDados.name.valor"
                            :state="modalDados.name.estado"
                            :required="modalDados.name.obrigatorio"
                            v-on:keyup="validarCampos('name')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.email.estado"
                        label="E-mail"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            id="name-input"
                            v-model="modalDados.email.valor"
                            :state="modalDados.email.estado"
                            :required="modalDados.email.obrigatorio"
                            v-on:keyup="validarCampos('email')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.password.estado"
                        label="Senha"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="password"
                            id="name-input"
                            v-model="modalDados.password.valor"
                            :state="modalDados.password.estado"
                            :required="modalDados.password.obrigatorio"
                            v-on:keyup="validarCampos('password')"
                    ></b-form-input>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import Loading from 'vue-loading-overlay';

    import 'vue-loading-overlay/dist/vue-loading.css';

    export default {
        name: 'add',
        components: {
            Loading
        },

        data() {
            return {
                modalPropriedades: {
                    id: '1',
                    titulo: 'Adicionar Usuário',
                },
                modalDados: {
                    id: {
                        valor: '',
                        obrigatorio: false
                    },
                    name: {
                        valor: '',
                        estado: null,
                        obrigatorio: true,
                    },
                    email: {
                        valor: '',
                        estado: null,
                        obrigatorio: true
                    },
                    password: {
                        valor: '',
                        estado: null,
                        obrigatorio: false
                    }
                },
                salvando: false
            }
        },

        methods: {
            ...mapActions('Usuario', ['salvar']),

            setDados(dados) {
                var {item} = dados;

                this.modalDados.id.valor = item.id;
                this.modalDados.name.valor = item.name;
                this.modalDados.email.valor = item.email;
                this.modalDados.password.valor = '';

                if (this.modalDados.id.valor !== '') {
                    this.modalPropriedades.titulo = 'Editar Usuário';
                    this.modalDados.password.obrigatorio = false;
                }
            },
            limparModal() {
                this.salvando = false;
                this.modalPropriedades.titulo = 'Adicionar Usuário';

                for (var [key] of Object.entries(this.modalDados)) {
                    if (!this.modalDados[key]['valor'] || this.modalDados[key]['valor'] !== '') {
                        this.modalDados[key]['valor'] = '';
                        this.modalDados[key]['estado'] = null;
                    }
                }
            },
            abrirModal(dados = {}) {
                this.limparModal();

                if (Object.keys(dados).length) {
                    this.setDados(dados);
                    this.$root.$emit('bv::show::modal', this.modalPropriedades.id);
                    this.$root.$emit('bv::show::modal', this.modalPropriedades.id);
                    return true;
                }

                if (this.modalDados.id.valor === '') {
                    this.modalDados.password.obrigatorio = true;
                }

                this.$root.$emit('bv::show::modal', this.modalPropriedades.id);
                this.$root.$emit('bv::show::modal', this.modalPropriedades.id);
            },
            fecharModal() {
                this.$root.$emit('bv::hide::modal', this.modalPropriedades.id);
                this.$root.$emit('bv::hide::modal', this.modalPropriedades.id);
            },
            validar() {
                return this.$refs.form.checkValidity();
            },
            validarCampos(campo = null) {
                for (var [key] of Object.entries(this.modalDados)) {
                    if (!this.modalDados[key]['obrigatorio'] || (campo && key !== campo)) {
                        continue;
                    }

                    this.modalDados[key]['estado'] = ((!this.modalDados[key]['valor'] || this.modalDados[key]['valor'] === '') ? false : true);
                }
            },
            modalSubmit(e) {
                this.validarCampos();
                e.preventDefault();

                if (!this.validar()) {
                    return false;
                }

                this.salvando = true;

                this.salvar(this.modalDados).then((dados) => {
                    this.salvando = false;

                    if (dados.data.status !== 'erro') {
                        this.$nextTick(() => {
                            this.fecharModal();
                            this.$parent.$emit('atualizarListagem');
                        });
                    }
                }).catch(() => {
                    this.salvando = false;
                });

            },
        },

        created: function () {
            this.$parent.$on('abrirModalAdd', this.abrirModal);
        }
    }
</script>
