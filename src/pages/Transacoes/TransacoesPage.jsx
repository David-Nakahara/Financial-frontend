import { useState, useEffect } from "react";
import { listarContas } from "../../services/contaService";
import { listarTransacoes, depositar, sacar, editarTransacao, deletarTransacao } from "../../services/transacaoService";
import "./TransacoesPage.css";

const CATEGORIAS_RECEITA = ["Vendas", "Serviços", "Investimentos", "Outros"];
const CATEGORIAS_DESPESA = ["Salário", "Aluguel", "Fornecedores", "Marketing", "Utilidades", "Impostos", "Outros"];
const TODAS_CATEGORIAS = [...CATEGORIAS_RECEITA, ...CATEGORIAS_DESPESA];

function TransacoesPage() {
  const [contas, setContas] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [transacoes, setTransacoes] = useState([]);

  // Estado do modal de edição
  const [modalAberto, setModalAberto] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [editValor, setEditValor] = useState('');
  const [editDescricao, setEditDescricao] = useState('');
  const [editCategoria, setEditCategoria] = useState('');

  useEffect(() => {
    listarContas().then(data => setContas(data));
  }, []);

  function recarregarTransacoes() {
    if (contaSelecionada) {
      listarTransacoes(contaSelecionada).then(data => setTransacoes(data));
    }
  }

  function handleSelecionarConta(contaId) {
    setContaSelecionada(contaId);
    if (contaId) {
      listarTransacoes(contaId).then(data => setTransacoes(data));
    }
  }

  function handleDepositar() {
    depositar(contaSelecionada, valor, descricao, categoria)
      .then(recarregarTransacoes);
  }

  function handleSacar() {
    sacar(contaSelecionada, valor, descricao, categoria)
      .then(recarregarTransacoes);
  }

  function abrirModal(transacao) {
    setTransacaoEditando(transacao);
    setEditValor(transacao.valor);
    setEditDescricao(transacao.descricao || '');
    setEditCategoria(transacao.categoria || '');
    setModalAberto(true);
  }

  function fecharModal() {
    setModalAberto(false);
    setTransacaoEditando(null);
  }

  function handleEditar() {
    editarTransacao(transacaoEditando.id, parseFloat(editValor), editDescricao, editCategoria)
      .then(() => {
        recarregarTransacoes();
        fecharModal();
      });
  }

  function handleDeletar(id) {
    if (window.confirm('Tem certeza que deseja deletar esta transação? O saldo será revertido.')) {
      deletarTransacao(id).then(recarregarTransacoes);
    }
  }

  function formatarSaldo(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="transacoes-container" id="transacoes">
      <div className="transacoes-header">
        <h1>💸 Transações</h1>
        <p>Deposite ou saque de suas contas</p>
      </div>

      <div className="form-card">
        <h2>Nova Transação</h2>
        <div className="form-row">
          <select value={contaSelecionada} onChange={e => handleSelecionarConta(e.target.value)}>
            <option value="">Selecione uma conta</option>
            {contas.map(conta => (
              <option key={conta.id} value={conta.id}>
                {conta.nome} — {formatarSaldo(conta.saldo)}
              </option>
            ))}
          </select>
          <input value={valor} onChange={e => setValor(e.target.value)} placeholder="Valor (R$)" />
          <input value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição (ex: Pagamento fornecedor)" />
          <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            <option value="">Categoria</option>
            {TODAS_CATEGORIAS.map((cat, index) => (
                <option key={`${cat}-${index}`} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button className="btn-depositar" onClick={handleDepositar}>+ Depositar</button>
          <button className="btn-sacar" onClick={handleSacar}>- Sacar</button>
        </div>
      </div>

      <div className="lista-transacoes">
        {transacoes.length === 0 ? (
          <div className="empty-state">
            <p>📋 Nenhuma transação ainda.</p>
            <span>Selecione uma conta e faça uma transação!</span>
          </div>
        ) : (
          transacoes.map(t => (
            <div className={`transacao-card ${t.tipo === 'SAQUE' ? 'saque' : 'deposito'}`} key={t.id}>
              <div className="transacao-info">
                <h3>{t.tipo} {t.categoria ? `· ${t.categoria}` : ''}</h3>
                {t.descricao && <p className="transacao-descricao">{t.descricao}</p>}
                <span>{new Date(t.data).toLocaleString('pt-BR')}</span>
              </div>
              <div className="transacao-direita">
                <span className="transacao-valor">{formatarSaldo(t.valor)}</span>
                <div className="transacao-acoes">
                  <button className="btn-editar-transacao" onClick={() => abrirModal(t)}>Editar</button>
                  <button className="btn-deletar-transacao" onClick={() => handleDeletar(t.id)}>Deletar</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Edição */}
      {modalAberto && (
        <div className="modal-overlay" onClick={fecharModal}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>Editar Transação</h2>
            <p className="modal-tipo">{transacaoEditando?.tipo} · {new Date(transacaoEditando?.data).toLocaleString('pt-BR')}</p>

            <div className="modal-form">
              <label>Valor (R$)</label>
              <input
                type="number"
                value={editValor}
                onChange={e => setEditValor(e.target.value)}
                placeholder="Valor"
              />

              <label>Descrição</label>
              <input
                value={editDescricao}
                onChange={e => setEditDescricao(e.target.value)}
                placeholder="Descrição"
              />

              <label>Categoria</label>
              <select value={editCategoria} onChange={e => setEditCategoria(e.target.value)}>
                <option value="">Sem categoria</option>
                {TODAS_CATEGORIAS.map((cat, index) => (
              <option key={`${cat}-${index}`} value={cat}>{cat}</option>
            ))}
              </select>
            </div>

            <div className="modal-acoes">
              <button className="btn-cancelar" onClick={fecharModal}>Cancelar</button>
              <button className="btn-salvar" onClick={handleEditar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransacoesPage;