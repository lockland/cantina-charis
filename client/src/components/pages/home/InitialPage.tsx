
import { Button, Box, Center, Space } from '@mantine/core';
import { AppTextInput, CurrencyNumberInput, useForm } from '../../../ui';
import { RealIcon } from '../cash/RealIcon';
import Event from '../../../models/Event';
import { createEvent } from '../../../hooks/useAPI';
import { useSharedContext } from '../../../hooks/useSharedContext';

function InitialPage({ setOpened }: any) {
  const { setOpenEvent } = useSharedContext()

  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: undefined,
    },

    validate: {
      eventName: (value: string) => (value.length < 3 ? "Preencha o nome do evento por favor!" : null),
      initialCashValue: (value: number | undefined) => (((value ?? 0) <= 0) ? "Preencha o valor inicial do caixa!" : null),
    }
  });

  const handleSubmit = (values: any) => {
    const eventInfo = {
      "event_name": values.eventName,
      "open_amount": values.initialCashValue
    }

    console.log(eventInfo)

    createEvent(eventInfo).then((data) => {
      setOpenEvent(Event.buildFromData(data))
      setOpened("cashpage")
    })
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
          <AppTextInput
            withAsterisk
            label="Evento"
            placeholder="Nome do evento"
            className='form-item'
            {...form.getInputProps('eventName')}
            size="lg"
          />
          <Space h="md" />
          <CurrencyNumberInput
            icon={<RealIcon />}
            withAsterisk
            label="Valor caixa"
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
