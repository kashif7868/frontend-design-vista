import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  designer: {
    basicInformation: {},
    onTheWeb: {}
  },
  designers: [],
  status: 'idle',
  error: null,
};

export const createHireDesigner = createAsyncThunk(
  'hireDesigner/createHireDesigner',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/hire/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem("hireDesignerProfile", JSON.stringify(response.data)); // Save to local storage
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
      localStorage.setItem("hireDesignerProfile", JSON.stringify(response.data)); // Save to local storage
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
      localStorage.setItem("hireDesignerProfile", JSON.stringify(response.data)); // Save to local storage
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
      localStorage.removeItem("hireDesignerProfile"); // Remove from local storage
      return hireDesignerId; // Return the ID
    } catch (error) {
      return rejectWithValue(error.response?.data || 'An error occurred');
    }
  }
);

const hireDesignerSlice = createSlice({
  name: 'hireDesigner',
  initialState,
  reducers: {
    appendHireDesignerProfileField: (state, action) => {
      const { name, value } = action.payload;
      if (state.designer) {
        if (name.includes('basicInformation')) {
          const key = name.split('.')[1];
          state.designer.basicInformation[key] = value;
        } else if (name.includes('onTheWeb')) {
          const key = name.split('.')[1];
          state.designer.onTheWeb[key] = value;
        } else {
          state.designer[name] = value;
        }
      }
    },
    clearProfile: (state) => {
      state.designer = initialState.designer;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem("hireDesignerProfile"); // Remove from local storage
    },
  },
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
      .addCase(deleteHireDesigner.fulfilled, (state) => {
        state.status = 'succeeded';
        state.designer = initialState.designer;
      })
      .addCase(deleteHireDesigner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { appendHireDesignerProfileField, clearProfile } = hireDesignerSlice.actions;
export default hireDesignerSlice.reducer;
