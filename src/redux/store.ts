import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./slice/account.slice";
import companyReducer from "./slice/company.slice";
import userReducer from "./slice/user.slice";
import permissionReducer from "./slice/permission.slice";
import roleReducer from "./slice/role.slice";
import jobReducer from "./slice/job.slice";
import resumeReducer from "./slice/resume.slice";

export const store = configureStore({
  reducer: {
    account: accountReducer,
    company: companyReducer,
    user: userReducer,
    permission: permissionReducer,
    role: roleReducer,
    job: jobReducer,
    resume: resumeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
