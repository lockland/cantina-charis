import { Box, Button, Group, Modal } from "@mantine/core"
import {
  AppSelect,
  CurrencyNumberInput,
  useForm,
  useDisclosure,
  useMediaQuery,
  showNotification,
} from "../../../ui"
import { RealIcon } from "./RealIcon"
import { createOutgoing, getOutgoings } from "../../../hooks/useAPI";
import { OutgoingOptionType, OutgoingType } from "../../../models/Outgoing";
import { useEffect, useState } from "react";
import { buildOutgoingDescriptionList } from "../../../helpers/SelectLists";
import { useSharedContext } from "../../../hooks/useSharedContext";

function AddOutgoingModal() {
  const [outgoingDescriptions, setOutgoingDescriptions] = useState<OutgoingOptionType[]>([]);
  const { openEvent, openEventHydrated } = useSharedContext()

  useEffect(() => {
    getOutgoings().then((response: OutgoingType[]) => {
      const list = buildOutgoingDescriptionList(response)
      setOutgoingDescriptions(list)
    })
  }, [])

  const isMobile = useMediaQuery("(max-width: 787px)");
  const [opened, { open, close: closeModal }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      outgoing_description: "",
      outgoing_amount: undefined,
      event_id: openEvent.event_id
    }
  })

  useEffect(() => {
    if (openEventHydrated && openEvent.event_id > 0) {
      form.setFieldValue("event_id", openEvent.event_id)
    }
  }, [openEventHydrated, openEvent.event_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOnSubmit = async (outgoing: OutgoingType): Promise<void> => {
    try {
      await createOutgoing(outgoing)
      closeModal()
      form.reset()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível registrar a despesa"
      showNotification({
        title: "Falha ao registrar despesa",
        message,
        color: "red",
      })
    }
  }

  return (
    <Box>
      <Modal
        onClose={closeModal}
        opened={opened}
        title="Registar despesa"
        fullScreen={isMobile}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <form onSubmit={form.onSubmit(handleOnSubmit)} onReset={form.onReset}>
          <AppSelect
            size="md"
            onCreate={(query) => {
              const item: OutgoingOptionType = { value: query, label: query };
              setOutgoingDescriptions((current: OutgoingOptionType[]) => [...current, item]);
              return item;
            }}

            getCreateLabel={(query) => `+ Adicionar ${query}`}

            data={outgoingDescriptions}
            creatable
            searchable
            label="Selecione o fornecedor"
            placeholder="Digite o nome do fornecedor"
            required
            {...form.getInputProps("outgoing_description")}
          />

          <CurrencyNumberInput
            size="lg"
            icon={<RealIcon />}
            label="Valor"
            required
            mt="md"
            placeholder="0"
            {...form.getInputProps("outgoing_amount")}
          />
          <Button size="lg" type="submit" fullWidth mt="md">Salvar</Button>
        </form>
      </Modal>

      <Group position="right">
        <Button size="md" my="md" bg="red" color="red" onClick={open} fullWidth={isMobile}>
          Registrar despesa
        </Button>
      </Group>
    </Box>
  )
}

export default AddOutgoingModal
