import { createSlice } from '@reduxjs/toolkit';
import countryCodes from '../../data/countriesCode.json';

const initialState = {
  selectedDesigner: null,
  formData: {
    location: '',
    companyName: '',
    phoneCountryCode: countryCodes[0].code,
    phoneNumber: '',
    interviewDate: '',
    note: '',
    message: '',
  },
  errors: {},
};

const hireMessageSlice = createSlice({
  name: 'hireMessage',
  initialState,
  reducers: {
    setSelectedDesigner(state, action) {
      state.selectedDesigner = action.payload;
    },
    setFormData(state, action) {
      state.formData = { ...state.formData, ...action.payload };
    },
    setErrors(state, action) {
      state.errors = action.payload;
    },
    resetHireMessage(state) {
      state.selectedDesigner = null;
      state.formData = {
        location: '',
        companyName: '',
        phoneCountryCode: countryCodes[0].code,
        phoneNumber: '',
        interviewDate: '',
        note: '',
        message: '',
      };
      state.errors = {};
    },
  },
});

export const { setSelectedDesigner, setFormData, setErrors, resetHireMessage } = hireMessageSlice.actions;

export default hireMessageSlice.reducer;
