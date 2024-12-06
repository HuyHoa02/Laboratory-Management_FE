import axios from "axios";

// Function to refresh the access token
export const refreshToken = async (refreshToken) => {
    try {
        // Send a request to refresh the token
        const response = await axios.post(
            "http://localhost:8080/api/laboratory/auth/refreshToken",
            { token: refreshToken }
        );

        // Return the new access token
        return response.data.result.token;
    } catch (error) {
        throw new Error("Failed to refresh token.");
    }
};
