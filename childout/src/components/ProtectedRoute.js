// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { UserId } from '../App';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(UserId);

    if (!user.token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default ProtectedRoute;