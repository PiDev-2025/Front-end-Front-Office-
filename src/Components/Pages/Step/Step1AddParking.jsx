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

const Step1AddParking = () => {
  const { isLoaded } = useGoogleMaps();
  const [location, setLocation] = useState({
    lat: 36.8065,
    lng: 10.1815,
  });
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState(null);
  const [characteristics, setCharacteristics] = useState([]);
  const [markers, setMarkers] = useState([
    {
      position: { lat: 36.8065, lng: 10.1815 },
      title: "Pickup Location",
    },
  ]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [rates, setRates] = useState([]);
  const [tariffType, setTariffType] = useState("");
  const [selectedvehicules, setSelectedvehicules] = useState([]);

  const vehiculeOptions = [
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
      label: "Utility vehicule",
      image:
        "https://res.cloudinary.com/dpcyppzpw/image/upload/v1740765729/voiture-de-livraison_nodnzh.png",
    },
  ];

  const handlevehiculeChange = (event) => {
    const value = event.target.value;
    setSelectedvehicules((prevSelected) => {
      if (prevSelected.includes(value)) {
        return prevSelected.filter((item) => item !== value); // Remove if already selected
      } else {
        return [...prevSelected, value]; // Add if not selected
      }
    });
  };

    const handleAddRate = (type, rate) => {
    setRates((prev) => [...prev, { duration: type, rate: rate }]);
  };

  const onLoad = (autoComplete) => {
    setAutocomplete(autoComplete);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocation(newLocation);
        setAddress(place.formatted_address);
        setMarkers([
          {
            position: newLocation,
            title: place.formatted_address,
          },
        ]);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form submission here, send to backend or state management
    console.log("Form Submitted with rates:", rates);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "address":
        setAddress(value);
        break;
      case "hourlyRate":
        setHourlyRate(value);
        break;
      default:
        break;
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-[20px]">
      <style>
        {`
      .font-weight-bold {
        font-weight: 600;
      }
      .text-dark {
        color: #333;
      }
      .h5 {
        font-size: 1.25rem;
      }
    `}
      </style>
      <Row className="justify-content-center">
        <Col lg={8} md={10}>
          <Form onSubmit={handleSubmit}>
            {/* Location */}
            <Form.Group className="mb-4">
              <Form.Label className="font-weight-bold text-dark h5">
                Pickup Location
              </Form.Label>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                <Form.Control
                  type="text"
                  placeholder="Enter your destination"
                  className="form-control-custom"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Autocomplete>
            </Form.Group>

            {/* Total Places */}
            <Form.Group className="mb-4">
              <Form.Label className="font-weight-bold text-dark h5">
                Total Number of Spots
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Total spots available"
                className="form-control-custom"
                onChange={handleChange}
              />
            </Form.Group>

            {/* Hourly Rate */}
            <Form.Group className="mb-4">
              <Form.Label className="font-weight-bold text-dark h5">
                Rate for 1 {tariffType === "" ? "Hour" : tariffType} (DT)
              </Form.Label>
              <Row className="align-items-center">
                <Col xs={9} md={9}>
                  <Form.Control
                    type="number"
                    placeholder={`Rate for 1 ${
                      tariffType === "" ? "Hour" : tariffType
                    }`}
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                </Col>
                <Col xs={3} md={3}>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100"
                    onClick={() => {
                      if (hourlyRate) {
                        handleAddRate(
                          tariffType === "" ? "Hour" : tariffType,
                          hourlyRate
                        );
                        setHourlyRate("");
                      }
                    }}
                  >
                    Add Tariff
                  </Button>
                </Col>
              </Row>
            </Form.Group>

            {/* Tariff Selection */}
            <Form.Group className="mb-4">
              <DropdownButton
                variant="outline-secondary"
                id="dropdown-basic-button"
                title={`Add another tariff (Current: ${tariffType || "Hour"})`}
                className="w-100"
                onSelect={(eventKey) => setTariffType(eventKey)}
              >
                <Dropdown.Item eventKey="Day">Tariff for a Day</Dropdown.Item>
                <Dropdown.Item eventKey="Week">Tariff for a Week</Dropdown.Item>
                <Dropdown.Item eventKey="Month">
                  Tariff for a Month
                </Dropdown.Item>
              </DropdownButton>
            </Form.Group>

            {/* Added Tariffs */}
            {rates.length > 0 && (
              <>
                <h5 className="mb-4 font-weight-bold text-dark">
                  Added Tariffs
                </h5>
                <ListGroup>
                  {rates.map((rate, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <span>
                        {rate.duration}: {rate.rate} Dt
                      </span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          // Remove the item from the list based on its index
                          const updatedRates = rates.filter(
                            (_, i) => i !== index
                          );
                          setRates(updatedRates);
                        }}
                      >
                        Cancel
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}

            {/* Features */}
            <Form.Group className="mt-4">
              <Form.Label className="font-weight-bold text-dark h5">
                Parking Features
              </Form.Label>
              <div>
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
                      if (checked) {
                        setCharacteristics((prev) => [...prev, value]);
                      } else {
                        setCharacteristics((prev) =>
                          prev.filter((item) => item !== value)
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            {/* vehicule Types */}
            <Form.Group className="mt-4">
              <Form.Label className="font-weight-bold text-dark h5">
                Suitable vehicule Types
              </Form.Label>
              <Row>
                {vehiculeOptions.map((option) => (
                  <Col key={option.value} xs={6} md={4} className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id={option.value}
                      label={
                        <div className="d-flex flex-column align-items-center">
                          <img
                            src={option.image}
                            alt={option.label}
                            style={{
                              width: "60px",
                              height: "60px",
                              marginBottom: "8px",
                            }}
                          />
                          <span>{option.label}</span>
                        </div>
                      }
                      value={option.value}
                      checked={selectedvehicules.includes(option.value)}
                      onChange={handlevehiculeChange}
                    />
                  </Col>
                ))}
              </Row>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Step1AddParking;
