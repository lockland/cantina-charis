import { useNavigate } from "react-router-dom";
import ProductModal from "./ProductModal";
import { Box, Button, Group } from "@mantine/core";
import Product, { ProductType } from "../../../models/Product";
import { useDisclosure } from "@mantine/hooks";

function AddProductModal() {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate()

  const handleSubmit = (values: ProductType) => {
    console.log(values)
    //refreshPage()
  }

  const refreshPage = () => {
    navigate(0)
  }

  const product = new Product()

  return (
    <Box>
      <Group position="right">
        <Button onClick={open}>Adicionar produto</Button>
      </Group>

      <ProductModal
        modalTitle="Adicionar novo produto"
        onSubmit={handleSubmit}
        product={product}
        opened={opened}
        closeModal={close}
      />
    </Box>
  )
}

export default AddProductModal