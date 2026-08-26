// Product is exported from `product.tsx` (lowercase 'p', ASCII 112)
// Since 'p' > 'i' (105), index.ts comes alphabetically first,
// so the import is correctly suggested from `./components/Product`
import { Product } from "./components/Product/index.js"

// ProductList is exported from `ProductList.tsx` (uppercase 'P', ASCII 80)
// Since 'P' < 'i' (105), ProductList.tsx comes before index.ts,
// so the language service suggests direct path `./components/Product/ProductList.js`
import { ProductList } from "./components/Product/ProductList.js"

// double is exported from `double.ts` (lowercase 'd', ASCII 100)
// Since 'd' < 'i' (105), double.ts comes before index.ts → direct path `./utils/double/double.js`
import { double } from "./utils/double/double.js"

// triple is exported from `triple.ts` (lowercase 't', ASCII 116)
// Since 't' > 'i' (105), index.ts comes first → barrel path `./utils/triple/index.js`
import { triple } from "./utils/triple/index.js"

console.log(Product, ProductList, double, triple)