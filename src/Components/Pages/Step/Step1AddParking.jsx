import React, { useState } from "react";
import {
  Col,
  Form,
  Row,
  Button,
  ListGroup,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { Autocomplete } from "@react-google-maps/api";
import { useGoogleMaps } from "../../../context/GoogleMapsContext";
import axios from "axios"; // You can use axios or fetch for the API call
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaMoneyBillAlt,
  FaCar,
  FaBuilding,
  FaTrashAlt,
} from "react-icons/fa"; // Import icons

const OwnerAddPaking = () => {
  const { isLoaded } = useGoogleMaps();
  const [location, setLocation] = useState({ lat: undefined, lng: undefined });
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [features, setFeatures] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [tariffType, setTariffType] = useState(undefined);
  const [vehicleType, setVehicleType] = useState([]);
  const [hourlyRate, setHourlyRate] = useState(undefined);
  const [totalSpots, setTotalSpots] = useState("");
  const navigate = useNavigate();


  const vehicleOptions = [
    {
      value: "Moto",
      label: "Motorcycle",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765730/moto_xdypx2.png",
    },
    {
      value: "Citadine",
      label: "City Car",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-ville_ocwbob.png",
    },
    {
      value: "Berline / Petit SUV",
      label: "Sedan / Small SUV",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/wagon-salon_bj2j1s.png",
    },
    {
      value: "Familiale / Grand SUV",
      label: "Family / Large SUV",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-familiale_rmgclg.png",
    },
    {
      value: "Utilitaire",
      label: "Utility Vehicle",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png",
    },
  ];

  const handleTotalSpotsChange = (e) => {
    setTotalSpots(e.target.value);
  };

  const handleVehicleChange = (event) => {
    const value = event.target.value;
    setVehicleType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleAddRate = (type, rate) => {
    // Vérifiez si le tarif pour le type existe déjà dans la liste
    const existingRateIndex = pricing.findIndex(
      (pricingRate) => pricingRate.duration === type
    );

    if (existingRateIndex !== -1) {
      // Si le tarif existe déjà, modifiez-le
      const updatedPricing = [...pricing];
      updatedPricing[existingRateIndex] = { duration: type, rate }; // Mettez à jour le tarif existant
      setPricing(updatedPricing);
    } else {
      // Si le tarif n'existe pas, ajoutez-le à la liste
      setPricing((prev) => [...prev, { duration: type, rate }]);
    }
    setHourlyRate(undefined); // Réinitialiser le tarif après ajout ou modification
  };

  const handleRemoveRate = (index) => {
    const updatedPricing = pricing.filter((_, i) => i !== index);
    setPricing(updatedPricing);
  };

  const onLoad = (autoComplete) => setAutocomplete(autoComplete);

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setAddress(place.formatted_address);
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address || !location.lat || !location.lng) {
      alert("Please select a valid location.");
      return;
    }
    if (pricing.length === 0) {
      alert("At least one tariff is required.");
      return;
    }

    // Préparation des données du formulaire
    const formData = new FormData();
    formData.append("name", "Parking Name"); // Remplacez avec votre champ de saisie de nom
    formData.append("location", JSON.stringify(location));
    formData.append("totalSpots", totalSpots);

    const pricingData = {};
    pricing.forEach((rate) => {
      if (rate.duration === "Hour") pricingData.hourly = rate.rate;
      else if (rate.duration === "Day") pricingData.daily = rate.rate;
      else if (rate.duration === "Week") pricingData.weekly = rate.rate;
      else if (rate.duration === "Month") pricingData.monthly = rate.rate;
    });

    formData.append("pricing", JSON.stringify(pricingData));
    formData.append("vehicleType", JSON.stringify(vehicleType));
    formData.append("features", JSON.stringify(features));

    try {
      const response = await axios.post(
        "http://localhost:3001/api/addParkingRequest",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const parkingId = response.data.parking._id;
      console.log("voila l'id", parkingId);
      console.log("Parking added successfully:", response.data);
      navigate(`/step2/${parkingId}`);
    } catch (error) {
      console.error("Error adding parking:", error);
      alert("Error adding parking. Please try again.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div
      className="container mx-auto my-10 p-6 bg-white rounded-lg shadow-xl"
      style={{ paddingLeft: "50px" }}
    >
      <h2 className="text-center text-2xl font-bold mb-6 text-blue-600">
        Add Your Parking Spot Request
      </h2>
      <p className="text-center mb-6 text-gray-600">
        Submit your parking request here!
      </p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-5">
          <Form.Label className="font-semibold d-flex align-items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />{" "}
            {/* L'icône à gauche */}
            Pickup Location <span className="text-danger">*</span>
          </Form.Label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="p-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4"
            />
          </Autocomplete>
        </Form.Group>

        <Form.Group className="mb-5">
          <Form.Label className="font-semibold d-flex align-items-center">
            <FaBuilding className="mr-2 text-green-500" />{" "}
            {/* L'icône à gauche */}
            Total Number of Spots <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="number"
            value={totalSpots}
            onChange={handleTotalSpotsChange}
            required
            className="p-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-3/4"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="font-semibold d-flex align-items-center">
            <FaMoneyBillAlt className="mr-2 text-yellow-500" />
            Rate for 1 {tariffType || "Hour"} (DT){" "}
            <span className="text-danger">*</span>
          </Form.Label>
          <Row className="align-items-center">
            <Col xs={7}>
              <Form.Control
                type="number"
                placeholder="Rate"
                value={hourlyRate || ""}
                onChange={(e) => setHourlyRate(e.target.value)}
                required={pricing.length === 0}
                className="p-2 border-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </Col>
            <Col xs={2} className="d-flex justify-content-end">
              <Button
                variant="primary"
                onClick={() => handleAddRate(tariffType || "Hour", hourlyRate)}
                className="w-100 p-2 rounded-md"
              >
                Add Tariff
              </Button>
            </Col>
          </Row>
        </Form.Group>

        <DropdownButton
          title={`Add another tariff (${tariffType || "Hour"})`}
          onSelect={(eventKey) => setTariffType(eventKey)}
          className="mb-3 w-3/4"
        >
          <Dropdown.Item eventKey="Hour">Tariff for an Hour</Dropdown.Item>
          <Dropdown.Item eventKey="Day">Tariff for a Day</Dropdown.Item>
          <Dropdown.Item eventKey="Week">Tariff for a Week</Dropdown.Item>
          <Dropdown.Item eventKey="Month">Tariff for a Month</Dropdown.Item>
        </DropdownButton>

        {pricing.length > 0 && (
          <ListGroup className="mb-5" style={{ maxWidth: "500px" }}>
            {" "}
            {/* Limite la largeur de la liste */}
            {pricing.map((rate, index) => (
              <ListGroup.Item
                key={index}
                className="d-flex justify-content-between align-items-center p-3 mb-2 bg-gray-100 rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  <span className="font-semibold mr-2">{rate.duration}</span>:{" "}
                  {rate.rate} DT
                </div>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveRate(index)}
                  className="p-1 rounded-circle"
                  style={{ color: "red" }} // Couleur statique rouge pour l'icône
                >
                  <FaTrashAlt />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}

        <Form.Group className="mb-5">
          <Form.Label className="font-semibold d-flex align-items-center">
            <FaCar className="mr-2 text-blue-500" /> {/* L'icône à gauche */}
            Suitable Vehicle Types <span className="text-danger">*</span>
          </Form.Label>
          <Row>
            {vehicleOptions.map((option) => (
              <Col key={option.value} xs={6} md={4} lg={3}>
                <Form.Check
                  type="checkbox"
                  id={option.value}
                  label={
                    <div className="flex items-center">
                      <img
                        src={option.image}
                        alt={option.label}
                        width="40"
                        className="mr-2"
                      />
                      {option.label}
                    </div>
                  }
                  value={option.value}
                  checked={vehicleType.includes(option.value)}
                  onChange={handleVehicleChange}
                  className="max-w-full" // Ensures it stays within the available width
                />
              </Col>
            ))}
          </Row>
        </Form.Group>

        <Form.Group className="mb-5">
          <Form.Label className="font-semibold d-flex align-items-center">
            <FaBuilding className="mr-2 text-green-500" />{" "}
            {/* L'icône à gauche */}
            Parking Features <span className="text-danger">*</span>
          </Form.Label>
          {[
            "Indoor Parking",
            "Underground Parking",
            "Unlimited Entrances & Exits",
            "Extension Available",
          ].map((feature, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              label={feature}
              value={feature}
              onChange={(e) => {
                const { checked, value } = e.target;
                setFeatures((prev) =>
                  checked
                    ? [...prev, value]
                    : prev.filter((item) => item !== value)
                );
              }}
              className="mb-2"
            />
          ))}
        </Form.Group>

        <div className="flex justify-end items-center space-x-3">
          <span className="text-gray-500 opacity-70">Go to Step 2</span>
          <Button
            variant="success"
            type="submit"
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 shadow-md"
          >
            Continue
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default OwnerAddPaking;
