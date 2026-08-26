// Product in `src/components/Product/product.tsx (the file name starts from lower case 'p')
// i < p
import { Product } from "./components/Product/index.js";
// ProductList in `src/components/Product/ProductList.tsx (upper case 'P')
// i > P
import { ProductList } from "./components/Product/ProductList.js";
// i > d
import { double } from "./utils/double/double.js";
// i < t
import { triple } from "./utils/triple/index.js";

console.log(Product, ProductList, double, triple)