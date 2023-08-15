import { NavLink } from "react-router-dom";
import "./NavBar.css"

function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/"  >Caixa</NavLink>
        </li>
        <li>
          <NavLink to="/products">Produtos</NavLink>
        </li>
        <li>
          <NavLink to="/orders">Pedidos</NavLink>
        </li>
        <li>
          <NavLink to="/reports">Relatórios</NavLink>
        </li>
        <li>
          <NavLink to="/customers-debits">Em Aberto</NavLink>
        </li>
      </ul>
    </nav>
  );
}
export default NavBar;
