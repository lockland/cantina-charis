import { ActionIcon, Box, CloseButton, Group, Switch, Title, Tooltip } from "@mantine/core"
import EditIcon from "./EditIcon"
import EditProductModal from "./EditProductModal";
import { useDisclosure } from "@mantine/hooks";
import Product from "../../../models/Product";
import { toggleProductStatus, deleteProduct } from "../../../hooks/useAPI";

function ProductCard({ product, onDeleted }: { product: Product; onDeleted?: () => void }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleOnChange = () => {
    toggleProductStatus(product.id)
  }

  const handleDelete = () => {
    const value = window.prompt("Digite DELETE para excluir o produto.")
    if (value?.trim() === "DELETE") {
      deleteProduct(product.id).then(() => onDeleted?.())
    }
  }

  return (
    <Box bg="var(--secondary-background-color)" p="sm" style={{ position: "relative" }}>
      <Tooltip label="Excluir produto">
        <CloseButton
          style={{ position: "absolute", top: 8, right: 8 }}
          size="sm"
          onClick={handleDelete}
          aria-label="Excluir produto"
        />
      </Tooltip>
      <EditProductModal product={product} opened={opened} closeModal={close} />

      <Box bg="var(--generic-blue)" p="sm" mih={100}>
        <Title order={2}>{product.name}</Title>
        <Title order={3}>{product.getFormattedPrice()}</Title>
      </Box>
      <Group mt="md" w="100%" style={{ display: "flex", justifyContent: "space-between" }}>
        <Switch
          size="xl"
          defaultChecked={product.enabled}
          onLabel="Remover do cardápio" offLabel="Adicionar ao cardápio"
          onChange={handleOnChange}
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