import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import MapComponent from '../../Map/GoogleMap';

const SecLocation = () => {
    const [location, setLocation] = useState({
        lat: 36.8065,  // Default to Tunisia coordinates
        lng: 10.1815
    });

    const [markers, setMarkers] = useState([
        {
            position: { lat: 36.8065, lng: 10.1815 },
            title: "Pickup Location"
        }
    ]);

    return (
        <div className="bg-white p-6 rounded-[20px]">
            <Row>
                <Col lg={6}>
                    <Form.Group className="mb-4">
                        <Form.Label>Pickup Location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter pickup location"
                            className="form-control-custom"
                        />
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
                    />
                </Col>
            </Row>
        </div>
    );
};

export default SecLocation;
