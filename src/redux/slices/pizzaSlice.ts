import axios from 'axios';
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../store.ts';

type Pizza = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  sizes: number[];
  types: number[];
}

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface PizzaSliceState {
  items: Pizza[];
  status: Status;
}

const initialState: PizzaSliceState = {
  items: [],
  status: Status.LOADING, //loading | success | error
};

export const getPizzas = createAsyncThunk<Pizza[], Record<string, string>>('pizza/getPizzasStatus', async (params) => {
  const { order, sortBy, category, search, currentPage } = params;
  const { data } = await axios.get<Pizza[]>(
    `https://664bbd9935bbda10987df002.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
  );

  return data;
});

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPizzas.pending, (state) => {
        state.status = Status.LOADING;
        state.items = []
        // console.log('Идет отправка!');
      })
      .addCase(getPizzas.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = Status.SUCCESS;
        // console.log('Все ОК!');
      })
      .addCase(getPizzas.rejected, (state) => {
        state.status = Status.ERROR;
        state.items = []
        // console.log('Ошибка!');
      })
  },

});

export const selectPizzaData = (state: RootState) => state.pizza;

export const { setItems } = pizzaSlice.actions;

export default pizzaSlice.reducer;
