import { jwtDecode } from "jwt-decode";
import { APIClient } from ".";
import { useAuthStore } from "../store/auth";

export const getMe = async () => {
  try {
    const { token } = useAuthStore.getState();
    if (!token) {
      // This error should ideally be caught by AuthGurd or similar before calling getMe
      // Or the component calling getMe should handle the user not being authenticated
      throw new Error("No token found. User is not authenticated.");
    }

    // Decode token to get user ID. Ensure your token payload has 'id'.
    const decodedToken = jwtDecode(token);
    const id = decodedToken?.id;

    if (!id) {
      // This indicates an issue with token structure or content
      throw new Error("User ID (id) not found in token payload.");
    }

    // APIClient is expected to handle Authorization header if needed via interceptors
    const response = await APIClient.get(`/users/${id}`);
    // Assuming API returns user data in response.data
    return response.data; // Return only the data part of the response
  } catch (error) {
    // Log the error for debugging
    console.error(
      "Error fetching user profile:",
      error.response?.data || error.message || error
    );

    // Re-throw a new error with a user-friendly message or the error from the server
    // This allows the calling component to display a meaningful error to the user
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred while fetching the profile.");
    }
  }
};
