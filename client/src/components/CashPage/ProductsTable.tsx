import { Box, Table } from "@mantine/core"
import OrderItemRow from "../../models/OrderItem";

interface ProductsTableProps {
  orderItemList: OrderItemRow[]
}


function ProductsTable({ orderItemList }: ProductsTableProps) {

  const rows = orderItemList.map((item, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.qtd}</td>
      <td>{`R$ ${item.getPrice()}`}</td>
      <td>{`R$ ${item.getTotal()}`}</td>
    </tr>
  ));

  return (
    <Box bg="var(--secondary-background-color)" mih={250} mah={280} style={{ overflow: "auto" }}>
      <Table striped >
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Valor unitário</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </Box>
  )
}

export default ProductsTable