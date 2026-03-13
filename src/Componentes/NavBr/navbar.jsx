import ".//navbar.css";

function Navbar({ onLogout }) {
  function handleLogout() {
    localStorage.removeItem('token');
    onLogout();
  }

  return (
    <nav className="navbar">
  <div className="navbar-brand">
    <span className="brand-money">Money</span>
    <span className="brand-mind">Mind</span>
    <span className="brand-bulb">💡</span>
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