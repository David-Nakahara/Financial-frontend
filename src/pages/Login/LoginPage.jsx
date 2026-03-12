import { useState } from "react";
import { login, register } from "../../services/authService";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  function validarNome(nome) {
    return /^[a-zA-ZÀ-ÿ\s]{3,}$/.test(nome);
  }
  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validarSenha(senha) {
    return senha.length >= 6;
  }

  async function handleSubmit() {
    setErro('');
    if (isRegister && !validarNome(nome)) {
      setErro('Nome deve ter pelo menos 3 letras e sem números!');
      return;
    }
    if (!validarEmail(email)) {
      setErro('Email inválido!');
      return;
    }
    if (!validarSenha(senha)) {
      setErro('Senha deve ter pelo menos 6 caracteres!');
      return;
    }
    try {
      let token;
      if (isRegister) {
        token = await register(nome, email, senha);
      } else {
        token = await login(email, senha);
      }
      localStorage.setItem('token', token);
      onLogin();
    } catch (error) {
      setErro('Email ou senha incorretos!');
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">

        {/* Logo MoneyMind */}
        <div className="login-logo">
          <span className="logo-money">Money</span>
          <span className="logo-mind">Mind</span>
          <span className="logo-bulb">💡</span>
        </div>

        <h2>{isRegister ? 'Criar conta' : 'Entrar'}</h2>
        <p className="login-subtitle">
          {isRegister ? 'Crie sua conta gratuita' : 'Acesse sua conta'}
        </p>

        {isRegister && (
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Seu nome"
            className="login-input"
          />
        )}

        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="login-input"
        />

        {/* Campo senha com botão ver/ocultar */}
        <div className="senha-wrapper">
          <input
            type={mostrarSenha ? 'text' : 'password'}
            value={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Senha"
            className="login-input senha-input"
          />
          <button
            type="button"
            className="btn-toggle-senha"
            onClick={() => setMostrarSenha(!mostrarSenha)}
            tabIndex={-1}
          >
            {mostrarSenha ? '🙈' : '🙊'}
          </button>
        </div>

        {erro && <p className="login-erro">{erro}</p>}

       

        <button className="login-btn" onClick={handleSubmit}>
          {isRegister ? 'Cadastrar' : 'Entrar'}
        </button>

        <p className="login-toggle">
          {isRegister ? 'Já tem conta?' : 'Não tem conta?'}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Entrar' : ' Cadastrar'}
          </span>
          
        </p>
         {/* Aviso servidor */}
<div className="login-aviso-servidor">
  ⚠️ O servidor pode levar até 50 segundos para responder na primeira requisição, pois entra em modo de hibernação quando inativo. Aguarde um momento caso haja demora.
</div>
      </div>
    </div>
  );
}

export default LoginPage;