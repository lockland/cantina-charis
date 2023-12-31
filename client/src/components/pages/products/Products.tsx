import CustomSimpleGrid from "../../CustomSimpleGrid";
import { getProducts } from "../../../hooks/useAPI";
import ProductCard from "./ProductCard";
import Product, { ProductDetails } from "../../../models/Product";
import { Box } from "@mantine/core";
import AddProduct from "./AddProduct";
import { useEffect, useState } from "react";


function Products() {
  const [list, setList] = useState<Product[]>([])

  useEffect(() => {
    getProducts().then((response: ProductDetails[]) => {
      const data: Product[] = response.map((p: ProductDetails) => Product.buildFromData(p))
      setList(data)
    })

  }, [])



  return (
    <Box>
      <AddProduct />

      <CustomSimpleGrid mt="md" cols={4}>
        {list.map((product: Product) =>
          <ProductCard key={product.id} product={product} />
        )}
      </CustomSimpleGrid>
    </Box>

  );
}

export default Products
