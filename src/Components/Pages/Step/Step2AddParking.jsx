import React, { useState, useRef, useEffect } from "react";
import { Button, Row, Col, Card, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const Step2UploadImages = ({ formData, setFormData, handleSave }) => {
  const [images, setImages] = useState({
    face1: null,
    face2: null,
    face3: null,
    face4: null,
  });
  const [loading, setLoading] = useState({
    face1: false,
    face2: false,
    face3: false,
    face4: false,
  });
  const [currentFace, setCurrentFace] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRefs = {
    face1: useRef(null),
    face2: useRef(null),
    face3: useRef(null),
    face4: useRef(null),
  };
  const [videoStream, setVideoStream] = useState(null);
  

  // Démarrer la caméra
  const startCamera = async (face) => {
    setCurrentFace(face);
    setShowCamera(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Erreur d'accès à la caméra :", error);
    }
  };

  // Capturer une image
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // S'assurer que la vidéo est bien chargée
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error("Vidéo non encore chargée !");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    setImages((prev) => ({ ...prev, [currentFace]: imageUrl }));

    stopCamera();
  };

  // Arrêter la caméra
  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      setVideoStream(null);
    }
    setShowCamera(false);
  };

  useEffect(() => {
    const savedImages = JSON.parse(sessionStorage.getItem("savedImages"));
    if (savedImages) {
      setImages(savedImages);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("savedImages", JSON.stringify(images));
  }, [images]);

  const handleFileChange = async (event, face) => {
    const file = event.target.files[0];
    if (file) {
      setLoading((prev) => ({ ...prev, [face]: true }));

      // Affichage temporaire
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => ({ ...prev, [face]: reader.result }));
      };
      reader.readAsDataURL(file);

      // Envoi de l'image au backend
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await axios.post(
          "http://localhost:5000/api/upload",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // Stocker l'URL de l'image retournée par le backend
        setImages((prev) => ({ ...prev, [face]: res.data.imageUrl }));
      } catch (error) {
        console.error("Erreur lors de l'upload sur le backend", error);
      } finally {
        setLoading((prev) => ({ ...prev, [face]: false }));
      }
    }
  };

  const isFormValid = Object.values(images).every((img) => img !== null);

  return (
    <div className="step2-upload-container">
      <Row className="g-4">
        {["face1", "face2", "face3", "face4"].map((face, index) => (
          <Col key={face} xs={6} md={3}>
            <Card className="shadow-sm text-center p-3">
              <Card.Body>
                <h5 className="text-dark">Face {index + 1}</h5>
                <div className="image-preview mb-3 animate-preview">
                  {loading[face] ? (
                    <Spinner animation="border" variant="primary" />
                  ) : images[face] ? (
                    <img
                      src={images[face]}
                      alt={`Face ${index + 1}`}
                      className="preview-img"
                    />
                  ) : (
                    <span className="text-muted">Aucune image</span>
                  )}
                </div>
                <div className="d-flex flex-column gap-2">
                  <Button
                    style={{
                      backgroundColor: "#0056b3",
                      borderColor: "#004085",
                      color: "white",
                    }}
                    className="w-100"
                    onClick={() => startCamera(face)}
                  >
                    Take a Picture
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRefs[face]}
                    hidden
                    onChange={(e) => handleFileChange(e, face)}
                  />
                  <Button
                    style={{
                      backgroundColor: "#6c757d",
                      borderColor: "#545b62",
                      color: "white",
                    }}
                    className="w-100"
                    onClick={() => fileInputRefs[face].current.click()}
                  >
                    Upload a Photo
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-3 rounded-lg bg-black text-white font-medium border border-gray-900 hover:bg-gray-800 transition duration-200"
        >
          Save Parking
        </button>
      </div>

      {/* Modal Camera */}
      <Modal show={showCamera} onHide={stopCamera} centered>
        <Modal.Body className="text-center">
          <video
            ref={videoRef}
            autoPlay
            className="w-100"
            onCanPlay={() => videoRef.current.play()} // Lance la vidéo quand elle est prête
          ></video>
          <canvas ref={canvasRef} hidden></canvas>
          <Button
            style={{
              backgroundColor: "#c82333",
              borderColor: "#bd2130",
              color: "white",
            }}
            className="mt-3 w-100"
            onClick={captureImage}
          >
            Screenshot
          </Button>
        </Modal.Body>
      </Modal>

      {/* CSS */}
      <style>
        {`
        .animate-preview {
          height: 150px;
          border: 2px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease-in-out;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        `}
      </style>
    </div>
  );
};

export default Step2UploadImages;
