import { useMediaQuery } from "@mantine/hooks";
import ProductListItem from "../../../models/ProductListItem";
import { Button, Group, Modal, NumberInput, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { RealIcon } from "../cash/RealIcon";

interface ModalProps {
  product: ProductListItem
  modalTitle: string
  opened: boolean
  closeModal: any
  onSubmit: any
}

function ProductModal({ product, opened, closeModal, onSubmit, modalTitle }: ModalProps) {
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
      title={modalTitle}
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
          label="Valor do produto"
          icon={<RealIcon />}
          precision={2}
          hideControls
          withAsterisk
          {...form.getInputProps('productPrice')}
          decimalSeparator=','
          thousandsSeparator='.'
        />
        <Group mt="md">
          <Button fullWidth type="submit">Salvar</Button>
        </Group>
      </form>
    </Modal>
  )
}

export default ProductModal