
import { TextInput, Button, Group, Box, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import "./InitialPage.css"


function InitialPage() {
  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: 0,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  return (

    <div id="initial-page" sx={{
      "display": "flex", "align-items": "center"
    }}>
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
    </div >

  )
}


export default InitialPage