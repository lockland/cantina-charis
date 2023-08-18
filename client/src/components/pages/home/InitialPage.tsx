
import { TextInput, Button, Box, NumberInput, Center, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FormEvent } from 'react';
import { COOKIE_NAME } from '../../../App';
import { useCookiesHook } from "../../../hooks/useCookiesHook"

interface EventType {
  eventName: string,
  initialCashValue: string
}


function InitialPage() {
  const [setCookieWithExpire] = useCookiesHook(COOKIE_NAME)

  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: '',
    },

    validate: {
      eventName: (value) => (value.length < 3 ? "Preencha o nome do evento por favor!" : null),
      initialCashValue: (value) => ((parseInt(value) || 0) <= 0 ? "Preencha o valor inicial do caixa!" : null),
    }
  });

  const handleSubmit = (values: EventType, event: FormEvent<HTMLFormElement>) => {
    console.log(values)
    console.log(event)

    const expireTimestamp = new Date().getTime() + (60 * 60 * 24 * 1000)
    setCookieWithExpire(JSON.stringify({ event_created: true }), expireTimestamp)
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
            withAsterisk
            label="Valor caixa R$"
            placeholder="10000,00"
            {...form.getInputProps('initialCashValue')}
            size="lg"
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