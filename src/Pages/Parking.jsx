import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Col, Container, Form, Row } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";

const Parking = () => {
  const [parkings, setParkings] = useState([]);
  const [newParking, setNewParking] = useState({
    nameP: '',
    location: '',
    totalSpots: '',
    availableSpots: '',
    pricing: {
      perHour: '',
      perDay: '',
      perWeek: ''
    },
    vehicleTypes: [],
    images: []  // This will store the selected images
  });
  const [selectedParking, setSelectedParking] = useState(null);
  const [loading, setLoading] = useState(false); // To manage loading state
  const navigate = useNavigate();

  // Fetch parking list from the API
  useEffect(() => {
    setLoading(true); // Set loading state to true
    axios.get('http://localhost:3001/parkings/parkings', {
      headers: {

        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(response => {
        setParkings(response.data);
      })
      .catch(error => {
        console.error('Error fetching parkings:', error);
      })
      .finally(() => {
        setLoading(false); // Reset loading state
      });
  }, []);

  // Helper function to get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token"); // Ensure that the token is saved in localStorage after login
  };

  // Handle form change for new parking
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParking({
      ...newParking,
      [name]: value
    });
  };

  const handlePricingChange = (e) => {
    const { name, value } = e.target;
    setNewParking({
      ...newParking,
      pricing: {
        ...newParking.pricing,
        [name]: value
      }
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setNewParking({
      ...newParking,
      images: e.target.files // Store the selected files in the state
    });
  };

  // Submit new parking
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for missing or invalid inputs
    if (!newParking.nameP || !newParking.location || !newParking.totalSpots || !newParking.availableSpots) {
      alert('Please fill all the fields.');
      return;
    }

    if (newParking.totalSpots <= 0 || newParking.availableSpots < 0) {
      alert('Total spots and available spots must be valid positive numbers.');
      return;
    }

    // Create FormData object to send data as multipart/form-data
    const formData = new FormData();
    formData.append('nameP', newParking.nameP);
    formData.append('location', newParking.location);
    formData.append('totalSpots', newParking.totalSpots);
    formData.append('availableSpots', newParking.availableSpots);

    // Append pricing data
    formData.append('pricing', JSON.stringify(newParking.pricing));

    // Append vehicleTypes (if any)
    formData.append('vehicleTypes', JSON.stringify(newParking.vehicleTypes));

    // Append images
    for (let i = 0; i < newParking.images.length; i++) {
      formData.append('images', newParking.images[i]);
    }

    setLoading(true); // Set loading to true while the request is being sent

    // Make the API call with token in Authorization header
    axios.post('http://localhost:3001/parkings/submit', formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      }
    })
      .then(response => {
        alert('Parking request submitted!');
        setNewParking({}); // Clear form
        // Optionally, refetch parking list after submission
        axios.get('/api/parkings', {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }).then(response => {
          setParkings(response.data);
        });
      })
      .catch(error => {
        console.error('Error submitting parking:', error);
      })
      .finally(() => {
        setLoading(false); // Reset loading state after request
      });
  };

  // View parking details
  const viewParkingDetails = (id) => {
    navigate(`/parkings/parkings/${id}`);
  };

  // Delete parking request
  const deleteParking = (id) => {
    if (window.confirm("Are you sure you want to delete this parking?")) {
      setLoading(true); // Set loading state while deleting
      axios.delete(`/parkings/parkings/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })
        .then(response => {
          alert('Parking deleted!');
          setParkings(parkings.filter(parking => parking._id !== id)); // Update list
        })
        .catch(error => {
          console.error('Error deleting parking:', error);
        })
        .finally(() => {
          setLoading(false); // Reset loading state after deletion
        });
    }
  };

  // Handle selection of a parking spot
  const handleParkingSelect = (parking) => {
    setSelectedParking(parking); // Update selected parking
  };

  return (
    <Container>
      {/* Submit a new parking request */}
      <section className="my-5">
        <h2 className="font-bold text-3xl mb-4">Submit a New Parking Request</h2>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <input
                type="text"
                name="nameP"
                value={newParking.nameP}
                onChange={handleInputChange}
                placeholder="Parking Name"
                required
                className="form-control mb-3"
              />
            </Col>
            <Col md={6}>
              <input
                type="text"
                name="location"
                value={newParking.location}
                onChange={handleInputChange}
                placeholder="Location"
                required
                className="form-control mb-3"
              />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <input
                type="number"
                name="totalSpots"
                value={newParking.totalSpots}
                onChange={handleInputChange}
                placeholder="Total Spots"
                required
                className="form-control mb-3"
              />
            </Col>
            <Col md={6}>
              <input
                type="number"
                name="availableSpots"
                value={newParking.availableSpots}
                onChange={handleInputChange}
                placeholder="Available Spots"
                required
                className="form-control mb-3"
              />
            </Col>
          </Row>

          <h3 className="mt-4">Pricing</h3>
          <Row>
            <Col md={4}>
              <input
                type="number"
                name="perHour"
                value={newParking.pricing.perHour}
                onChange={handlePricingChange}
                placeholder="Per Hour"
                className="form-control mb-3"
              />
            </Col>
            <Col md={4}>
              <input
                type="number"
                name="perDay"
                value={newParking.pricing.perDay}
                onChange={handlePricingChange}
                placeholder="Per Day"
                className="form-control mb-3"
              />
            </Col>
            <Col md={4}>
              <input
                type="number"
                name="perWeek"
                value={newParking.pricing.perWeek}
                onChange={handlePricingChange}
                placeholder="Per Week"
                className="form-control mb-3"
              />
            </Col>
          </Row>

          {/* Image Upload */}
          <div className="mt-4">
            <label>Upload Images</label>
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="form-control mb-3"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </section>

      {/* List of parkings */}
      <section className="my-5">
      <h2 className="font-bold text-3xl mb-4">List of Parkings</h2>
      <Row>
        {parkings.length === 0 ? (
          <p>Aucun parking disponible.</p>
        ) : (
          parkings.map((parking) => (
            <Col key={parking._id} md={4} className="mb-4">
              <div
                className={`parking-item ${selectedParking && selectedParking._id === parking._id ? 'selected' : ''}`}
                onClick={() => handleParkingSelect(parking)}
                style={{ border: '1px solid #E5E5E5', padding: '20px', borderRadius: '8px' }}
              >
                <h3>{parking.nameP}</h3>
                <p>{parking.location}</p>
                <p>Total Spots: {parking.totalSpots}</p>
                <p>Available Spots: {parking.availableSpots}</p>
                <button onClick={() => viewParkingDetails(parking._id)} className="btn btn-info btn-sm">Details</button>
                <button onClick={() => deleteParking(parking._id)} className="btn btn-danger btn-sm ml-2">Delete</button>
              </div>
            </Col>
          ))
        )}
      </Row>
    </section>

      {/* Display selected parking details */}
      <section className="my-5">
        {selectedParking && (
          <div>
            <h2>Selected Parking:</h2>
            <p><strong>{selectedParking.nameP}</strong></p>
            <p>Location: {selectedParking.location}</p>
            <p>Total Spots: {selectedParking.totalSpots}</p>
            <p>Available Spots: {selectedParking.availableSpots}</p>
          </div>
        )}
      </section>
    </Container>
  );
};

export default Parking;
