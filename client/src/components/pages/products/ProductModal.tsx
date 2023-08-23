import { useMediaQuery } from "@mantine/hooks";
import ProductListItem from "../../../models/ProductListItem";
import { Button, Group, Modal, NumberInput, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

interface ModalProps {
  product: ProductListItem
  opened: boolean
  closeModal: any
  onSubmit: any
}

function ProductModal({ product, opened, closeModal, onSubmit }: ModalProps) {
  const isMobile = useMediaQuery("(max-width: 787px)");

  const form = useForm({
    initialValues: {
      productId: product.id,
      productName: product.name,
      productPrice: product.price || undefined,
    },

    validate: {
      productName: (value) => (value.length < 3 ? "Preencha o nome do produto por favor!" : null),
      productPrice: (value) => ((parseInt(value) || 0) <= 0 ? "Preencha o valor!" : null),
    }
  })

  return (
    <Modal
      opened={opened}
      onClose={closeModal}
      title="Editar produto"
      fullScreen={isMobile}
      transitionProps={{ transition: 'fade', duration: 200 }}

    >
      <form
        onSubmit={form.onSubmit(onSubmit)}
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
          {...form.getInputProps('productName')}
        />
        <Space mt="md" />

        <NumberInput
          label="Valor do produto R$"
          precision={2}
          withAsterisk
          {...form.getInputProps('productPrice')}
        />
        <Group mt="md">
          <Button fullWidth type="submit">Salvar</Button>
        </Group>
      </form>
    </Modal>
  )
}

export default ProductModal