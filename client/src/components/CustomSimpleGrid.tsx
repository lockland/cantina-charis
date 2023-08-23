import { SimpleGrid } from "@mantine/core";

function CustomSimpleGrid(props: any) {

  const { children, ...otherProps } = props

  return (
    <SimpleGrid
      breakpoints={[
        { minWidth: 'sm', cols: 1 },
        { minWidth: 'md', cols: 1 },
        { minWidth: 'lg', cols: 4 },
      ]}

      {...otherProps}
    >
      {children}
    </SimpleGrid>
  )
}

export default CustomSimpleGrid