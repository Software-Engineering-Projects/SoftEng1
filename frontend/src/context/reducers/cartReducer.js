const initialState = {
  items: []
};


// FIXME: I need to fix the way redux is adding the items, to update the UI correctly
// FIXME: cartReducer.js?t=1715495990848:8 Uncaught (in promise) TypeError: state.items.findIndex is not a function FOR ADD_TO_CART
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingCartItemIndex = state.items.items.findIndex(
        item => item.productIdentifier === action.payload.productIdentifier
      );
      console.log('Adding item to cart. Product Identifier:', action.payload.productIdentifier, 'Existing Cart Item Index:', existingCartItemIndex);

      if (existingCartItemIndex >= 0) {
        const updatedItems = state.items.items.map(item =>
          item.productIdentifier === action.payload.productIdentifier
            ? { ...item, productQuantity: item.productQuantity + action.payload.productQuantity }
            : item
        );
        return { ...state, items: { ...state.items, items: updatedItems } };
      } else {
        return { ...state, items: { ...state.items, items: [...state.items.items, action.payload] } };
      }
    }

    case 'REMOVE_FROM_CART': {
      const { productIdentifier } = action.payload;
      console.log('Removing item from cart. Product Identifier:', productIdentifier);
      const updatedItems = state.items.items.filter(item => item.productIdentifier !== productIdentifier);
      return { ...state, items: { ...state.items, items: updatedItems } };
    }

    case 'INCREASE_QUANTITY':
      return {
        ...state,
        items: state.items.items.map(item =>
          item.productIdentifier === action.payload
            ? { ...item, productQuantity: item.productQuantity + 1 }
            : item
        ),
      };

    case 'REDUCE_QUANTITY':
      return {
        ...state,
        items: state.items.items.map(item =>
          item.productIdentifier === action.payload
            ? { ...item, productQuantity: Math.max(item.productQuantity - 1, 0) }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'SET_CART_ITEMS':
      console.log(action.payload)
      return {
        ...state,
        items: action.payload,
      };

    default:
      return state;
  }
};

export default cartReducer;
