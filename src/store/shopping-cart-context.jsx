import { createContext, useState, useReducer } from "react";
import { DUMMY_PRODUCTS } from '../dummy-products.js';

const initialValue = {
  items: [],
  addItemToCart: () => { },
  updateCartItemQuantity: () => { }
}

const shoppingCartReducer = (state, action) => {


  switch (action.type) {
    case 'ADD_ITEM':
      const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === action.payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
        updatedItems.push({
          id: action.payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };

    case 'UPDATE_QUANTITY': {
      const updatedItems = [...state.items];
      const { productId, amount } = action.payload
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
      };
    }
    default:
      return state
  }
}

export const CartContext = createContext(initialValue)

const CartContextProvider = ({ children }) => {

  const [shoppingCartState, shoppingCartDispatch] = useReducer(shoppingCartReducer, initialValue)

  function handleAddItemToCart(id) {
    shoppingCartDispatch({ type: 'ADD_ITEM', payload: id })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    shoppingCartDispatch({
      type: 'UPDATE_QUANTITY', payload: {
        productId: productId,
        amount: amount
      }
    })
  }


  const contextValue = {
    items: shoppingCartState.items,
    addItemToCart: handleAddItemToCart,
    updateCartItemQuantity: handleUpdateCartItemQuantity
  }
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContextProvider
