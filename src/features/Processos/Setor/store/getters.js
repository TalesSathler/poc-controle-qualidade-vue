import helpers from '../../../../plugins/helpers';

const listagemTabela = (state) => {
    var array = {
        'dados': [],
        'total': 0
    };

    if (!state.lista || Object.keys(state.lista).length <= 0) {
        return array;
    }

    array['dados'] = state.lista.itens.map(function (value) {
        return {
            isActive: true,
            setor_id: value.setor_id,
            setor_nome: value.setor_nome,
            setor_descricao: value.setor_descricao,
            created_at: helpers.formatarDataBrasileiro(value.created_at),
            updated_at: helpers.formatarDataBrasileiro(value.updated_at),
            sortable: true,
            sortByFormatted: true,
            filterByFormatted: true
        }
    });

    array['total'] = state.lista.total;
    return array;
};

export default {
    listagemTabela
}
