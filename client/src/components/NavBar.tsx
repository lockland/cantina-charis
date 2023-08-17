import { NavLink } from "react-router-dom";
import "./NavBar.css"
import { Container } from "@mantine/core";

interface NavBarProps {
  maw: string
}

function NavBar({ maw }: NavBarProps) {
  return (
    <Container maw={maw}>
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
    </Container>
  );
}
export default NavBar;
