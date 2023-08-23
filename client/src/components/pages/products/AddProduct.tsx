import { useNavigate } from "react-router-dom";
import ProductModal from "./ProductModal";
import { Box, Button, Group } from "@mantine/core";
import ProductListItem from "../../../models/ProductListItem";
import { useDisclosure } from "@mantine/hooks";

function AddProductModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate()

  const handleSubmit = (values: any) => {
    console.log(values)
    refreshPage()
  }

  const refreshPage = () => {
    navigate(0)
  }

  const product = new ProductListItem()

  return (
    <Box>
      <Group position="right">
        <Button onClick={open}>Adicionar produto</Button>
      </Group>

      <ProductModal onSubmit={handleSubmit} product={product} opened={opened} closeModal={close} />
    </Box>
  )
}

export default AddProductModal