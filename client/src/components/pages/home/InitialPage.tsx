
import { TextInput, Button, Box, NumberInput, Center, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCookiesHook } from "../../../hooks/useCookiesHook"
import { RealIcon } from '../cash/RealIcon';

function InitialPage() {
  const { setEventData } = useCookiesHook()

  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: undefined,
    },

    validate: {
      eventName: (value) => (value.length < 3 ? "Preencha o nome do evento por favor!" : null),
      initialCashValue: (value: number) => ((value || 0) <= 0 ? "Preencha o valor inicial do caixa!" : null),
    }
  });

  const handleSubmit = (values: any) => {

    const eventData = {
      ...values,
      event_created: true
    }

    console.log(eventData)
    setEventData(eventData)
  }

  return (
    <Center h="70vh">
      <Box w={400} mx="auto">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{
            backgroundColor: "var(--initial-page-background)",
            padding: 24,
            boxShadow: "2px 6px 23px -5px rgba(0,0,0,1)"
          }}
        >
          <TextInput
            withAsterisk
            label="Evento"
            placeholder="Nome do evento"
            className='form-item'
            {...form.getInputProps('eventName')}
            size="lg"
          />
          <Space h="md" />
          <NumberInput
            icon={<RealIcon />}
            withAsterisk
            hideControls
            label="Valor caixa"
            placeholder="10000,00"
            {...form.getInputProps('initialCashValue')}
            size="lg"
            precision={2}
          />

          <Button type="submit" mt="md" size="lg" fullWidth>
            Abrir Caixa
          </Button>
        </form>
      </Box>
    </Center>
  )
}


export default InitialPage