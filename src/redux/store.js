import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice"
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";
import { menuApi } from "./api/menuApi";
import { expenseApi } from "./api/expenseApi";
import { businessApi } from "./api/businessApi";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart: cartSlice,
        user: userSlice,
        notification: notificationSlice,
        [menuApi.reducerPath]: menuApi.reducer,
        [expenseApi.reducerPath]: expenseApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(menuApi.middleware, expenseApi.middleware, businessApi.middleware),

    devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
