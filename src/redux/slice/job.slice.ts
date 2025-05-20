import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { callFetchJob } from "../../service/job.api";
import { IJob } from "../../types/backend";

interface IState {
  isFetching: boolean;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: IJob[];
}
// First, create the thunk
export const fetchJob = createAsyncThunk(
  "job/fetchJob",
  async ({ query }: { query: string }) => {
    const response = await callFetchJob(query);
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

export const jobSlide = createSlice({
  name: "job",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchJob.pending, (state, _) => {
      state.isFetching = true;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchJob.rejected, (state, _) => {
      state.isFetching = false;
      // Add user to the state array
      // state.courseOrder = action.payload;
    });

    builder.addCase(fetchJob.fulfilled, (state, action) => {
      if (action.payload && action.payload.data) {
        state.isFetching = false;
        state.meta = action.payload.data.meta;
        state.result = action.payload.data.result;
      }
      // Add user to the state array

      // state.courseOrder = action.payload;
    });
  },
});

export const {} = jobSlide.actions;

export default jobSlide.reducer;
