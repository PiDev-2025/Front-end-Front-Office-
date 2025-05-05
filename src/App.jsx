import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import DefaultLayout from "./Layouts/DefaultLayout";
import Homepage from "./Pages/Homepage";
import HowItworks from "./Pages/HowItworks";
import Booking from "./Pages/Booking";
import Careers from "./Pages/Careers";
import About from "./Pages/About";
import JobDetail from "./Pages/JobDetail";
import Blog from "./Pages/Blog";
import BlogDetail from "./Pages/BlogDetail";
import Contact from "./Pages/Contact";
import Privacy from "./Pages/Privacy";
import Terms from "./Pages/Terms";
import Faq from "./Pages/Faq";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ForgotPassword from "./Pages/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import { AuthProvider } from "./AuthContext";
import GoogleCallback from "./Pages/googlecallbackk";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import NotFound from "./Pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapboxProvider } from "./context/MapboxContext";
import { NotificationProvider } from "./Pages/Notifications/notificationContext";

import Profile from "./Pages/profile";
import ParkingRequestForm from "../src/Pages/ParkingForm";
import Step2UploadImages from "../src/Components/Pages/Step/Step2AddParking";
import FaceAuth from "./Components/FaceAuth/FaceAuth";
import ParkingDetails from "./Pages/ParkingDetails";
import SecLocation from "./Components/Pages/Step/Location";
import EmployeeProfile from "./Pages/EmployeeProfile";
import ParkingListOwner from "./Pages/ParkingListOwner"; // Assurez-vous du bon chemin d'importation
import UserReservations from "./Components/Pages/UserReservations";
import PrivateRoute from "./Pages/PrivateRoute";
import ParkingPlan from "./Pages/Editeur/viualisation3D";
import ParkingLiveView3D from "./Pages/VisualizeParkingAvailibility/ParkingLiveView";
import Visualize3d from "./Pages/VisualizeParkingAvailibility/Visualize3d";

import ListSubsDriver from "./Pages/ListSubsDriver";
import PeakHoursDashboard from "./Pages/PeakHoursDashboard";

import OwnerReservations from "./Components/Pages/OwnerReservations";
import OwnerClaims from "./Components/Pages/OwnerClaims";
import SubscriptionPlans from "./Pages/Subscriptions";
import SubscriptionDetails from "./Pages/SubscriptionDetails";
import SubscriptionPayment from "./Pages/SubscriptionPayment";

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
    <MapboxProvider>
      <SearchProvider>
        <FavoritesProvider>
          <AuthProvider>
            <NotificationProvider>
              <ToastContainer />
              <Routes>
                <Route path="/" element={<DefaultLayout />}>
                  <Route index element={<Homepage />} />
                  <Route path="parkingPlan/:id" element={<ParkingPlan />} />
                  <Route
                    path="parkingLiveView/:id"
                    element={<ParkingLiveView3D />}
                  />
                  <Route path="visualize3d/:id" element={<Visualize3d />} />
                  <Route
                    path="step2/:parkingId"
                    element={<Step2UploadImages />}
                  />
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
                  <Route
                    path="reset-password/:token"
                    element={<ResetPassword />}
                  />
                  <Route path="google/callback" element={<GoogleCallback />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="parkings/:id" element={<ParkingDetails />} />
                  <Route path="login/face" element={<FaceAuth />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path="location" element={<SecLocation />} />
                  <Route path="ScanQr" element={<EmployeeProfile />} />
                  <Route path="my-parkings" element={<ParkingListOwner />} />
                  <Route
                    path="ParkingRequestForm"
                    element={<ParkingRequestForm />}
                  />

                  <Route
                    path="/my-subscriptions"
                    element={<ListSubsDriver />}
                  />
                  <Route
                    path="/TodaysPrediction"
                    element={<PeakHoursDashboard />}
                  />
                  <Route
                    path="OwnerReservations"
                    element={<OwnerReservations />}
                  />
                  <Route path="OwnerClaims" element={<OwnerClaims />} />
                  <Route path="subscriptions" element={<SubscriptionPlans />} />
                  <Route
                    path="subscription-details/:planId"
                    element={<SubscriptionDetails />}
                  />
                  <Route
                    path="subscription-payment/:planId"
                    element={<SubscriptionPayment />}
                  />
                  <Route path="UserClaims" element={<UserClaims />} />
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
            </NotificationProvider>
          </AuthProvider>
        </FavoritesProvider>
      </SearchProvider>
    </MapboxProvider>
  );
};

export default App;
