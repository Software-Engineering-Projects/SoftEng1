export const addToCart = (product) => ({
  type: 'ADD_TO_CART',
  payload: product,
});

export const removeFromCart = (productIdentifier) => ({
  type: 'REMOVE_FROM_CART',
  payload: { productIdentifier },
});


export const increaseQuantity = (productIdentifier) => ({
  type: 'INCREASE_QUANTITY',
  payload: { productIdentifier },
});

export const reduceQuantity = (productIdentifier) => ({
  type: 'REDUCE_QUANTITY',
  payload: { productIdentifier },
});

export const clearCart = () => ({
  type: 'CLEAR_CART',
});

export const setCartItems = (items) => ({
  type: 'SET_CART_ITEMS',
  payload: items,
});

