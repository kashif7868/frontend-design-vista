import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks
export const fetchWorks = createAsyncThunk(
  'works/fetchWorks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:3000/api/work');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addWork = createAsyncThunk(
  'works/addWork',
  async ({ workData, designerId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', workData.title);
      formData.append('category', workData.category);
      formData.append('designer', designerId);
      if (workData.image) {
        formData.append('image', workData.image);
      }

      const response = await axios.post('http://localhost:3000/api/work/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editWork = createAsyncThunk(
  'works/editWork',
  async ({ id, updatedWork, designerId }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', updatedWork.title);
      formData.append('category', updatedWork.category);
      formData.append('designer', designerId);
      if (updatedWork.image) {
        formData.append('image', updatedWork.image);
      }

      const response = await axios.patch(`http://localhost:3000/api/work/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteWork = createAsyncThunk(
  'works/deleteWork',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/work/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getAllDesignerByWork = createAsyncThunk(
  'works/fetchAllDesigners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/designers/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const worksSlice = createSlice({
  name: 'works',
  initialState: {
    works: [],
    designers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorks.fulfilled, (state, action) => {
        state.loading = false;
        state.works = action.payload;
      })
      .addCase(fetchWorks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWork.fulfilled, (state, action) => {
        state.loading = false;
        state.works.push(action.payload);
      })
      .addCase(addWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(editWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(editWork.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.works.findIndex((work) => work.id === action.payload.id);
        if (index !== -1) {
          state.works[index] = action.payload;
        }
      })
      .addCase(editWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteWork.fulfilled, (state, action) => {
        state.loading = false;
        state.works = state.works.filter((work) => work.id !== action.payload);
      })
      .addCase(deleteWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllDesignerByWork.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllDesignerByWork.fulfilled, (state, action) => {
        state.loading = false;
        state.designers = action.payload;
      })
      .addCase(getAllDesignerByWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default worksSlice.reducer;
