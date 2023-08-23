import CustomSimpleGrid from "../../CustomSimpleGrid";
import { getProducts } from "../../../hooks/useFakeAPI";
import ProductCard from "./ProductCard";
import ProductListItem from "../../../models/ProductListItem";

function Products() {
  const { data } = getProducts(20)
  const list = data.map((product: ProductListItem) => <ProductCard product={product} />)

  return (
    <CustomSimpleGrid cols={4}>
      {list}
    </CustomSimpleGrid>
  );
}

export default Products
