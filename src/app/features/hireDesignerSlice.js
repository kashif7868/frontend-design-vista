import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Thunks for async actions
export const createHireDesigner = createAsyncThunk(
  'hireDesigner/createHireDesigner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/hire/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const updateHireDesigner = createAsyncThunk(
  'hireDesigner/updateHireDesigner',
  async ({ hireDesignerId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:3000/api/hire/${hireDesignerId}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const getHireDesignerById = createAsyncThunk(
  'hireDesigner/getHireDesignerById',
  async (hireDesignerId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/hire/${hireDesignerId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue('Hire Designer not found');
      }
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

export const deleteHireDesigner = createAsyncThunk(
  'hireDesigner/deleteHireDesigner',
  async (hireDesignerId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/hire/${hireDesignerId}`);
      return hireDesignerId; // Return the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const hireDesignerSlice = createSlice({
  name: 'hireDesigner',
  initialState: {
    designer: null,
    designers: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createHireDesigner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createHireDesigner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designer = action.payload;
      })
      .addCase(createHireDesigner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateHireDesigner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateHireDesigner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designer = action.payload;
      })
      .addCase(updateHireDesigner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getHireDesignerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getHireDesignerById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designer = action.payload;
      })
      .addCase(getHireDesignerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteHireDesigner.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteHireDesigner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designer = null;
      })
      .addCase(deleteHireDesigner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default hireDesignerSlice.reducer;
