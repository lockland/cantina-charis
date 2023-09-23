import { Box, Button, Group, Modal, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { RealIcon } from "./RealIcon"
import { createOutgoing } from "../../../hooks/useAPI";
import { OutgoingType } from "../../../models/Outgoing";
import { useCookiesHook } from "../../../hooks/useCookiesHook";

function AddOutgoingModal() {
  const { eventId } = useCookiesHook()

  const isMobile = useMediaQuery("(max-width: 787px)");
  const [opened, { open, close: closeModal }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      outgoing_description: "",
      outgoing_amount: undefined,
      event_id: eventId
    }
  })

  const handleOnSubmit = (outgoing: OutgoingType): void => {
    console.log(outgoing)
    createOutgoing(outgoing)
    closeModal()
    form.reset()
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
          <TextInput
            placeholder="Gastos mercado"
            size="lg"
            label="Descrição da despesa"
            required
            {...form.getInputProps("outgoing_description")}
          />
          <NumberInput
            size="lg"
            icon={<RealIcon />}
            label="Valor"
            precision={2}
            hideControls
            required
            mt="md"
            placeholder="0"
            {...form.getInputProps("outgoing_amount")}
            decimalSeparator=','
            thousandsSeparator='.'
          />
          <Button size="lg" type="submit" fullWidth mt="md">Salvar</Button>
        </form>
      </Modal>

      <Group position="right">
        <Button size="md" my="md" bg="red" onClick={open} fullWidth={isMobile}>
          Registrar despesa
        </Button>
      </Group>
    </Box>
  )
}

export default AddOutgoingModal