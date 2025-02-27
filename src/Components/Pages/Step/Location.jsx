import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Autocomplete } from '@react-google-maps/api';
import MapComponent from '../../Map/GoogleMap';
import { useGoogleMaps } from '../../../context/GoogleMapsContext';

const SecLocation = () => {
    const { isLoaded } = useGoogleMaps();
    const [location, setLocation] = useState({
        lat: 36.8065,
        lng: 10.1815
    });
    const [address, setAddress] = useState('');
    const [autocomplete, setAutocomplete] = useState(null);
    const [markers, setMarkers] = useState([
        {
            position: { lat: 36.8065, lng: 10.1815 },
            title: "Pickup Location"
        }
    ]);

    const onLoad = (autoComplete) => {
        setAutocomplete(autoComplete);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                setLocation(newLocation);
                setAddress(place.formatted_address);
                setMarkers([{
                    position: newLocation,
                    title: place.formatted_address
                }]);
            }
        }
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-[20px]">
            <Row>
                <Col lg={6}>
                    <Form.Group className="mb-4">
                        <Form.Label>Pickup Location</Form.Label>
                        <Autocomplete
                            onLoad={onLoad}
                            onPlaceChanged={onPlaceChanged}
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter your destination"
                                className="form-control-custom"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </Autocomplete>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Pickup Date</Form.Label>
                        <Form.Control
                            type="date"
                            className="form-control-custom"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Return Date</Form.Label>
                        <Form.Control
                            type="date"
                            className="form-control-custom"
                        />
                    </Form.Group>
                </Col>
                <Col lg={6}>
                    <MapComponent 
                        center={location}
                        markers={markers}
                        zoom={15}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default SecLocation;
