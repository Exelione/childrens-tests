import { createAsyncThunk } from '@reduxjs/toolkit';
import { setTaskId, setLoading, setError } from '../slices/photosSlice';

export const uploadPhotos = createAsyncThunk<
  string, // возвращаемое значение — task_id
  File[],   // аргумент — массив файлов
  { rejectValue: string }
>(
  'photos/uploadPhotos',
  async (files, thunkAPI) => {
    thunkAPI.dispatch(setLoading(true));
    thunkAPI.dispatch(setError(null));
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('https://sirius-draw-test-94500a1b4a2f.herokuapp.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      if (!data.task_id) {
        throw new Error('Нет task_id в ответе сервера');
      }

      // сохраняем task_id в слайс
      thunkAPI.dispatch(setTaskId(data.task_id));

      return data.task_id;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      thunkAPI.dispatch(setError(message));
      return thunkAPI.rejectWithValue(message);
    } finally {
      thunkAPI.dispatch(setLoading(false));
    }
  }
);