const API_URL = 'http://localhost:8080/contas';

function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

function request(url, options = {}) {
    return fetch(url, {
        headers: getHeaders(),
        ...options
    });
}

function handleResponse(response) {
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }
    return response.json();
}

function listarContas() {
    return request(API_URL).then(handleResponse);
}

function criarConta(conta) {
    return request(API_URL, {
        method: 'POST',
        body: JSON.stringify(conta)
    });
}

function atualizarConta(conta) {
    return request(`${API_URL}/${conta.id}`, {
        method: 'PUT',
        body: JSON.stringify(conta)
    });
}

function deletarConta(id) {
    return request(`${API_URL}/${id}`, {
        method: 'DELETE'
    });
}

export { listarContas, criarConta, atualizarConta, deletarConta };