import { configureStore } from "@reduxjs/toolkit";
import workReducer from "./features/workSlice";
import designerReducer from "./features/designerSlice";
import hireDesignerReducer from "./features/hireDesignerSlice"; 
import coverBannerReducer from "./features/coverBannerSlice";
import hireMessageSliceReducer from "./features/hireMessageSlice";

const store = configureStore({
  reducer: {
    works: workReducer,
    designer: designerReducer,
    hireDesigner: hireDesignerReducer,
    coverBanner: coverBannerReducer,
    hireMessageSlice: hireMessageSliceReducer,
  },
});

export default store;
