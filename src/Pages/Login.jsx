import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../AuthContext"; // Make sure to import the hook
import { jwtDecode } from "jwt-decode"; // Correct import

const Login = () => {
  // State for form fields and OTP message popup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Login, 2: OTP
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use useContext to access AuthContext


  // Handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Send POST request to backend for login
      const response = await axios.post("http://localhost:3001/User/login", {
        email,
        password,
      });
      console.log(response.data.message);

      // Check if the backend response contains the OTP sent message
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      setStep(2); // Switch to OTP verification step
    } catch (error) {
      // Handle error from backend
      console.error("Error during login:", error);
      toast.error(
        "Erreur : " +
          (error.response?.data?.message || "Problème de connexion"),
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }
    setLoading(false); // Reset loading state after the login attempt
  };

  const handleFaceLogin = () => {
    navigate("/login/face");
  };
  // Handle OTP verification

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/User/login-verify-otp",
        {
          email,
          otp,
        }
      );

      if (!response.data || !response.data.token) {
        throw new Error("Réponse invalide du serveur");
      }
      console.log(response.data.token);

      // Decode the token to get user data
      const decodedToken = jwtDecode(response.data.token); // Correct function name
      console.log(decodedToken); // Check the decoded token structure

      // Use the login function from context to store the token
      login(response.data.token);
      toast.success("Connexion réussie !", {
        position: "top-right",
        autoClose: 3000,
      });

      // Check if the user is an Admin and redirect
      if (decodedToken.role === "Admin") {
        window.location.href = "http://localhost:5173/"; // Full external URL
      } else {
        navigate("/"); // Default internal navigation
      }
    } catch (error) {
      toast.error(
        "Erreur : " +
          (error.response?.data?.message || "Problème de vérification OTP"),
        {
          position: "top-right",
          autoClose: 5000,
        }
      );
    }

    setLoading(false); // Reset loading state after OTP verification attempt
  };
  return (
    <section>
      <Container>
        <Row className="justify-between">
          <Col className="mb-4 md:mb-0" md={4}>
            <h2 className="font-bold text__32 mb-3">Welcome Back!</h2>
            <p className="text__16 text-[#525252]">
              Please enter your credentials to access your account.
            </p>

            <div className="my-4">
              <p className="text__14 mb-2">Anything you need</p>
              <h5 className="font-bold text__20 text-Mblue">
                Parkini@Parkini.com
              </h5>
            </div>

            <p className="text__14 mb-2">Social Media</p>
            <div className="flex items-center gap-2">
              <a href="#!">
                <img src="./../images/as (1).svg" alt="" />
              </a>
              <a href="#!">
                <img src="./../images/as (2).svg" alt="" />
              </a>
              <a href="#!">
                <img src="./../images/as (3).svg" alt="" />
              </a>
              <a href="#!">
                <img src="./../images/as (4).svg" alt="" />
              </a>
              <a href="#!">
                <img src="./../images/as (5).svg" alt="" />
              </a>
            </div>

            {/* Google Login Button */}
            <div className="mt-3">
              <a
                href="http://localhost:3001/auth/google"
                className="flex items-center gap-2 bg-white shadow-md px-4 py-2 rounded-[20px] border border-gray-300 cursor-pointer"
              >
                <img
                  src="./../images/google.png"
                  alt="Google Icon"
                  className="w-5 h-5"
                />
                <span className="text__14 text-gray-700">
                  Login with Google
                </span>
              </a>
            </div>
            {/* Face Recognition Login Button */}
            <div className="text-center mb-4">
              <button
                onClick={handleFaceLogin}
                className="inline-block cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue hover:bg-Mdarkblue !border-Mblue btnClass md:w-auto w-full transition-colors"
              >
                Face Recognition Login
              </button>
            </div>
          </Col>

          <Col md={7}>
            {step === 1 ? (
              <Form onSubmit={handleLogin}>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label className="font-normal text__14 text-[#A3A3A3]">
                    Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email address"
                    className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} // Update email state
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput2"
                >
                  <Form.Label className="font-normal text__14 text-[#A3A3A3]">
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} // Update password state
                  />
                </Form.Group>

                {/* Reset Password Link */}
                <NavLink to="/forgot-password">
                  <div className="text-right mb-3">
                    <a href="#!" className="text-[#ED544E] text__14">
                      Forgot Password?
                    </a>
                  </div>
                </NavLink>

                {/* Connect Button with Sign Up Link */}
                <div className="d-flex justify-content-between">
                  <button
                    type="submit"
                    className="inline-block cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue !border-Mblue btnClass md:w-auto w-full"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "login"}
                  </button>

                  {/* Sign Up Link */}
                  <NavLink to="/sign-up">
                    <a className="text-[blue] text__14 self-center">Sign Up</a>
                  </NavLink>
                </div>
              </Form>
            ) : (
              <Form onSubmit={handleVerifyOtp}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </Form.Group>

                <button type="submit" className="btn btn-success w-100">
                  Verify OTP !
                </button>
              </Form>
            )}
          </Col>
        </Row>
      </Container>

      <ToastContainer />
    </section>
  );
};

export default Login;
