import { useState, useEffect } from "react";
import "./FerraoTutoras.css";
import imgBisteca from "../../assets/tutoras/Bisteca.PNG";
import imgLeite from "../../assets/tutoras/LEITE.PNG";
import imgPC from "../../assets/tutoras/PC.PNG";
const PASSOS = [
  {
    icone: "🏦",
    titulo: "Bem-vindo ao MoneyMind!",
    descricao: "Seu gestor financeiro completo. Vamos te mostrar como usar em 4 passos rápidos!",
  imagem: imgBisteca,
    alt: "Tela do intro"
},
  {
    icone: "💰",
    titulo: "Crie suas Contas",
    descricao: "Em 'Minhas Contas' você cria centros de custo como 'Empresa', 'Filial' ou 'Projeto X'. Cada conta tem seu próprio saldo.",
    imagem: imgBisteca,
    alt: "Tela do Contas"
},

  {
    icone: "💸",
    titulo: "Registre Transações",
     descricao: "Em 'Transações' você registra depósitos e saques. Adicione uma descrição e categoria para organizar melhor seus gastos.",
    imagem: imgLeite,
    alt: "Tela do Transações"
    },

  {
    icone: "📊",
    titulo: "Acompanhe o Dashboard",
    descricao: "No Dashboard você visualiza gráficos de saldo, relatório mensal e resumo por categoria. Use os filtros de conta e período!",
    imagem: imgPC,
    alt: "Tela do dashboard"
}
];

function Tutoras({ onFechar}){
    const [passoAtual, setPassoAtual] = useState(0);

    function handleProximo() {
        if (passoAtual < PASSOS.length - 1){
            setPassoAtual(passoAtual + 1);
        } else{
            handleFechar();
        }
    }

    function handleFechar(){
        localStorage.setItem('tutorasVisto', 'true');
        onFechar();
    }
    
 const passo = PASSOS[passoAtual];
  const isUltimo = passoAtual === PASSOS.length - 1;

  return (
    <div className="tutoras-overlay">
      <div className="tutoras-modal">
        <div className="tutoras-icone">{passo.icone}</div>
        <h2 className="tutoras-titulo">{passo.titulo}</h2>
        <p className="tutoras-descricao">{passo.descricao}</p>

        {/* Imagem ilustrativa abaixo da descrição */}
        <div className="tutoras-imagem-container">
          <img
            src={passo.imagem}
            alt={passo.alt}
            className="tutoras-imagem"
          />
        </div>

        <div className="tutoras-dots">
          {PASSOS.map((_, i) => (
            <span
              key={i}
              className={`tutoras-dot ${i === passoAtual ? 'ativo' : ''}`}
              onClick={() => setPassoAtual(i)}
            />
          ))}
        </div>

        <div className="tutoras-botoes">
          <button className="btn-pular" onClick={handleFechar}>
            Pular tutorial
          </button>
          <button className="btn-proximo" onClick={handleProximo}>
            {isUltimo ? 'Começar! 🚀' : 'Próximo →'}
          </button>
        </div>
      </div>
    </div>
  );
}


export default Tutoras;