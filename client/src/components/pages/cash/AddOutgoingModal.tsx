import { Box, Button, Group, Modal, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { RealIcon } from "./RealIcon"

function AddOutgoingModal() {
  const isMobile = useMediaQuery("(max-width: 787px)");
  const [opened, { open, close }] = useDisclosure(false)

  const form = useForm({
    initialValues: {
      description: "",
      amount: undefined
    }
  })

  const handleOnSubmit = (values: any): void => {
    console.log(values)
    close()
  }

  return (
    <Box>
      <Modal
        onClose={close}
        opened={opened}
        title="Registar despesa"
        fullScreen={isMobile}
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <form onSubmit={form.onSubmit(handleOnSubmit)}>
          <TextInput
            placeholder="Gastos mercado"
            size="lg"
            label="Descrição da despesa"
            required
            {...form.getInputProps("description")}
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
            {...form.getInputProps("amount")}
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