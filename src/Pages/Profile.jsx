import React, { useState, useEffect } from "react";
import { getMe } from "@/api/user";
// import { useAuthStore } from "@/store/auth"; // Only if needed for supplemental data

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const { email: emailFromStore } = useAuthStore.getState(); // Example if you need email from token as fallback

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getMe(); // getMe now returns response.data directly
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(
          err.message || "Failed to fetch profile. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
        <p className="mt-2">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4>Error loading profile</h4>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-danger"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    // Should ideally be caught by the error state if getMe fails
    return (
      <div className="alert alert-warning" role="alert">
        User profile data is not available.
      </div>
    );
  }

  // Fallback for avatar
  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'User')}&background=random&size=128`;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white text-center">
              <h3>User Profile</h3>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <img
                  src={avatarUrl}
                  alt={`${user.name || user.username}'s avatar`}
                  className="rounded-circle img-thumbnail"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Name:</strong> {user.name || "Not provided"}
                </li>
                <li className="list-group-item">
                  <strong>Username:</strong> {user.username || "Not provided"}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {user.email || "Not provided"}
                </li>
                <li className="list-group-item">
                  <strong>Phone:</strong> {user.phone || "Not provided"}
                </li>
                {/* Add other user details as needed */}
              </ul>
            </div>
            <div className="card-footer text-center">
              <button className="btn btn-outline-primary">
                Edit Profile (Not Implemented)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
