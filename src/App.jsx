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
import { FavoritesProvider } from './context/FavoritesContext';
import NotFound from './Pages/NotFound';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Profile from './Pages/profile';
import ParkingRequestForm from '../src/Pages/ParkingForm';
import Step2UploadImages from '../src/Components/Pages/Step/Step2AddParking';
import FaceAuth from "./Components/FaceAuth/FaceAuth";
import ParkingDetails from "./Pages/ParkingDetails";
import SecLocation from './Components/Pages/Step/Location';
import ParkingPlan from "./Pages/viualisation3D"
import EmployeeProfile from "./Pages/EmployeeProfile"
import ParkingListOwner from "./Pages/ParkingListOwner"; // Assurez-vous du bon chemin d'importation
import UserReservations from './Components/Pages/UserReservations';
import PrivateRoute from './Pages/PrivateRoute';

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

                   <FavoritesProvider>
        <AuthProvider>
        <ToastContainer />
          <Routes>
            <Route path="/" element={<DefaultLayout />}>
              <Route index element={<Homepage />} />
              <Route path="parkingPlan" element={<ParkingPlan />} />
        
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
              <Route path="profile" element={<Profile />} />
              <Route path="parkings/:id" element={<ParkingDetails />} />
              <Route path="login/face" element={<FaceAuth/>} />
              <Route path="*" element={<NotFound />} />
              <Route path="location" element={<SecLocation />} />
              <Route path="ScanQr" element={<EmployeeProfile />} />
              <Route path="my-parkings" element={<ParkingListOwner />} />
              <Route path="ParkingRequestForm" element={<ParkingRequestForm />} />
              <Route 
                path="/mes-reservations" 
                element={
                  <PrivateRoute>
                    <UserReservations />
                  </PrivateRoute>
                } 
              />
            </Route>
          </Routes>
        </AuthProvider>
        </FavoritesProvider>

      </SearchProvider>
    </GoogleMapsProvider>
  );
};

export default App;

