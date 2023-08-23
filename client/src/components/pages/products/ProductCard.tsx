import { ActionIcon, Box, Group, Switch, Title } from "@mantine/core"
import ProductListItem from "../../../models/ProductListItem"
import { ChangeEvent } from "react"
import EditIcon from "./EditIcon"
import EditProductModal from "./EditProductModal";
import { useDisclosure } from "@mantine/hooks";

function ProductCard({ product }: { product: ProductListItem }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>, productId: string) => {
    console.log(event, productId)
  }


  return (
    <Box bg="var(--secondary-background-color)" p="sm">
      <EditProductModal product={product} opened={opened} closeModal={close} />

      <Box bg="var(--generic-blue)" p="sm" mih={100}>
        <Title order={2}>{product.name}</Title>
        <Title order={3}>R$ {product.getFormattedPrice()}</Title>
      </Box>
      <Group mt="md" w="100%" style={{ display: "flex", justifyContent: "space-between" }}>
        <Switch
          size="xl"
          defaultChecked={product.enabled}
          onLabel="Remover do cardápio" offLabel="Adicionar ao cardápio"
          onChange={(e) => handleOnChange(e, product.id)}
        />

        <ActionIcon
          c="var(--generic-blue)"
          title="Editar Produto"
          size="xl"
          onClick={open}
        >
          <EditIcon />
        </ActionIcon>
      </Group>
    </Box>
  )
}

export default ProductCard