import React from 'react';
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import { useSelector } from 'react-redux';
// TODO: Fix the cart badge to show the number of items in the cart fetched from the backend
export const CartBadge = () => {
  const cart = useSelector((state) => state.cart)
  console.log(cart.items.length)
  // Fix the cart redux state if the cart is empty, just set the items to an empty array
  return (
    <Stack spacing={4} direction="row" sx={{ color: "action.active" }}>
      {/* Place holder for the cart item number data */}
      <Badge color="primary" badgeContent={cart.items ? cart.items.length : 0} />
    </Stack>
  );
}
