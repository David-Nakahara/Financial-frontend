import { listarContas, criarConta, deletarConta, atualizarConta } from "../../services/contaService";
import { useEffect, useState } from "react";
import "./ContasPage.css";

function ContasPage() {
  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarContas()
    .then(data => setContas(data))
    .finally(() => setLoading(false));
  }, []);

  function handleCriar() {
    criarConta({ nome, saldo })
      .then(() => listarContas().then(data => setContas(data)));
  }

  function handleDeletar(conta) {
    deletarConta(conta.id)
      .then(() => listarContas().then(data => setContas(data)))
  }

  function handlerAtualizar() {
    atualizarConta({ id: contaSelecionada.id, nome, saldo})
    .then(() => listarContas().then(data => setContas(data)));
  }

  function handlerEditar(conta) {
      setContaSelecionada(conta);
      setNome(conta.nome);
      setSaldo(conta.saldo);
    }

  function formatarSaldo(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'

      
    });

  
  }

  if (loading) return <div className="loading">Carregando contas... ⏳</div>;

  return (
    <div className="contas-container" id="contas">
      <div className="contas-header">
        <h1>💰 Minhas Contas</h1>
        <p>Gerencie suas contas bancárias</p>
        
      </div>


      <div className="form-card">
        <h2>Nova Conta</h2>
        <div className="form-row">
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome da conta" />
          <input value={saldo} onChange={e => setSaldo(e.target.value)} placeholder="Saldo inicial (R$)" />
          <button className="btn-criar" onClick={contaSelecionada ? handlerAtualizar : handleCriar}>
            {contaSelecionada ? 'Salvar' : 'Criar conta'}
          </button>
        </div>
      </div>

      <div className="lista-contas">
        {contas.length === 0 ? (
          <div className="empty-state">
            <p>💼 Nenhuma conta cadastrada ainda.</p>
            <span>Crie sua primeira conta acima!</span>
          </div>
        ) : (
          contas.map(conta => (
            <div className="conta-card" key={conta.id}>
              <div className="conta-info">
                <h3>{conta.nome}</h3>
                <span>ID #{conta.id}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className="conta-saldo">{formatarSaldo(conta.saldo)}</span>
                <button className="btn-deletar" onClick={() => handleDeletar(conta)}>Deletar</button>
                <button className="btn-editar" onClick={() => handlerEditar(conta)}>Editar</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ContasPage;