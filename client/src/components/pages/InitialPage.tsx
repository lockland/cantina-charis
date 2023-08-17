
import { TextInput, Button, Group, Box, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';


function InitialPage() {
  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: 0,
    }
  });

  return (
    <Box maw={300} mx="auto">
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Evento"
          placeholder="Nome do evento"
          className='form-item'
          {...form.getInputProps('eventName')}
        />

        <NumberInput
          withAsterisk
          label="Caixa"
          placeholder="R$ 10000,00"
          {...form.getInputProps('initialCashValue')}
        />

        <Group position="center">
          <Button type="submit" fullWidth color='#000'> Abrir Caixa </Button>
        </Group>
      </form>
    </Box>

  )
}


export default InitialPage