import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import HireDesigner from "./pages/HireDesigner/HireDesigner";
import LoginSignUp from "./components/User/LoginSignUp";
import Home from "./pages/Home";
import Setting from "./pages/Setting/Setting";
import Help from "./pages/HelpCenter/HelpCenter";
import Footer from "./components/Footer";
import Work from "./pages/Service/Work";
import DesignVista from "./pages/DesignVista";
import EditDesignerProfile from "./pages/Designer/EditDesignerProfile";
import DesignerProfile from "./pages/Designer/DesignerProfile";
import DesignerViewProfile from "./pages/Designer/DesignerViewProfile";
import HireDesignerProfile from "./pages/HireDesigner/HireDesignerProfile";
import EditHireDesignerProfile from "./pages/HireDesigner/EditHireDesignerProfile";
import { AuthProvider } from "./context/authContext.js";
import { UserRoleProvider } from "./context/UserRoleContext";

import "./App.css";
import useNavigationLoader from "./hooks/useNavigationLoader";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserRoleProvider>
          <AppContent />
        </UserRoleProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const loading = useNavigationLoader();

  return (
    <>
      {loading && <Preloader />}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design_vista" element={<DesignVista />} />
        <Route path="/hiredesigner" element={<HireDesigner />} />
        <Route path="/login_signUp" element={<LoginSignUp />} />
        <Route path="/work" element={<Work />} />
        <Route path="/designer-profile-view/:designerId" element={<DesignerViewProfile />} />
        <Route path="/designer-profile" element={<DesignerProfile />} />
        <Route path="/edit-designer-profile" element={<EditDesignerProfile />} />
        <Route path="/hire-designer-profile" element={<HireDesignerProfile />} />
        <Route path="/edit-hire-designer-profile" element={<EditHireDesignerProfile />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/help" element={<Help />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
