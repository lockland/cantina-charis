
import { TextInput, Button, Box, NumberInput, Center, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FormEvent } from 'react';
import { useCookies } from "react-cookie";
import { COOKIE_NAME } from '../../App';

interface EventType {
  eventName: string,
  initialCashValue: string
}


function InitialPage() {
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

  const [cookies, setCookie] = useCookies([COOKIE_NAME]);

  const handleSubmit = (values: EventType, event: FormEvent<HTMLFormElement>) => {
    console.log(values)
    console.log(event)

    const expireTimestamp = new Date().getTime() + (60 * 60 * 24 * 1000)
    setCookie(COOKIE_NAME, true, { expires: new Date(expireTimestamp) })
  }

  return (
    <Center h="70vh">
      <Box w={400} mx="auto">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          style={{
            backgroundColor: "var(--secondary-background-color)",
            padding: 24
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

          <Button type="submit" mt="md" fullWidth>
            Abrir Caixa
          </Button>
        </form>
      </Box>
    </Center>
  )
}


export default InitialPage