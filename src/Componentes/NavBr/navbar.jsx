import "./Navbar.css";

function Navbar({ onLogout }) {
  function handleLogout() {
    localStorage.removeItem('token');
    onLogout();
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        💳 <span>MoneyMind</span>
      </div>
      <div className="navbar-links">
  <a href="#dash">Dashboard</a>
  <a href="#contas">Minhas Contas</a>
  <a href="#transacoes">Transações</a>

        
        <button className="logout-btn" onClick={handleLogout}>Sair</button>
      </div>
    </nav>
  );
}

export default Navbar;