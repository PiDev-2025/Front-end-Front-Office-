import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPModal = ({ show, handleClose, email, password }) => {
  console.log("Reçu dans OTPModal :", email, password);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();  // Correction : On va maintenant l'utiliser

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  const loginAfterOTP = async (password) => {
    try {
      const response = await axios.post("http://localhost:3001/User/users/login", {
        email,
        password,
      });

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Token enregistré :", token);

        navigate("/");  
      } else {
        toast.error("Erreur lors de l'authentification.");
      }
    } catch (error) {
      console.error("Erreur de connexion après OTP", error);
      toast.error("Connexion impossible.");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Envoi de la requête avec :", { email, otp });
  
    try {
      const response = await axios.post(
        "http://localhost:3001/User/verify-otp",
        { email, otp: String(otp) },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Envoi de la requête avec email et password :", { email, password });

      loginAfterOTP(password);

      //navigate("/about");
      
    } catch (error) {
      console.error("Erreur OTP", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "OTP incorrect ou expiré.");
    }
  };
  

/*
const handleOTPSubmit = async (e) => {
  e.preventDefault();

  console.log("Envoi de la requête avec :", { email, otp });

  try {
    const response = await axios.post(
      "http://localhost:3001/User/verify-otp",
      { email, otp: String(otp) },
      { headers: { "Content-Type": "application/json" } }
    );

    if (response.data.success) {
      console.log("OTP vérifié avec succès !");
      
      handleClose();  // Fermer la popup
      console.log("Popup fermée.");

      loginAfterOTP(); // Connexion après la vérification
    } else {
      toast.error("Échec de la vérification OTP.");
    }
  } catch (error) {
    console.error("Erreur OTP", error.response?.data || error.message);
    toast.error(error.response?.data?.message || "OTP incorrect ou expiré.");
  }
};
*/

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
