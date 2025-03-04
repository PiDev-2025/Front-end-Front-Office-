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

const Step1AddParking = () => {
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

  // Fonction de gestion du changement de type de véhicule
  const handleVehicleChange = (event) => {
    const value = event.target.value;
    setVehicleType((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleAddRate = (type, rate) => {
    setPricing((prev) => [...prev, { duration: type, rate }]);
    setHourlyRate(undefined); // Réinitialiser le tarif après ajout
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

    // Prepare the form data
    const formData = new FormData();
    formData.append("name", "Parking Name"); // Remplacez avec votre champ de saisie de nom
    formData.append("location", JSON.stringify(location));
    formData.append("totalSpots", totalSpots); // Ajout de la valeur du nombre de places

    // Pricing should have keys like 'hourly', 'daily', 'weekly', 'monthly'
    const pricingData = {};
    pricing.forEach((rate) => {
      if (rate.duration === "Hour") pricingData.hourly = rate.rate;
      else if (rate.duration === "Day") pricingData.daily = rate.rate;
      else if (rate.duration === "Week") pricingData.weekly = rate.rate;
      else if (rate.duration === "Month") pricingData.monthly = rate.rate;
    });

    formData.append("pricing", JSON.stringify(pricingData)); // Ajouter les tarifs au formulaire

    formData.append("vehicleType", JSON.stringify(vehicleType)); // Ajout des types de véhicules sélectionnés
    formData.append("features", JSON.stringify(features));

    try {
      const response = await axios.post(
        "http://localhost:3001/api/addParkingRequest",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure token is stored in localStorage
          },
        }
      );

      console.log("Parking added successfully:", response.data);
      alert("Parking added successfully!");
    } catch (error) {
      console.error("Error adding parking:", error);
      alert("Error adding parking. Please try again.");
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-[20px]">
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Pickup Location</Form.Label>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <Form.Control
              type="text"
              placeholder="Enter location"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Autocomplete>
        </Form.Group>
        <Form.Group>
          <Form.Label>Total Number of Spots</Form.Label>
          <Form.Control
            type="number"
            value={totalSpots}
            onChange={handleTotalSpotsChange}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            {pricing.length === 0
              ? `Rate for 1 ${tariffType || "Hour"} (DT)`
              : "Add Another Tariff"}
          </Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="number"
                placeholder="Rate"
                value={hourlyRate || ""}
                onChange={(e) => setHourlyRate(e.target.value)}
                required={pricing.length === 0}
              />
            </Col>
            <Col>
              <Button
                onClick={() => handleAddRate(tariffType || "Hour", hourlyRate)}
              >
                Add Tariff
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <DropdownButton
          title={`Add another tariff (${tariffType || "Hour"})`}
          onSelect={(eventKey) => setTariffType(eventKey)}
        >
          <Dropdown.Item eventKey="Day">Tariff for a Day</Dropdown.Item>
          <Dropdown.Item eventKey="Week">Tariff for a Week</Dropdown.Item>
          <Dropdown.Item eventKey="Month">Tariff for a Month</Dropdown.Item>
        </DropdownButton>
        {pricing.length > 0 &&
          pricing.map((rate, index) => (
            <ListGroup.Item key={index}>
              {rate.duration}: {rate.rate} Dt
            </ListGroup.Item>
          ))}
        <Form.Group>
          <Form.Label>Parking Features</Form.Label>
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
            />
          ))}
        </Form.Group>
        <Form.Group>
          <Form.Label>Suitable Vehicle Types</Form.Label>
          <Row>
            {vehicleOptions.map((option) => (
              <Col key={option.value} xs={6} md={4}>
                <Form.Check
                  type="checkbox"
                  id={option.value}
                  label={
                    <img src={option.image} alt={option.label} width="60" />
                  }
                  value={option.value}
                  checked={vehicleType.includes(option.value)}
                  onChange={handleVehicleChange}
                />
              </Col>
            ))}
          </Row>
        </Form.Group>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Step1AddParking;
