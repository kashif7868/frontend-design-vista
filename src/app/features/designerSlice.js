import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  designers: [],
  profile: {
    profilePicture: "",
    user: "",
    basicInformation: {
      firstName: "",
      lastName: "",
      categoryName: "",
      country: "",
      city: "",
      portfolioUrl: "",
    },
    onTheWeb: {
      facebookUsername: "",
      linkedinUsername: "",
      githubUsername: "",
    },
    aboutMe: {
      sectionTitle: "",
      description: "",
    },
    workExperience: {
      companyName: "",
      position: "",
      startingFrom: "",
      endingIn: "",
      details: "",
    },
  },
  status: "idle",
  error: null,
};

const createFormData = (profile) => {
  const formData = new FormData();
  formData.append("profilePicture", profile.profilePicture);
  formData.append("user", profile.user);
  formData.append(
    "basicInformation[firstName]",
    profile.basicInformation.firstName
  );
  formData.append(
    "basicInformation[lastName]",
    profile.basicInformation.lastName
  );
  formData.append(
    "basicInformation[categoryName]",
    profile.basicInformation.categoryName
  );
  formData.append(
    "basicInformation[country]",
    profile.basicInformation.country
  );
  formData.append("basicInformation[city]", profile.basicInformation.city);
  formData.append(
    "basicInformation[portfolioUrl]",
    profile.basicInformation.portfolioUrl
  );
  formData.append(
    "onTheWeb[facebookUsername]",
    profile.onTheWeb.facebookUsername
  );
  formData.append(
    "onTheWeb[linkedinUsername]",
    profile.onTheWeb.linkedinUsername
  );
  formData.append("onTheWeb[githubUsername]", profile.onTheWeb.githubUsername);
  formData.append("aboutMe[sectionTitle]", profile.aboutMe.sectionTitle);
  formData.append("aboutMe[description]", profile.aboutMe.description);
  formData.append(
    "workExperience[companyName]",
    profile.workExperience.companyName
  );
  formData.append("workExperience[position]", profile.workExperience.position);
  formData.append(
    "workExperience[startingFrom]",
    profile.workExperience.startingFrom
  );
  formData.append("workExperience[endingIn]", profile.workExperience.endingIn);
  formData.append("workExperience[details]", profile.workExperience.details);
  return formData;
};

export const createDesignerProfile = createAsyncThunk(
  "designer/createDesignerProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const formData = createFormData(profileData);
      const response = await axios.post(
        "http://localhost:3000/api/designers/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("designerProfile", JSON.stringify(response.data)); // Save to local storage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getDesignerById = createAsyncThunk(
  "designer/getDesignerById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/designers/${userId}`
      );
      localStorage.setItem("designerProfile", JSON.stringify(response.data)); // Save to local storage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateDesignerProfile = createAsyncThunk(
  "designer/updateDesignerProfile",
  async ({ designerId, profileData }, { rejectWithValue }) => {
    try {
      const formData = createFormData(profileData);
      const response = await axios.patch(
        `http://localhost:3000/api/designers/${designerId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("designerProfile", JSON.stringify(response.data)); // Save to local storage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteDesignerProfile = createAsyncThunk(
  "designer/deleteDesignerProfile",
  async (designerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/designers/${designerId}`
      );
      localStorage.removeItem("designerProfile"); // Remove from local storage
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const designerSlice = createSlice({
  name: "designer",
  initialState,
  reducers: {
    appendDesignerProfileField: (state, action) => {
      const { name, value } = action.payload;
      const keys = name.split(".");
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = Array.isArray(acc[key]) ? [...acc[key], value] : value;
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, state.profile);
      localStorage.setItem("designerProfile", JSON.stringify(state.profile)); // Save to local storage
    },
    clearProfile: (state) => {
      state.profile = initialState.profile;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("designerProfile"); // Remove from local storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDesignerProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createDesignerProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        localStorage.setItem("designerProfile", JSON.stringify(state.profile)); // Save to local storage
      })
      .addCase(createDesignerProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getDesignerById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDesignerById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        localStorage.setItem("designerProfile", JSON.stringify(state.profile)); // Save to local storage
      })
      .addCase(getDesignerById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateDesignerProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDesignerProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.profile = action.payload;
        localStorage.setItem("designerProfile", JSON.stringify(state.profile)); // Save to local storage
      })
      .addCase(updateDesignerProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteDesignerProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteDesignerProfile.fulfilled, (state) => {
        state.status = "succeeded";
        state.profile = initialState.profile;
        localStorage.removeItem("designerProfile"); 
      })
      .addCase(deleteDesignerProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { appendDesignerProfileField, clearProfile } = designerSlice.actions;

export default designerSlice.reducer;
