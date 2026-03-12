import ContasPage from "./pages/Contas/ContasPage";
import TransacoesPage from "./pages/Transacoes/TransacoesPage";
import LoginPage from "./pages/Login/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import Navbar from "./Componentes/NavBr/navbar";
import Tutoras from "./Componentes/Tutorial/tutoras";
import { useState } from "react";

function App() {

  const [logado, setLogado] = useState(Boolean(localStorage.getItem('token')));
  const [mostrarTutorial, setMostrarTutorial] = useState(
    !localStorage.getItem('tutorialVisto')
      );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLogado(false);
  };

  if (!logado) {
    return <LoginPage onLogin={() => setLogado(true)} />;
  }

  return (
    <div>
      <Navbar onLogout={handleLogout} />
      {mostrarTutorial && <Tutoras onFechar={() => setMostrarTutorial(false)} />}
      <div style={{ paddingTop: "80px" }}>
        <DashboardPage />
        <div style={{ 
          display: "flex", 
          alignItems: "flex-start",
          borderTop: "1px solid #1e293b"
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <ContasPage />
          </div>
          <div style={{ 
            width: "1px", 
            background: "#1e293b", 
            alignSelf: "stretch" 
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <TransacoesPage />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;