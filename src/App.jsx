import React from 'react'
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from 'react';

import DefaultLayout from './Layouts/DefaultLayout';

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

const App = () => {
  let location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])
  return (
    <Routes>
      <Route path="" element={<DefaultLayout />}>
        <Route index element={<Homepage />} />
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
      </Route>
    </Routes>
  )
}

export default App
