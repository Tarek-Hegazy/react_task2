import React, { useState, useEffect } from "react";
import { getMe } from "@/api/user";
import { Link } from "react-router-dom"; // For Edit Profile button if it navigates

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userData = await getMe();
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
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading profile...</span>
        </div>
        <p className="ms-3 fs-4">Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error Loading Profile!</h4>
          <p>{error}</p>
          <hr />
          <button
            onClick={() => window.location.reload()}
            className="btn btn-danger btn-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">Profile Not Available</h4>
          <p>User profile data could not be loaded.</p>
        </div>
      </div>
    );
  }

  const avatarUrl = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username || 'U')}&background=random&size=150&font-size=0.5&bold=true&color=fff`;

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="fw-light mb-0">User Profile</h2>
            </div>
            <div className="card-body p-4 p-md-5">
              <div className="row align-items-center">
                <div className="col-md-4 text-center mb-4 mb-md-0">
                  <img
                    src={avatarUrl}
                    alt={`${user.name || user.username}'s avatar`}
                    className="img-fluid rounded-circle shadow"
                    style={{ width: "150px", height: "150px", objectFit: "cover", border: "3px solid #fff" }}
                  />
                </div>
                <div className="col-md-8">
                  <h3 className="mb-3 text-primary">{user.name || "N/A"}</h3>
                  <p className="text-muted fs-5">@{user.username || "N/A"}</p>
                  <hr/>
                  <ul className="list-unstyled fs-5">
                    <li className="mb-2">
                      <i className="bi bi-envelope-fill text-secondary me-2"></i> {/* Bootstrap Icon example */}
                      <strong>Email:</strong> {user.email || "Not provided"}
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-telephone-fill text-secondary me-2"></i>
                      <strong>Phone:</strong> {user.phone || "Not provided"}
                    </li>
                    {/* Add more details as needed, e.g., registration date */}
                    {user.createdAt && (
                       <li className="mb-2">
                        <i className="bi bi-calendar-check-fill text-secondary me-2"></i>
                        <strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-footer text-center py-3 bg-light">
              {/* Link to an edit profile page if you implement it */}
              <button className="btn btn-outline-primary btn-lg" disabled>
                <i className="bi bi-pencil-square me-2"></i>Edit Profile (Future Feature)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
