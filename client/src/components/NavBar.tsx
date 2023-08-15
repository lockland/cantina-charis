import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/"  >Caixa</Link>
        </li>
        <li>
          <Link to="/products">Produtos</Link>
        </li>
        <li>
          <Link to="/orders">Pedidos</Link>
        </li>
        <li>
          <Link to="/reports">Relatórios</Link>
        </li>
        <li>
          <Link to="/customers-debits">Em Aberto</Link>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
