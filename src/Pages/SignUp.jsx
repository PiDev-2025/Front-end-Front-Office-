import React, { useState, useEffect } from "react";
import { Col, Container, Form, Row, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import OTPModal from "../Pages/OTPPopUp";

const SignUp = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    vehicleType: "",
    role: "Owner",
  });

  const [emailError, setEmailError] = useState("");
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState(""); // Store password in state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordForOTPModal, setPasswordForOTPModal] = useState(""); // New state for password
  const navigate = useNavigate();

  const validatePhoneNumber = (phone) => {
    const tunisianPhoneRegex = /^(2|3|4|5|7|9)\d{7}$/; // Vérifie si ça commence par 2,3,4,5,7,9 et fait 8 chiffres

    if (!phone) return "Phone number is required.";
    if (!tunisianPhoneRegex.test(phone)) return "Invalid phone number. Ex: 23456789";

    return ""; // Pas d'erreur
  };
  useEffect(() => {
    if (user.phone) {
      setPhoneError(validatePhoneNumber(user.phone));
    } else {
      setPhoneError(""); // Effacer l'erreur si le champ est vide
    }
  }, [user.phone]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email) => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      setIsEmailValid(false); // Update email validity
      setIsEmailUnique(false); // If invalid, it can't be unique
      return;
    }
    setIsEmailValid(true); // Email format is valid, now check uniqueness
    setEmailError(""); // Clear any previous format error

    try {
      const response = await axios.post(
        "http://localhost:3001/User/check-email",
        { email }
      );
      if (response.data.exists) {
        setEmailError("This email is already in use. Try logging in instead.");
        setIsEmailUnique(false);
      } else {
        setEmailError("");
        setIsEmailUnique(true);
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de l'email", error);
    }
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const hasUpperCase = /[A-Z]/;
    const hasLowerCase = /[a-z]/;
    const hasNumber = /[0-9]/;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/;

    if (!minLength.test(password)) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }
    if (!hasUpperCase.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule.";
    }
    if (!hasLowerCase.test(password)) {
      return "Le mot de passe doit contenir au moins une minuscule.";
    }
    if (!hasNumber.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre.";
    }
    if (!hasSymbol.test(password)) {
      return "Le mot de passe doit contenir au moins un symbole (@, #, !, ...).";
    }

    return ""; 
  };

  useEffect(() => {
    // Vérification des critères du mot de passe
    if (user.password) {
      setPasswordError(validatePassword(user.password));
    } else {
      setPasswordError(""); 
    }

    // Vérification de la correspondance password == confirmPassword
    if (user.confirmPassword) {
      if (user.password !== user.confirmPassword) {
        setConfirmPasswordError("The passwords do not match!");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setConfirmPasswordError("");
    }
  }, [user.password, user.confirmPassword]);

  useEffect(() => {
    // Check email format immediately when it changes
    if (user.email) {
      checkEmailExists(user.email);
    } else {
      setEmailError(""); // Clear error if email is empty
      setIsEmailValid(false);
      setIsEmailUnique(true); // Consider it unique if empty (for initial state)
    }
  }, [user.email]);

  useEffect(() => {
    const isValid =
      user.firstName &&
      user.lastName &&
      user.email &&
      isEmailValid && 
      isEmailUnique &&
      user.password &&
      user.confirmPassword &&
      user.phone &&
      user.role &&
      (user.role !== "Driver" || user.vehicleType);

    setIsFormValid(isValid);
  }, [
    user.firstName,
    user.lastName,
    user.email,
    isEmailValid,
    isEmailUnique,
    user.password,
    user.confirmPassword,
    user.phone,
    user.role,
    user.vehicleType,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));

    if (name === "email") {
      setIsEmailValid(validateEmail(value)); // Vérification rapide
      setIsEmailUnique(true); // Réinitialisation temporaire avant l'appel au serveur
    }

    if (name === "password") {
      setPassword(value); // Update password state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }
    const dataToSend = {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role: user.role,
    };

    if (user.role === "Driver") {
      // Only include vehicleType if role is Driver
      dataToSend.vehicleType = user.vehicleType;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/User/signup",
        dataToSend
      );
      if (response && response.status === 200) {
        // Succès: Ouvrir le modal OTP pour vérifier l'email
        setPasswordForOTPModal(password);
        setShowOTPModal(true);
      }
    }  catch (error) {
      toast.error(error.response?.data?.message || "An error occurred during registration.");
      console.error(error);
    }
  };

  return (
    <section>
      <Container>
        <Row className="align-items-center">
          <Col md={5}>
            <h2 className="font-bold text__32 mb-3">Welcome!</h2>
            <p className="text__16 text-[#525252]">
              Please enter your credentials to access your account.
            </p>

            <div className="my-4">
              <p className="text__14 mb-2">Need assistance?</p>
              <h5 className="font-bold text__20 text-Mblue">
                support@parkini.com
              </h5>
            </div>

            <p className="text__14 mb-2">Follow us on Social Media</p>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <a href="#" key={num}>
                  <img
                    src={`./../images/as (${num}).svg`}
                    alt={`Social ${num}`}
                  />
                </a>
              ))}
            </div>
          </Col>

          <Col md={7}>
            <Form
              onSubmit={handleSubmit}
              className="p-4 shadow rounded bg-light"
            >
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      First Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={user.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Last Name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={user.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email address"
                />
                {emailError && <p className="text-danger">{emailError}</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
                {passwordError && (
                  <p className="text-danger">{passwordError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
                {confirmPasswordError && (
                  <p className="text-danger">{confirmPasswordError}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Numéro de téléphone"
                />
                {phoneError && <p className="text-danger">{phoneError}</p>}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="select"
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                >
                  <option value="Driver">Driver</option>
                  <option value="Owner">Owner</option>
                </Form.Control>
              </Form.Group>

              {user.role === "Driver" && (
                <Form.Group className="mb-3">
                  <Form.Label>Vehicle Type<span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="select"
                    name="vehicleType"
                    value={user.vehicleType}
                    onChange={handleChange}
                  >
                    <option value="Big">Big</option>
                    <option value="Medium">Medium</option>
                    <option value="Small">Small</option>
                  </Form.Control>
                </Form.Group>
              )}

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="btn text-white"
                  style={{ backgroundColor: "#007bff" }}
                >
                  Sign Up
                </button>
              </div>
            </Form>
          </Col>
        </Row>

        <OTPModal
          show={showOTPModal}
          handleClose={() => setShowOTPModal(false)}
          email={user.email}
          password={passwordForOTPModal}
        />
      </Container>
    </section>
  );
};

export default SignUp;
