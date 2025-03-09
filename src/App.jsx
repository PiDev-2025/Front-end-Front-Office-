import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import DefaultLayout from "./Layouts/DefaultLayout";
import Homepage from './Pages/Homepage';
import HowItworks from './Pages/HowItworks';
import Booking from './Pages/Booking';
import Careers from './Pages/Careers';
import About from './Pages/About';
import JobDetail from './Pages/JobDetail';
import Blog from './Pages/Blog';
import BlogDetail from './Pages/BlogDetail';
import Contact from './Pages/Contact';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import Faq from './Pages/Faq';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import { AuthProvider } from './AuthContext';
import GoogleCallback from './Pages/googlecallbackk';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import { SearchProvider } from './context/SearchContext';
import NotFound from './Pages/NotFound';
import Profile from './Pages/profile';
import OwnerAddPaking from '../src/Components/Pages/Step/Step1AddParking';
import Step2UploadImages from '../src/Components/Pages/Step/Step2AddParking';
import FaceAuth from "./Components/FaceAuth/FaceAuth";
import ParkingDetails from "./Pages/parkingDetail";
import ParkingPlan from "./Pages/viualisation3D"


const App = () => {
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      // Store token in local storage
      localStorage.setItem("token", token);
    }
  }, []);
  return (
    <GoogleMapsProvider>


      <SearchProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Homepage />} />
              <Route path="parkingPlan" element={<ParkingPlan />} />
              <Route path="ownerAddPaking" element={<OwnerAddPaking />} />
              <Route path="step2/:parkingId" element={<Step2UploadImages />} />
              <Route path="how-it-works" element={<HowItworks />} />
              <Route path="booking" element={<Booking />} />
              <Route path="careers" element={<Careers />} />
              <Route path="about" element={<About />} />
              <Route path="job/detail" element={<JobDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/detail" element={<BlogDetail />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
              <Route path="faq" element={<Faq />} />
              <Route path="login" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="reset-password/:token" element={<ResetPassword />} />
              <Route path="google/callback" element={<GoogleCallback />} />
                              <Route path="/parkings/:id" element={<ParkingDetails />} />

              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/login/face" element={<FaceAuth/>} />
            </Route>
          </Routes>
        </AuthProvider>
      </SearchProvider>
    </GoogleMapsProvider>
  );
};

export default App;

