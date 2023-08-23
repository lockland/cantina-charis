import { useMediaQuery } from "@mantine/hooks";
import ProductListItem from "../../../models/ProductListItem";
import { Button, Group, Modal, NumberInput, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface EditModalProps {
  product: ProductListItem
  opened: boolean
  closeModal: any
}

function EditProductModal({ product, opened, closeModal }: EditModalProps) {
  const isMobile = useMediaQuery("(max-width: 787px)");

  const form = useForm({
    initialValues: {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
    },

    validate: {
      productName: (value) => (value.length < 3 ? "Preencha o nome do produto por favor!" : null),
      productPrice: (value) => ((parseInt(value) || 0) <= 0 ? "Preencha o valor!" : null),
    }
  })

  const handleSubmit = (values: any) => {
    console.log(values)
    product.name = values.productName
    product.price = values.productPrice

    closeModal()
  }


  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title="Editar produto"
      fullScreen={isMobile}
      transitionProps={{ transition: 'fade', duration: 200 }}

    >
      <form
        onSubmit={form.onSubmit(handleSubmit)}
      >
        <TextInput
          label="Identificador"
          {...form.getInputProps('productId')}
          readOnly
        />

        <Space mt="md" />
        <TextInput
          label="Nome do produto"
          withAsterisk
          defaultValue={product.name}
          {...form.getInputProps('productName')}
        />
        <Space mt="md" />

        <NumberInput
          label="Valor do produto R$"
          precision={2}
          withAsterisk
          defaultValue={product.price}
          {...form.getInputProps('productPrice')}
        />
        <Group mt="md">
          <Button fullWidth type="submit">Salvar</Button>
        </Group>
      </form>
    </Modal>
  )
}

export default EditProductModal