import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OTPModal = ({ show, handleClose, email }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/User/verify-otp", {
        email,
        otp,
      });

      // Si l'OTP est valide, on stocke le token dans le localStorage
      const { token } = response.data;
      localStorage.setItem("token", token);

      // Rediriger l'utilisateur vers la page d'accueil
      navigate("/login");
    } catch (error) {
      console.error("Erreur OTP", error);
      alert("OTP incorrect ou expiré.");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Vérification du Code OTP</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleOTPSubmit}>
          <Form.Group controlId="otp">
            <Form.Label>Entrez le code OTP envoyé par email</Form.Label>
            <Form.Control
              type="text"
              value={otp}
              onChange={handleOTPChange}
              placeholder="Entrez OTP"
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Vérifier
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default OTPModal;