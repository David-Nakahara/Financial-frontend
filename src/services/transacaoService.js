const API_URL = 'https://financial-manager-7g2s.onrender.com/transacoes';

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function listarTransacoes(contaId) {
    return fetch(`${API_URL}/conta/${contaId}`, {
        headers: getHeaders()
    }).then(response => response.json());
}

function operacaoConta(tipo, contaId, valor, descricao, categoria) {
    return fetch(`${API_URL}/${tipo}/${contaId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ valor, descricao, categoria })
    });
}

function depositar(contaId, valor, descricao, categoria) {
    return operacaoConta('depositar', contaId, valor, descricao, categoria);
}

function sacar(contaId, valor, descricao, categoria) {
    return operacaoConta('sacar', contaId, valor, descricao, categoria);
}

function editarTransacao(id, valor, descricao, categoria) {
    return fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ valor: parseFloat(valor), descricao, categoria })
    }).then(res => {
        if (!res.ok) throw new Error('Erro ao editar');
        return res.json();
    });
}

function deletarTransacao(id) {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    }).then(res => {
        if (!res.ok) throw new Error('Erro ao deletar');
        return res;
    });
}

export { listarTransacoes, depositar, sacar, editarTransacao, deletarTransacao };