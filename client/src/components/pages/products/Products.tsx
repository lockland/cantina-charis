import CustomSimpleGrid from "../../CustomSimpleGrid";
import { getProducts } from "../../../hooks/useFakeAPI";
import ProductCard from "./ProductCard";
import Product from "../../../models/Product";
import { Box } from "@mantine/core";
import AddProduct from "./AddProduct";


function Products() {
  const { data } = getProducts(20)
  const list = data.map((product: Product) => <ProductCard key={product.id} product={product} />)


  return (
    <Box>
      <AddProduct />

      <CustomSimpleGrid mt="md" cols={4}>
        {list}
      </CustomSimpleGrid>
    </Box>

  );
}

export default Products
