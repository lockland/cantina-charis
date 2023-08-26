import { ActionIcon } from "@mantine/core";
import { ShutdownIcon } from "./shutdown-icon";
import { useCookiesHook } from "../../hooks/useCookiesHook";
import { useNavigate } from "react-router-dom";
import { closeEvent } from "../../hooks/useAPI";


export function CloseBtn() {
  const { removeAppCookie, eventId } = useCookiesHook()
  const navigate = useNavigate()

  const handleOnClick = (): void => {
    const answer = confirm("Você deseja realmente fechar o caixa?")
    if (!answer) {
      return
    }

    closeEvent(eventId)
    removeAppCookie()
    navigate("reports")
  }

  return (
    <ActionIcon title="Fechar caixa" size="xl" onClick={handleOnClick}>
      <ShutdownIcon />
    </ActionIcon>
  )
}