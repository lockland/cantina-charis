import { useMediaQuery } from "@mantine/hooks";
import ProductListItem from "../../../models/Product";
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
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
    },

    validate: {
      product_name: (value) => (value.length < 3 ? "Preencha o nome do produto por favor!" : null),
      product_price: (value) => ((parseInt(value) || 0) <= 0 ? "Preencha o valor!" : null),
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
          {...form.getInputProps('product_id')}
          readOnly
        />

        <Space mt="md" />
        <TextInput
          label="Nome do produto"
          withAsterisk
          {...form.getInputProps('product_name')}
        />
        <Space mt="md" />

        <NumberInput
          label="Valor do produto"
          icon={<RealIcon />}
          precision={2}
          hideControls
          withAsterisk
          {...form.getInputProps('product_price')}
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