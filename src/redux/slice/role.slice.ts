import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IRole } from "../../types/backend";
import { callFetchRole, callFetchRoleById } from "../../service/role.api";

interface IState {
  isFetching: boolean;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: IRole[];
  isFetchSingle: boolean;
  singleRole: IRole;
}
// First, create the thunk
export const fetchRole = createAsyncThunk(
  "permission/fetchRole",
  async ({ query }: { query: string }) => {
    const response = await callFetchRole(query);
    return response;
  }
);

export const fetchRoleById = createAsyncThunk(
  "resume/fetchRoleById",
  async (id: string) => {
    const response = await callFetchRoleById(id);
    return response;
  }
);

const initialState: IState = {
  isFetching: true,
  meta: {
    current: 1,
    pageSize: 10,
    pages: 0,
    total: 0,
  },
  result: [],
  isFetchSingle: false,
  singleRole: {
    _id: "",
    name: "",
    description: "",
    isActive: false,
    permissions: [],
  },
};

export const roleSlide = createSlice({
  name: "role",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    resetSingleRole: (state, _) => {
      state.singleRole = {
        _id: "",
        name: "",
        description: "",
        isActive: false,
        permissions: [],
      };
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchRole.pending, (state, _) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRole.rejected, (state, _) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRole.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchRoleById.pending, (state, _) => {
      state.isFetchSingle = true;
      state.singleRole = {
        _id: "",
        name: "",
        description: "",
        isActive: false,
        permissions: [],
      };
    });

    builder.addCase(fetchRoleById.rejected, (state, _) => {
      state.isFetchSingle = false;
      state.singleRole = {
        _id: "",
        name: "",
        description: "",
        isActive: false,
        permissions: [],
      };
    });

    builder.addCase(fetchRoleById.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetchSingle = false;
        state.singleRole = action.payload.data;
      }
      // Add user to the state array
    });
  },
});

export const { resetSingleRole } = roleSlide.actions;

export default roleSlide.reducer;
