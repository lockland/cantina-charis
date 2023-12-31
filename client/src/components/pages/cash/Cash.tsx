import { Grid, Title } from "@mantine/core"
import OrdersCardList from "../../OrdersCardList"
import OrderForm from "./OrderForm";
import AddOutgoingModal from "./AddOutgoingModal";

function CashPage() {
  return (
    <Grid>
      <Grid.Col mah={750} md={6} lg={6} orderMd={1} orderSm={1} order={2} style={{ overflow: "auto" }}>
        <Title align="center" order={2} >Pedidos</Title>
        <OrdersCardList />
      </Grid.Col>

      <Grid.Col md={6} lg={6} orderMd={2} orderSm={2} order={1}>
        <Title align="center" order={2}>Caixa</Title>
        <AddOutgoingModal />
        <OrderForm />
      </Grid.Col>
    </Grid>
  )
}

export default CashPage