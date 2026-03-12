const API_URL = 'https://financial-manager-7g2s.onrender.com/auth';

async function register(nome, email, senha) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
    });
    if (!response.ok) throw new Error('Erro ao cadastrar');
    return response.text();
}

async function login(email, senha) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    });
    if (!response.ok) throw new Error('Email ou senha incorretos');
    return response.text();
}

export { register, login };