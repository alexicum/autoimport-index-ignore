# Auto-import ignores barrel (index.ts)

- [Auto-import ignores barrel (index.ts) when the imported folder name is a prefix of the importing file name](#auto-import-ignores-barrel-indexts-when-the-imported-folder-name-is-a-prefix-of-the-importing-file-name)
- [Auto-import prioritizes files alphabetically before index.ts inside a folder, ignoring the barrel](#auto-import-prioritizes-files-alphabetically-before-indexts-inside-a-folder-ignoring-the-barrel)
- [Environment \& tested versions](#environment--tested-versions)

## Auto-import ignores barrel (index.ts) when the imported folder name is a prefix of the importing file name

### Description
When using auto‑import in a file, TypeScript (TSServer/LSP) suggests a direct path to the .ts/.tsx file instead of the barrel export (index.ts) if the name of the folder containing the imported module is a prefix (substring at the beginning) of the name of the file where the import is being written.

Both the imported module folder and the importing file reside at the same directory level.

**Project structure**

```text
utils/
  sum/
    index.ts    // re‑exports sum from sum.ts
    sum.ts
  sumA/
    index.ts    // re‑exports sumA from sumA.ts
    sumA.ts
  sumABNums/
    index.ts    // re‑exports sumABNums from sumABNums.ts
    sumABNums.ts
  sumAB.ts      // importing file (the issue occurs here)
  index.ts      // importing file (works correctly)
```

**Steps to reproduce**

  Open utils/sumAB.ts.
  Remove all imports and save file.
  Observe the auto‑import suggestions provided by the editor.

**Actual behaviour**

  In utils/sumAB.ts:  
  
  for modules sum and sumA (whose folder names are prefixes of the importing file name sumAB.ts), the suggestion points to the direct file: './sum/sum.js' and './sumA/sumA.js'.

  The barrel path './sum/index.js' and './sumA/index.js' is not offered.

  For sumABNums (folder name is longer than the importing file name, so it is not a prefix), the correct barrel path './sumABNums/index.js' is suggested.

  In utils/index.ts (also at the same level), imports for all modules correctly resolve via their barrel files.

**Expected behaviour**

  The barrel path ('./sum/index.js', './sumA/index.js') should always be the preferred suggestion when it exists, regardless of how the folder name relates to the importing file name.

**Additional context**

The issue seems to occur specifically when the imported folder name is a prefix of the importing file name. If the names differ by at least one character in a way that breaks the prefix relationship (e.g., sum and sumB or sam), the barrel path is correctly suggested.

## Auto-import prioritizes files alphabetically before index.ts inside a folder, ignoring the barrel

**Description**

When a folder contains an index.ts barrel file and other .ts/.tsx files, the TypeScript language service (tsgo) suggests a direct import from the file that comes first in alphabetical (ASCII/Unicode) order, rather than preferring the barrel.  
This leads to inconsistent and non‑intuitive auto‑import suggestions, exposing internal file paths and bypassing the intended public interface (index.ts).

**Project structure:**

```text
src/
  components/
    Product/
      index.ts          // re‑exports from product.tsx and ProductList.tsx
      product.tsx       // exports Product (lowercase 'p')
      ProductList.tsx   // exports ProductList (uppercase 'P')
  utils/
    double/
      double.ts         // exports double (lowercase 'd')
      index.ts          // re‑exports from double.ts
    triple/
      index.ts          // re‑exports from triple.ts
      triple.ts         // exports triple (lowercase 't')
  index.ts              // root file where imports are tested
```

**Code example** (src/index.ts):

```TypeScript
// Product is exported from `product.tsx` (lowercase 'p', ASCII 112)
// Since 'p' > 'i' (105), index.ts comes alphabetically first,
// so the import is correctly suggested from `./components/Product`
import { Product } from "./components/Product/index.js";

// ProductList is exported from `ProductList.tsx` (uppercase 'P', ASCII 80)
// Since 'P' < 'i' (105), ProductList.tsx comes before index.ts,
// so the language service suggests direct path `./components/Product/ProductList.js`
import { ProductList } from "./components/Product/ProductList.js";

// double is exported from `double.ts` (lowercase 'd', ASCII 100)
// Since 'd' < 'i' (105), double.ts comes before index.ts → direct path `./utils/double/double.js`
import { double } from "./utils/double/double.js";

// triple is exported from `triple.ts` (lowercase 't', ASCII 116)
// Since 't' > 'i' (105), index.ts comes first → barrel path `./utils/triple/index.js`
import { triple } from "./utils/triple/index.js";

console.log(Product, ProductList, double, triple);
```

**Actual behavior**

In the example above, the auto‑import suggestions (or the inserted imports) depend on the alphabetical order of the file names relative to index.ts.  
When a file name starts with a character that has a lower ASCII code than i, the language service chooses that file instead of the barrel.  
When the character has a higher code, the barrel is chosen.  
This behaviour may be unexpected, since `index.ts` is typically intended to serve as the public entry point for the folder.

**Expected behaviour**

Regardless of alphabetical order, if index.ts exists and exports the symbol, the auto‑import should always suggest the folder import (e.g., './components/Product' or './utils/double') rather than a direct path to an internal file.

**Possible root cause**

The auto‑import algorithm seems to scan files inside the folder and select the one that appears earliest in the file system order (ASCII/Unicode ordering).  
It does not give special priority to `index.ts` over other files.

## Environment & tested versions

  TypeScript versions: 7.0.2

  VSCode version: 1.134.0

  Windows 11
