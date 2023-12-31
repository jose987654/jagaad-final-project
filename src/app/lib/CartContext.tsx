'use client';
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'SET_IS_OPEN'; payload: boolean };

const CartContext = createContext<
  | {
      state: CartState;
      addToCart: (product: any, quantity: number) => void;
      removeFromCart: (productId: string) => void; // Added removeFromCart function
      setIsOpen: (isOpen: boolean) => void;
        } | undefined >(undefined);

const initialState: CartState = {
  cartItems:
    typeof window !== 'undefined' && window.localStorage.getItem('cartItems') !== null
      ? JSON.parse(window.localStorage.getItem('cartItems') as string).cartItems
      : [],
  isOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
  case 'ADD_TO_CART':
    const existingCartItemIndex = state.cartItems.findIndex(
      (item) => item.product.id === action.payload.product.id,
    );

    if (existingCartItemIndex !== -1) {
      const updatedCartItems = [...state.cartItems];
      updatedCartItems[existingCartItemIndex].quantity += action.payload.quantity;

      localStorage.setItem(
        'cartItems',
        JSON.stringify({
          ...state,
          cartItems: updatedCartItems,
        }),
      );

      return {
        ...state,
        cartItems: updatedCartItems,
      };
    } else {
      localStorage.setItem(
        'cartItems',
        JSON.stringify({
          ...state,
          cartItems: [...state.cartItems, action.payload],
        }),
      );
      return {
        ...state,
        cartItems: [...state.cartItems, action.payload],
      };
    }

  case 'REMOVE_FROM_CART':
    const itemToRemoveIndex = state.cartItems.findIndex(
      (item) => item.product.id === action.payload,
    );

    if (itemToRemoveIndex !== -1) {
      const updatedCartItems = [...state.cartItems];
      updatedCartItems.splice(itemToRemoveIndex, 1);

      localStorage.setItem(
        'cartItems',
        JSON.stringify({
          ...state,
          cartItems: updatedCartItems,
        }),
      );

      return {
        ...state,
        cartItems: updatedCartItems,
      };
    }

    return state;

  case 'SET_IS_OPEN':
    return {
      ...state,
      isOpen: action.payload,
    };
  default:
    return state;
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (product: any, quantity: number) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const setIsOpen = (isOpen: boolean) => {
    dispatch({ type: 'SET_IS_OPEN', payload: isOpen });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export function formatNumber(number: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(number);
}
