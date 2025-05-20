import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchCompany } from "../../service/company.api";
import { ICompany } from "../../types/backend";

interface IState {
  isFetching: boolean;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: ICompany[];
}
// First, create the thunk
export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async ({ query }: { query: string }) => {
    const response = await callFetchCompany(query);
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
};

export const companySlide = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchCompany.pending, (state, _) => {
      state.isFetching = true;
    });

    builder.addCase(fetchCompany.rejected, (state, _) => {
      state.isFetching = false;
    });

    builder.addCase(fetchCompany.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
    });
  },
});

export const {} = companySlide.actions;

export default companySlide.reducer;
