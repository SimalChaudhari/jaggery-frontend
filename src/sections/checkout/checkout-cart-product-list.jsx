import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';

import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { CheckoutCartProduct } from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'totalAmount', label: 'Total Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export function CheckoutCartProductList({
  products,
  onDelete,
  onIncreaseQuantity,
  onDecreaseQuantity,
}) {
  return (
    <Scrollbar>
      <Table sx={{ minWidth: 720 }}>
        <TableHeadCustom headLabel={TABLE_HEAD} />

        <TableBody>
          {products.map((row) => {
            // Create unique key based on product ID and size ID
            const sizeId = row.size ? (typeof row.size === 'object' ? row.size.id : row.size) : null;
            const itemKey = `${row.id}_${sizeId || 'no-size'}`;
            
            return (
              <CheckoutCartProduct
                key={itemKey}
                row={row}
                onDelete={() => onDelete(itemKey)}
                onDecrease={() => onDecreaseQuantity(itemKey)}
                onIncrease={() => onIncreaseQuantity(itemKey)}
              />
            );
          })}
        </TableBody>
      </Table>
    </Scrollbar>
  );
}
