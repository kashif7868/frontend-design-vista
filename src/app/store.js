import { configureStore } from "@reduxjs/toolkit";
import worksReducer from "./features/worksSlice";
import designerReducer from "./features/designerSlice";
import hireDesignerReducer from "./features/hireDesignerSlice"; 
import coverBannerReducer from "./features/coverBannerSlice";
import hireMessageSliceReducer from "./features/hireMessageSlice";

const store = configureStore({
  reducer: {
    works: worksReducer,
    designer: designerReducer,
    hireDesigner: hireDesignerReducer,
    coverBanner: coverBannerReducer,
    hireMessageSlice: hireMessageSliceReducer,
  },
});

export default store;
