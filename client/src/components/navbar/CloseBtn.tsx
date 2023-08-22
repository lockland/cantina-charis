import { ActionIcon } from "@mantine/core";
import { ShutdownIcon } from "./shutdown-icon";
import { useCookiesHook } from "../../hooks/useCookiesHook";
import { useNavigate } from "react-router-dom";


export function CloseBtn() {
  const { removeAppCookie } = useCookiesHook()
  const navigate = useNavigate()

  const handleOnClick = (): void => {
    const answer = confirm("Você deseja realmente fechar o caixa?")

    if (answer) {
      removeAppCookie()
      navigate("reports")
    }
  }

  return (
    <ActionIcon title="Fechar caixa" size="xl" onClick={handleOnClick}>
      <ShutdownIcon />
    </ActionIcon>
  )
}