import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  bannerImage: localStorage.getItem("bannerImage") || null,
  coverImageId: localStorage.getItem("coverImageId") || null,
  status: "idle",
  error: null,
};

// Thunks for CRUD operations
export const createCoverImage = createAsyncThunk(
  "coverBanner/createCoverImage",
  async ({ userId, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("user", userId);
      formData.append("image", imageFile);

      const response = await axios.post(
        "http://localhost:3000/api/cover/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Upload error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCoverImageById = createAsyncThunk(
  "coverBanner/fetchCoverImageById",
  async (coverImageId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cover/${coverImageId}`);
      return response.data;
    } catch (error) {
      console.error("Fetch error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "coverBanner/updateCoverImage",
  async ({ coverImageId, imageFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.patch(
        `http://localhost:3000/api/cover/${coverImageId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Update error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCoverImage = createAsyncThunk(
  "coverBanner/deleteCoverImage",
  async (coverImageId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3000/api/cover/${coverImageId}`);
      return { coverImageId };
    } catch (error) {
      console.error("Delete error:", error.response.data);
      return rejectWithValue(error.response.data);
    }
  }
);

const coverBannerSlice = createSlice({
  name: "coverBanner",
  initialState,
  reducers: {
    setBannerImage(state, action) {
      state.bannerImage = action.payload;
    },
    clearBannerImage(state) {
      state.bannerImage = null;
      state.coverImageId = null;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCoverImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCoverImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bannerImage = action.payload.image;
        state.coverImageId = action.payload.id;
        localStorage.setItem("bannerImage", action.payload.image);
        localStorage.setItem("coverImageId", action.payload.id);
      })
      .addCase(createCoverImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteCoverImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCoverImage.fulfilled, (state) => {
        state.status = "succeeded";
        state.bannerImage = null;
        state.coverImageId = null;
        localStorage.removeItem("bannerImage");
        localStorage.removeItem("coverImageId");
      })
      .addCase(deleteCoverImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCoverImage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCoverImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bannerImage = action.payload.image;
        localStorage.setItem("bannerImage", action.payload.image);
      })
      .addCase(updateCoverImage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCoverImageById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCoverImageById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bannerImage = action.payload.image;
        state.coverImageId = action.payload.id;
        localStorage.setItem("bannerImage", action.payload.image);
        localStorage.setItem("coverImageId", action.payload.id);
      })
      .addCase(fetchCoverImageById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setBannerImage, clearBannerImage, setError } = coverBannerSlice.actions;

export default coverBannerSlice.reducer;
