import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { listarContas } from "../../services/contaService";
import { listarTransacoes } from "../../services/transacaoService";
import "./DashboardPage.css";

const CORES = ["#1a56db", "#16a34a", "#dc2626", "#d97706", "#7c3aed"];
const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function DashboardPage() {
  const [contas, setContas] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [contaSelecionada, setContaSelecionada] = useState('todas');
  const [periodo, setPeriodo] = useState('todos');

  useEffect(() => {
    async function carregarDados() {
      const contasData = await listarContas();
      setContas(contasData);

      let todasTransacoes = [];
      for (const conta of contasData) {
        const t = await listarTransacoes(conta.id);
        todasTransacoes = [...todasTransacoes, ...t];
      }
      setTransacoes(todasTransacoes);
    }
    carregarDados();
  }, []);

  // adiciona essa função junto com as outras funções de cálculo
function gerarResumoPorCategoria(lista) {
  const resumo = {};

  lista.forEach(t => {
    if (!t.categoria) return;
    if (!resumo[t.categoria]) {
      resumo[t.categoria] = { depositos: 0, saques: 0 };
    }
    if (t.tipo === "DEPÓSITO") {
      resumo[t.categoria].depositos += t.valor;
    } else {
      resumo[t.categoria].saques += t.valor;
    }
  });



  // transforma em array e ordena por maior gasto
  return Object.entries(resumo)
    .map(([categoria, valores]) => ({
      categoria,
      depositos: valores.depositos,
      saques: valores.saques
    }))
    .sort((a, b) => b.saques - a.saques);
}

  function filtrarPorPeriodo(lista) {
    if (periodo === 'todos') return lista;
    const agora = new Date();
    return lista.filter(t => {
      const dataTransacao = new Date(t.data);
      if (periodo === 'semana') {
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(agora.getDate() - 7);
        return dataTransacao >= seteDiasAtras;
      }
      if (periodo === 'mes') {
        return dataTransacao.getMonth() === agora.getMonth() &&
               dataTransacao.getFullYear() === agora.getFullYear();
      }
      if (periodo === 'ano') {
        return dataTransacao.getFullYear() === agora.getFullYear();
      }
      return true;
    });
  }

  // agrupa transações por mês para o relatório mensal
  function gerarDadosMensais(lista) {
    const anoAtual = new Date().getFullYear();

    const mesesVazios = MESES.map(mes => ({
      mes,
      depositos: 0,
      saques: 0,
      lucro: 0
    }));

    lista
      .filter(t => new Date(t.data).getFullYear() === anoAtual)
      .forEach(t => {
        const mes = new Date(t.data).getMonth();
        if (t.tipo === "DEPÓSITO") {
          mesesVazios[mes].depositos += t.valor;
        } else if (t.tipo === "SAQUE") {
          mesesVazios[mes].saques += t.valor;
        }
        mesesVazios[mes].lucro = mesesVazios[mes].depositos - mesesVazios[mes].saques;
      });

    return mesesVazios;
  }

  const filtradaPorConta = contaSelecionada === 'todas'
    ? transacoes
    : transacoes.filter(t => t.conta.id === Number(contaSelecionada));

  const transacoesFiltradas = filtrarPorPeriodo(filtradaPorConta);

  const saldoTotal = contas.reduce((acc, c) => acc + c.saldo, 0);
  const totalDepositos = transacoesFiltradas.filter(t => t.tipo === "DEPÓSITO").reduce((acc, t) => acc + t.valor, 0);
  const totalSaques = transacoesFiltradas.filter(t => t.tipo === "SAQUE").reduce((acc, t) => acc + t.valor, 0);
  const lucro = totalDepositos - totalSaques;

  const dadosPizza = contas.map(c => ({ name: c.nome, value: c.saldo }));
  const dadosBarras = [
    { name: "Depósitos", valor: totalDepositos },
    { name: "Saques", valor: totalSaques }
  ];
  const dadosMensais = gerarDadosMensais(filtradaPorConta);

  function formatarSaldo(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function TooltipCategoria({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const categoria = payload[0]?.payload?.categoria;
  if (!categoria) return null;

  // pega todas as transações daquela categoria
  const transacoesDaCategoria = transacoesFiltradas.filter(t => t.categoria === categoria);

  return (
    <div style={{
      background: '#1e293b',
      border: '1px solid #334155',
      borderRadius: '8px',
      padding: '10px 14px',
      fontSize: '13px',
      color: '#f1f5f9',
      maxWidth: '250px'
    }}>
      <p style={{ fontWeight: 'bold', marginBottom: '6px' }}>🏷️ {categoria}</p>
      {transacoesDaCategoria.map((t, i) => (
        <p key={i} style={{ color: t.tipo === 'SAQUE' ? '#dc2626' : '#16a34a', margin: '2px 0' }}>
          • {t.descricao || t.tipo}: {formatarSaldo(t.valor)}
        </p>
      ))}
    </div>
  );
}




  return (
    <div className="dashboard-container" id="#dash">
      <h2 className="dashboard-titulo">📊 Dashboard</h2>
      <p className="dashboard-subtitulo">Resumo das suas finanças</p>

      <div className="dashboard-filtro">
        <select className="filtro-select" value={contaSelecionada} onChange={e => setContaSelecionada(e.target.value)}>
          <option value="todas">Todas as contas</option>
          {contas.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <select className="filtro-select" value={periodo} onChange={e => setPeriodo(e.target.value)}>
          <option value="todos">Todo o período</option>
          <option value="semana">Últimos 7 dias</option>
          <option value="mes">Este mês</option>
          <option value="ano">Este ano</option>
        </select>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <p className="card-label">Saldo Total</p>
          <p className="card-valor verde">{formatarSaldo(saldoTotal)}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Contas</p>
          <p className="card-valor">{contas.length}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Depositado</p>
          <p className="card-valor verde">{formatarSaldo(totalDepositos)}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Total Sacado</p>
          <p className="card-valor vermelho">{formatarSaldo(totalSaques)}</p>
        </div>
        <div className="dashboard-card">
          <p className="card-label">Lucro</p>
          <p className={`card-valor ${lucro >= 0 ? 'verde' : 'vermelho'}`}>{formatarSaldo(lucro)}</p>
        </div>

        
      </div>

      <div className="dashboard-graficos">
        <div className="grafico-card">
          <h3>Saldo por Conta</h3>
          {dadosPizza.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dadosPizza} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                  {dadosPizza.map((_, index) => (
                    <Cell key={index} fill={CORES[index % CORES.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatarSaldo(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="sem-dados">Nenhuma conta cadastrada</p>}
        </div>

        <div className="grafico-card">
          <h3>Depósitos vs Saques</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosBarras}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip formatter={(value) => formatarSaldo(value)} />
              <Bar dataKey="valor" fill="#1a56db" radius={[6, 6, 0, 0]}>
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Relatório Mensal — ocupa largura total */}
      <div className="grafico-card grafico-full">
        <h3>📅 Relatório Mensal — {new Date().getFullYear()}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosMensais}>
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip formatter={(value) => formatarSaldo(value)} />
            <Legend />
            <Bar dataKey="depositos" name="Depósitos" fill="#16a34a" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saques" name="Saques" fill="#dc2626" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lucro" name="Lucro" fill="#1a56db" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Resumo por Categoria */}
{gerarResumoPorCategoria(transacoesFiltradas).length > 0 && (
  <div className="grafico-card grafico-full">
    <h3>🏷️ Resumo por Categoria</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={gerarResumoPorCategoria(transacoesFiltradas)} layout="vertical">
        <XAxis type="number" stroke="#94a3b8" tickFormatter={(v) => formatarSaldo(v)} />
        <YAxis type="category" dataKey="categoria" stroke="#94a3b8" width={100} />
        <Tooltip content={<TooltipCategoria />} />
        <Legend />
        <Bar dataKey="depositos" name="Depósitos" fill="#16a34a" radius={[0, 4, 4, 0]} />
        <Bar dataKey="saques" name="Saques" fill="#dc2626" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}

      

    </div>
  );
}

export default DashboardPage;