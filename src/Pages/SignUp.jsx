import React, { useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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
    vehicleType: "Big",
    role: "Driver",
  });

  const [showOTPModal, setShowOTPModal] = useState(false);
  const navigate = useNavigate();

  // Capture des entrées utilisateur
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérification du mot de passe
    if (user.password !== user.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/User/signup", {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        password: user.password,
        phone: user.phone,
        vehicleType: user.vehicleType,
        role: user.role,
      });

      setShowOTPModal(true);
    } catch (error) {
      toast.error("Erreur d'inscription");
      console.error(error);
    }
  };
  return (
    <section>
      <Container>
        <Row className="justify-between">
          <Col className="mb-4 md:mb-0" md={4}>
            <h2 className="font-bold text__32 mb-3">Test!</h2>
            <p className="text__16 text-[#525252]">
              Please enter your credentials to access your account.
            </p>

            <div className="my-4">
              <p className="text__14 mb-2">Anything your need </p>
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
          </Col>
          <Form onSubmit={handleSubmit}>
            <Col md={7}>
              <Row>
                <Col className="col-6">
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
                <Col className="col-6">
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
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email address"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
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
                  <Form.Label>Vehicle Type</Form.Label>
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

              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </Col>
          </Form>
        </Row>
        <OTPModal
          show={showOTPModal}
          handleClose={() => setShowOTPModal(false)}
          email={user.email}
          password={user.password} // Passer aussi le mot de passe
        />

        <br />
        <br />
        <br />
      </Container>
    </section>
  );
};

export default SignUp;
