import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Login = () => {
  const handleFaceLogin = () => {
    // Redirect to face detection page
    window.location.href = "http://127.0.0.1:5500/src/webcam/index.html";
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

          <Col md={7}>
            {/* Face Recognition Login Button */}
            <div className="text-center mb-4">
              <button
                onClick={handleFaceLogin}
                className="inline-block cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue hover:bg-Mdarkblue !border-Mblue btnClass md:w-auto w-full transition-colors"
              >
                Face Recognition Login
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-4">
              <div className="flex-1 border-t border-[#F5F5F5]"></div>
              <span className="px-4 text-[#A3A3A3] text__14">OR</span>
              <div className="flex-1 border-t border-[#F5F5F5]"></div>
            </div>

            {/* Email Input */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label className="font-normal text__14 text-[#A3A3A3]">
                Email
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Email address"
                className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
              />
            </Form.Group>

            {/* Password Input */}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label className="font-normal text__14 text-[#A3A3A3]">
                Password
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
              />
            </Form.Group>

            {/* Forgot Password */}
            <div className="text-right mb-3">
              <a href="#!" className="text-[#ED544E] text__14">
                Forgot Password?
              </a>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between">
              <button className="inline-block cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue hover:bg-Mdarkblue !border-Mblue btnClass md:w-auto w-full transition-colors">
                Connect
              </button>

              <NavLink to="/sign-up" className="self-center">
                <span className="text-Mblue hover:text-Mdarkblue text__14 transition-colors">
                  Sign Up
                </span>
              </NavLink>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;

