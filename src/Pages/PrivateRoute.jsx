import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
