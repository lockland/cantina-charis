import { ActionIcon } from "@mantine/core";
import { ShutdownIcon } from "./shutdown-icon";
import { useNavigate } from "react-router-dom";
import { closeEvent } from "../../hooks/useAPI";
import { useSharedContext } from "../../hooks/useSharedContext";
import Event from "../../models/Event";


export function CloseBtn() {
  const { openEvent, setOpenEvent, setHomePage } = useSharedContext()
  const navigate = useNavigate()

  const handleOnClick = (): void => {
    const answer = confirm("Você deseja realmente fechar o caixa?")
    if (!answer) {
      return
    }

    const id = openEvent.event_id
    void closeEvent(id)
      .then(() => {
        setOpenEvent(new Event())
        setHomePage("initial")
        navigate("/reports")
      })
      .catch(() => {})
  }

  return (
    <ActionIcon title="Fechar caixa" size="xl" onClick={handleOnClick}>
      <ShutdownIcon />
    </ActionIcon>
  )
}
