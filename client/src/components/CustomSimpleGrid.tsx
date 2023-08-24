import { SimpleGrid } from "@mantine/core";

function CustomSimpleGrid(props: any) {

  const { children, cols, ...otherProps } = props

  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 'sm', cols },
      ]}

      {...otherProps}
    >
      {children}
    </SimpleGrid>
  )
}

export default CustomSimpleGrid