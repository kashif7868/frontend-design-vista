import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: {
    profilePicture: '',
    user: '',
    basicInformation: {
      firstName: '',
      lastName: '',
      companyName: '',
      country: '',
      city: '',
      portfolioUrl: ''
    },
    onTheWeb: {
      facebookUsername: '',
      linkedinUsername: '',
      githubUsername: ''
    }
  },
  status: 'idle',
  error: null
};

const createFormData = (profile) => {
  const formData = new FormData();
  formData.append("profilePicture", profile.profilePicture);
  formData.append("user", profile.user);
  formData.append("basicInformation[firstName]", profile.basicInformation.firstName);
  formData.append("basicInformation[lastName]", profile.basicInformation.lastName);
  formData.append("basicInformation[companyName]", profile.basicInformation.companyName);
  formData.append("basicInformation[country]", profile.basicInformation.country);
  formData.append("basicInformation[city]", profile.basicInformation.city);
  formData.append("basicInformation[portfolioUrl]", profile.basicInformation.portfolioUrl);
  formData.append("onTheWeb[facebookUsername]", profile.onTheWeb.facebookUsername);
  formData.append("onTheWeb[linkedinUsername]", profile.onTheWeb.linkedinUsername);
  formData.append("onTheWeb[githubUsername]", profile.onTheWeb.githubUsername);
  return formData;
};

export const createHireDesignerProfile = createAsyncThunk(
  'hireDesigner/createHireDesignerProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = createFormData(profileData);
      const response = await axios.post('http://localhost:3000/api/hire/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getHireDesignerById = createAsyncThunk(
  'hireDesigner/getHireDesignerById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/hire/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateHireDesignerProfile = createAsyncThunk(
  'hireDesigner/updateHireDesignerProfile',
  async ({ id, profileData }, { rejectWithValue }) => {
    try {
      const formData = createFormData(profileData);
      const response = await axios.patch(`http://localhost:3000/api/hire/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteHireDesignerProfile = createAsyncThunk(
  'hireDesigner/deleteHireDesignerProfile',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/hire/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const hireDesignerSlice = createSlice({
  name: 'hireDesigner',
  initialState,
  reducers: {
    appendHireDesignerProfileField: (state, action) => {
      const { name, value } = action.payload;
      const keys = name.split('.');
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = Array.isArray(acc[key]) ? [...acc[key], value] : value;
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, state.profile);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHireDesignerProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createHireDesignerProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(createHireDesignerProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getHireDesignerById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getHireDesignerById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(getHireDesignerById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateHireDesignerProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateHireDesignerProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(updateHireDesignerProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteHireDesignerProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteHireDesignerProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = initialState.profile;
      })
      .addCase(deleteHireDesignerProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { appendHireDesignerProfileField } = hireDesignerSlice.actions;

export default hireDesignerSlice.reducer;
