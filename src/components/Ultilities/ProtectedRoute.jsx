import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, requiredScope }) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
        // Redirect to the login page if no token is found
        return <Navigate to="/" replace />;
    }

    try {
        // Decode the JWT token
        const decodedToken = jwtDecode(token);

        // Check if the token's scope matches the required scope
        if (!decodedToken || decodedToken.scope !== requiredScope) {
            // Redirect to a "not authorized" page or home page if not allowed
            return <Navigate to="/access-denied" replace />

        }

    } catch (error) {
        console.error("Failed to decode token:", error);
        return <Navigate to="/login" replace />;
    }

    // Render the child components if authorized
    return children;
};

export default ProtectedRoute;
