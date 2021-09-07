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
                        :state="modalDados.setor_nome.estado"
                        label="Nome"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            id="name-input"
                            v-model="modalDados.setor_nome.valor"
                            :state="modalDados.setor_nome.estado"
                            :required="modalDados.setor_nome.obrigatorio"
                            v-on:keyup="validarCampos('setor_nome')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.setor_descricao.estado"
                        label="Descrição"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            id="name-input"
                            v-model="modalDados.setor_descricao.valor"
                            :state="modalDados.setor_descricao.estado"
                            :required="modalDados.setor_descricao.obrigatorio"
                            v-on:keyup="validarCampos('setor_descricao')"
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
                    titulo: 'Adicionar Setor',
                },
                modalDados: {
                    setor_id: {
                        valor: '',
                        obrigatorio: false
                    },
                    setor_nome: {
                        valor: '',
                        estado: null,
                        obrigatorio: true,
                    },
                    setor_descricao: {
                        valor: '',
                        estado: null,
                        obrigatorio: true
                    }
                },
                salvando: false
            }
        },
        methods: {
            ...mapActions('Setor', ['salvar']),

            setDados(dados) {
                var {item} = dados;

                this.modalDados.setor_id.valor = item.setor_id;
                this.modalDados.setor_nome.valor = item.setor_nome;
                this.modalDados.setor_descricao.valor = item.setor_descricao;

                if (this.modalDados.setor_id.valor !== '') {
                    this.modalPropriedades.titulo = 'Editar Setor';
                }
            },
            limparModal() {
                this.salvando = false;
                this.modalPropriedades.titulo = 'Adicionar Setor';

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

            }
        },
        created: function() {
            this.$parent.$on('abrirModalAdd', this.abrirModal);
        }
    }
</script>
