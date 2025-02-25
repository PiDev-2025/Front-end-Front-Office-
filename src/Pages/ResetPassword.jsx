import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Container, Form, Row, Alert } from 'react-bootstrap';
import axios from 'axios';

const ResetPassword = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Password validation function
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            return 'Password must be at least 8 characters long';
        }
        if (!hasUpperCase) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!hasLowerCase) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!hasNumbers) {
            return 'Password must contain at least one number';
        }
        if (!hasSpecialChar) {
            return 'Password must contain at least one special character';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Input validation
        if (!password.trim() || !confirmPassword.trim()) {
            setError('All fields are required');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(`http://localhost:3001/api/reset-password/${token}`, { password });
            setMessage('Password has been reset successfully');
            setError('');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Error resetting password. Please try again.');
            setMessage('');
        }
    };

    return (
        <section className="min-h-[calc(100vh_-_88px)] flex items-center">
            <Container>
                <Row className='justify-content-center'>
                    <Col md={6} lg={5} xl={4}>
                        <div className="bg-white p-4 rounded-[20px] shadow-sm">
                            <h2 className='font-bold text__32 mb-3'>Reset Password</h2>
                            <p className='text__16 text-[#525252] mb-4'>Enter your new password.</p>
                            {message && <Alert variant="success" className="mb-4">{message}</Alert>}
                            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4" controlId="formBasicPassword">
                                    <Form.Label className="font-normal text__14 text-[#A3A3A3]">New Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                                    <Form.Label className="font-normal text__14 text-[#A3A3A3]">Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="font-medium text__14 bg-[#FAFAFA] h-[54px] rounded-[20px] px-3 outline-none shadow-none focus:outline-none focus:shadow-none border-[#F5F5F5] focus:border-[#F5F5F5] focus:bg-[#FAFAFA]"
                                    />
                                </Form.Group>
                                <button type="submit" className="inline-block w-full cursor-pointer text-center font-medium text__16 text-Mwhite !py-[15px] !px-[28px] bg-Mblue !border-Mblue btnClass transition-all duration-300 hover:opacity-90">
                                    Reset Password
                                </button>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ResetPassword;
