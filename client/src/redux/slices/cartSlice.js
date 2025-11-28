// slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const calculateTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cardId: null,
    items: [],
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;

      if (payload._id && payload.items) {

        state.cardId = action.payload._id;
        state.items = action.payload.items;
      } else {
        const isItem = state.items.some((item) => item.productId._id === action.payload._id);
        if (!isItem) {
          state.items = [{ productId: payload, quantity: 1 }, ...state.items];
        }
        else {
          toast.warning('item already present in the cart');
        }
      }

      state.total = calculateTotal(state.items);
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload);
      if (item) {
        item.quantity += 1;
        state.total = calculateTotal(state.items);
      }
    },

    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item._id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.total = calculateTotal(state.items);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.productId._id !== action.payload);
      state.total = calculateTotal(state.items);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
