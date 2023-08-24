import { Box, Flex, Table, Title } from "@mantine/core";
import { getEventsSummary } from "../../../hooks/useFakeAPI";

function Reports() {

  const { data } = getEventsSummary(10)

  const rows = data.map((event: any) => (
    <tr key={event.event_id}>
      <td>{event.event_name}</td>
      <td>R$ {event.open_amount}</td>
      <td>{event.created_at}</td>
      <td>R$ {event.incoming}</td>
      <td>R$ {event.outgoing}</td>
      <td>R$ {event.balance}</td>
      <td>R$ {event.liquid_funds}</td>
    </tr>
  ));

  const liquidFundsOnPeriod = data.reduce((total, event) => (
    total += parseFloat(event.liquid_funds)
  ), 0)

  return (
    <Box p={7}>
      <Flex
        direction="column"
        align="center"
        mb={10}
      >
        <Title>Sumário dos eventos cadastrados</Title>
        <Title order={2}> Valor apurado até o momento: R$ {liquidFundsOnPeriod.toFixed(2)} </Title>
      </Flex>
      <Table
        bg="var(--secondary-background-color)"
        striped
        withColumnBorders
        withBorder
      >
        <thead>
          <tr>
            <th>NOME DO EVENTO</th>
            <th>ABERTURA DO CAIXA</th>
            <th>DATA DO EVENTO</th>
            <th>TOTAL DE ENTRADAS</th>
            <th>TOTAL DE DESPESAS</th>
            <th>TOTAL BRUTO</th>
            <th>TOTAL LÍQUIDO</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  );
}

export default Reports