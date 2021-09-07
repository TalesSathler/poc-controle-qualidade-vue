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
                        :state="modalDados.processo_nome.estado"
                        label="Nome"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            v-model="modalDados.processo_nome.valor"
                            :state="modalDados.processo_nome.estado"
                            :required="modalDados.processo_nome.obrigatorio"
                            v-on:keyup="validarCampos('processo_nome')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.processo_descricao.estado"
                        label="Descrição"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            v-model="modalDados.processo_descricao.valor"
                            :state="modalDados.processo_descricao.estado"
                            :required="modalDados.processo_descricao.obrigatorio"
                            v-on:keyup="validarCampos('processo_descricao')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.processo_horario.estado"
                        label="Horário"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <b-form-input
                            type="text"
                            v-model="modalDados.processo_horario.valor"
                            :state="modalDados.processo_horario.estado"
                            :required="modalDados.processo_horario.obrigatorio"
                            v-on:keyup="validarCampos('processo_horario')"
                    ></b-form-input>
                </b-form-group>

                <b-form-group
                        :state="modalDados.setor_id.estado"
                        label="Setor"
                        label-for="name-input"
                        invalid-feedback="Este campo é obrigatório"
                >
                    <v-select
                            @search="buscarOpcoes"
                            :options="opcoesSetor"
                            :filterable="false"

                            v-model="modalDados.setor_id.valor"
                            :state="modalDados.setor_id.estado"
                            :required="modalDados.setor_id.obrigatorio"
                            v-on:keyup="validarCampos('setor_id')"
                    >
                        <template slot="no-options">
                            Digite 1 caractere para buscar
                        </template>

                        <template slot="option" slot-scope="option">
                            <div class="d-center">
                                {{ option.setor_nome }}
                            </div>
                        </template>

                        <template slot="selected-option" slot-scope="option">
                            <div class="selected d-center">
                                {{ option.setor_nome }}
                            </div>
                        </template>
                    </v-select>
                </b-form-group>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import {mapActions} from 'vuex';
    import Vue from 'vue'
    import vSelect from 'vue-select'
    import Loading from 'vue-loading-overlay';

    import 'vue-select/dist/vue-select.css';
    import 'vue-loading-overlay/dist/vue-loading.css';

    Vue.component('v-select', vSelect)

    export default {
        name: 'add',
        components: {
            Loading
        },

        data() {
            return {
                modalPropriedades: {
                    id: '1',
                    titulo: 'Adicionar Processo',
                },
                modalDados: {
                    processo_id: {
                        valor: '',
                        obrigatorio: false
                    },
                    processo_nome: {
                        valor: '',
                        estado: null,
                        obrigatorio: true,
                    },
                    processo_descricao: {
                        valor: '',
                        estado: null,
                        obrigatorio: true
                    },
                    processo_horario: {
                        valor: '',
                        estado: null,
                        obrigatorio: true
                    },
                    setor_id: {
                        valor: '',
                        estado: null,
                        obrigatorio: true
                    }
                },
                opcoesSetor: [],
                salvando: false
            }
        },

        methods: {
            ...mapActions('Processo', ['salvar']),
            ...mapActions('Setor', ['buscarFiltro']),

            setDados(dados) {
                var {item} = dados;

                this.modalDados.processo_id.valor = item.processo_id;
                this.modalDados.processo_nome.valor = item.processo_nome;
                this.modalDados.processo_descricao.valor = item.processo_descricao;
                this.modalDados.processo_horario.valor = item.processo_horario;
                this.modalDados.setor_id.valor = {'setor_id': item.setor_id, 'setor_nome': item.setor_nome}

                if (this.modalDados.processo_id.valor !== '') {
                    this.modalPropriedades.titulo = 'Editar Processo';
                }
            },
            limparModal() {
                this.salvando = false;
                this.modalPropriedades.titulo = 'Adicionar Processo';

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
            buscarOpcoes(search, loading) {
                this.opcoesSetor = [];

                if (search !== '') {
                    loading(true);

                    this.buscarFiltro({buscar: search}).then((dados) => {
                        loading(false);
                        this.opcoesSetor = dados;
                    });
                }
            }
        },

        created: function () {
            this.$parent.$on('abrirModalAdd', this.abrirModal);
        }
    }
</script>
