import { Box, Table, Text } from "@mantine/core"
import { useFormContext } from "../../../hooks/formContext";
import { useSharedContext } from "../../../hooks/useSharedContext";
import OrderItemRow from "../../../models/OrderItemRow";

function ProductsTable() {
  const form = useFormContext()
  const { orderItemList } = useSharedContext()

  const error = form.getInputProps("products")["error"]

  const rows = orderItemList.map((item: OrderItemRow, index) => (
    <tr key={index}>
      <td>{item.name}</td>
      <td>{item.quantity}</td>
      <td>{item.getFormattedPrice()}</td>
      <td>{item.getFormattedTotal()}</td>
    </tr>
  ));

  return (
    <Box>
      <Box
        bg="var(--secondary-background-color)"
        mih={250}
        mah={280}
        style={{ overflow: "auto" }}
        mt="md"
      >
        <Table striped withColumnBorders>
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
      <Text color="red">{(error) ? error : ""}</Text>
    </Box>
  )
}

export default ProductsTable