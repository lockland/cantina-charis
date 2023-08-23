import { NavLink } from "react-router-dom";
import "./NavBar.css"
import { CloseBtn } from "./CloseBtn";
import { Container } from "@mantine/core";
import { useState } from "react";

interface NavBarProps {
  maw: string
}

function NavBar({ maw }: NavBarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="navbar">
      <button onClick={() => setOpen(!open)}>Menu</button>
      <Container maw={maw} className={"navbar-container " + (open ? "opened" : "closed")}>
        <nav >
          <ul>
            <li>
              <NavLink to="/"  >Caixa</NavLink>
            </li>
            <li>
              <NavLink to="/orders">Pedidos</NavLink>
            </li>
            <li>
              <NavLink to="/products">Produtos</NavLink>
            </li>
            <li>
              <NavLink to="/customers-debits">Em Aberto</NavLink>
            </li>
            <li>
              <NavLink to="/reports">Relatórios</NavLink>
            </li>
          </ul>
        </nav>
        <CloseBtn />
      </Container>
    </div>

  );
}
export default NavBar;
