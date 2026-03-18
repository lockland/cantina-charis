import CustomSimpleGrid from "../../CustomSimpleGrid";
import { getProducts } from "../../../hooks/useAPI";
import ProductCard from "./ProductCard";
import Product, { ProductDetails } from "../../../models/Product";
import { Box } from "@mantine/core";
import AddProduct from "./AddProduct";
import { useCallback, useEffect, useState } from "react";


function Products() {
  const [list, setList] = useState<Product[]>([])

  const fetchProducts = useCallback(() => {
    getProducts().then((response: ProductDetails[]) => {
      const data: Product[] = response.map((p: ProductDetails) => Product.buildFromData(p))
      setList(data)
    })
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])



  return (
    <Box>
      <AddProduct />

      <CustomSimpleGrid mt="md" cols={5}>
        {list.map((product: Product) =>
          <ProductCard key={product.id} product={product} onDeleted={fetchProducts} />
        )}
      </CustomSimpleGrid>
    </Box>

  );
}

export default Products
