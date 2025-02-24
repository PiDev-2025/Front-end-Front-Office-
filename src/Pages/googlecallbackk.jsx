import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
const GoogleCallback = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
   
        console.log("Before setting:", localStorage.getItem('token'));
   
        if (token) {
            localStorage.setItem('token', token);
   
            console.log("After setting:", localStorage.getItem('token')); // Should show the token in localStorage
   
            login(token); // If needed to update context state
   
            navigate('/');
        }
   }, [navigate, login]);
   

    return (
        <div>
            <h2>Logging in...</h2>
        </div>
    );
};

export default GoogleCallback;
