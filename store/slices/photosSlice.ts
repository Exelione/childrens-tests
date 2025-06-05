import { createSlice } from '@reduxjs/toolkit';

interface PhotosState {
  taskId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PhotosState = {
  taskId: null,
  loading: false,
  error: null,
};

const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    setTaskId(state, action) {
      state.taskId = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    resetState(state) {
      state.taskId = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setTaskId, setLoading, setError, resetState } = photosSlice.actions;

export default photosSlice.reducer;