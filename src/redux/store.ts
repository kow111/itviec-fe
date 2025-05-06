import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/account.slice";
import companyReducer from "./slice/company.slice";
import userReducer from "./slice/user.slice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    company: companyReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
