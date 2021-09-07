<template>
    <b-row>
        <loading :active.sync="carregandoExcluir"
                 :can-cancel="false"
                 :is-full-page="true"></loading>

        <div class="py-5 mt-5 col-md-12">
            <h3>Listagem de Usuários</h3>
        </div>

        <div class="col-md-12">
            <vue-good-table
                    mode="remote"
                    @on-page-change="alterarPagina"
                    @on-sort-change="ordernar"
                    @on-column-filter="filtrar"
                    @on-per-page-change="tamanhoPagina"
                    :totalRows="listagemTabela.total"
                    :isLoading.sync="carregando"
                    :rows="listagemTabela.dados"
                    :columns="colunas"
                    :responsive="true"
                    :pagination-options="{
                        enabled: true,
                        nextLabel: '',
                        prevLabel: '',
                        rowsPerPageLabel: 'Linhas por página',
                        perPage: tamanhoPagina,
                        perPageDropdown: [5, 10, 15],
                        allLabel: 'Todas'
                    }"
            >

                <template slot="table-row" slot-scope="colunas">
                    <span v-if="colunas.column.field == 'acao'">
                      <b-button variant="primary" lg="1" @click="editar(colunas.row, colunas.index)">
                        <b-icon icon="eye"></b-icon>
                    </b-button>

                    &nbsp;

                    <b-button variant="danger" lg="1" @click="remover(colunas.row)">
                        <b-icon icon="x-square"></b-icon>
                    </b-button>
                    </span>
                </template>

                <div slot="emptystate" class="text-center">
                    Nenhum registro encontrado!
                </div>

                <div slot="loadingContent" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="sr-only"></span>
                    </div>
                </div>
            </vue-good-table>
        </div>

        <div class="col-md-12 text-center mt-5">
            <b-button variant="primary" lg="1" @click="abrirModalAdd()">
                <b-icon icon="plus"></b-icon>
                Novo Usuário
            </b-button>
        </div>

        <Add/>
    </b-row>
</template>

<script>
    import Vue from 'vue';
    import {mapState, mapActions, mapGetters} from 'vuex';
    import Add from './Add';
    import VueGoodTablePlugin from 'vue-good-table';
    import Loading from 'vue-loading-overlay';

    import 'vue-good-table/dist/vue-good-table.css';
    import 'vue-loading-overlay/dist/vue-loading.css';

    Vue.use(VueGoodTablePlugin);

    export default {
        name: 'index',
        components: {
            Add,
            Loading
        },

        mounted() {
            this.atualizarListagem();
        },

        data() {
            return {
                carregando: false,
                carregandoExcluir: false,
                colunas: [
                    {
                        label: '#',
                        field: 'id',
                    },
                    {
                        label: 'Nome',
                        field: 'name',
                    },
                    {
                        label: 'E-mail',
                        field: 'email',
                    },
                    {
                        label: 'Data de Criação',
                        field: 'created_at',
                        sortable: false
                    },
                    {
                        label: 'Data de Alteração',
                        field: 'updated_at',
                        sortable: false
                    },
                    {
                        label: 'Ações',
                        field: 'acao',
                        sortable: false
                    },
                ],
                parametrosDeBusca: {
                    ordenar: {
                        campo: '',
                        tipo: '',
                    },
                    pagina: 1,
                    porPagina: 5
                }
            };
        },

        methods: {
            ...mapActions('Usuario', ['buscarUsuarios', 'excluir']),

            editar(item, index) {
                this.abrirModalAdd({item, index});
            },
            remover(item) {
                this.$swal({
                    title: 'Deseja realmente remover o usuário?',
                    text: "Está ação não pode ser revertida!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Sim',
                    cancelButtonColor: '#d33',
                    cancelButtonText: 'Não'
                }).then((result) => {
                    if (result.value) {
                        this.carregandoExcluir = true;

                        this.excluir(item).then((dados) => {
                            this.carregandoExcluir = false;

                            if (dados.data.status !== 'erro') {
                                this.atualizarListagem();
                            }
                        }).catch(() => {
                            this.carregandoExcluir = false;
                        });

                    }
                });
            },
            abrirModalAdd: function (dados) {
                this.$emit('abrirModalAdd', dados);
            },


            atualizarParametros(newProps) {
                this.parametrosDeBusca = Object.assign({}, this.parametrosDeBusca, newProps);
            },

            alterarPagina(params) {
                this.atualizarParametros({pagina: params.currentPage});
                this.atualizarListagem();
            },

            tamanhoPagina(params) {
                this.atualizarParametros({porPagina: params.currentPerPage});
                this.atualizarListagem();
            },

            ordernar(params) {
                this.atualizarParametros({
                    ordenar: {
                        tipo: params[0].type,
                        campo: params[0].field,
                    },
                });
                this.atualizarListagem();
            },

            filtrar(params) {
                this.atualizarParametros(params);
                this.atualizarListagem();
            },

            // load items is what brings back the rows from server
            atualizarListagem() {
                this.buscarUsuarios(this.parametrosDeBusca);
            }


        },

        computed: {
            ...mapState('Usuario', ['lista']),
            ...mapGetters('Usuario', ['listagemTabela'])
        },

        created: function () {
            this.$on('atualizarListagem', this.atualizarListagem);
        }
    }
</script>
