import { configureStore } from "@reduxjs/toolkit"
import usersReducer from "./slices/usersSlice"
import themeReducer from "./slices/themeSlice"

export const store = configureStore({
    reducer: {
        users: usersReducer,
        theme: themeReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
