import { TextInput, Button, Group, Box, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import "./Home.css"

function InitialPage() {
  const form = useForm({
    initialValues: {
      eventName: '',
      initialCashValue: 0,
      termsOfService: false,
    },

    // validate: {
    //   email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    // },
  });

  return (

    <div id="initial-page">
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
            <Button type="submit" fullWidth> Abrir Caixa </Button>
          </Group>
        </form>
      </Box>
    </div>

  )
}


function CashPage() {
  return <> Cash Page</>
}


const alreadCreated = false


function Home() {

  return (
    (alreadCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
