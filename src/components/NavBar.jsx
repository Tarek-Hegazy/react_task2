import { useAuthStore } from "@/store/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { token, clear } = useAuthStore();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          MyBlog App
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {token && ( // Show "My Posts" only if logged in
              <li className="nav-item">
                <Link className="nav-link" to="/posts">
                  My Posts
                </Link>
              </li>
            )}
            {token && ( // Show "Profile" only if logged in
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  Profile
                </Link>
              </li>
            )}
            {token && (
              <li className="nav-item">
                <Link className="nav-link" to="/posts/create">
                  Create Post
                </Link>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto"> {/* Changed me-auto to ms-auto for right alignment */}
            {token ? (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light" // Changed to button style
                  onClick={() => {
                    clear();
                    navigate("/login");
                  }}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Log Out {/* Bootstrap Icon example */}
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item me-2"> {/* Added margin for spacing */}
                  <Link className="btn btn-outline-light" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-light" to="/register"> {/* More prominent register button */}
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
