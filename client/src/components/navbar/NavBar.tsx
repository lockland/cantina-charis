import { NavLink } from "react-router-dom";
import "./NavBar.css"
import { CloseBtn } from "./CloseBtn";
import { Container } from "@mantine/core";
import { useState } from "react";
import { useCookiesHook } from "../../hooks/useCookiesHook";
import { useSharedContext } from "../../hooks/useSharedContext";

interface NavBarProps {
  maw: string
}

function NavBar({ maw }: NavBarProps) {
  const [open, setOpen] = useState(false)
  const { isEventCreated } = useCookiesHook()
  const { role } = useSharedContext()
  const isViewer = role === "viewer"

  return (
    <div className="navbar">
      <button onClick={() => setOpen(!open)}>Menu</button>
      <Container maw={maw} className={"navbar-container " + (open ? "opened" : "closed")}>
        <nav >
          <ul>
            {!isViewer && (
              <li>
                <NavLink to="/"  >Caixa</NavLink>
              </li>
            )}
            <li>
              <NavLink to="/orders">Pedidos</NavLink>
            </li>
            {!isViewer && (
              <>
                <li>
                  <NavLink to="/products">Produtos</NavLink>
                </li>
                <li>
                  <NavLink to="/customers-debits">Em Aberto</NavLink>
                </li>
                <li>
                  <NavLink to="/reports">Relatórios</NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
        {isEventCreated ? <CloseBtn /> : ""}
      </Container>
    </div>
  );
}
export default NavBar;
