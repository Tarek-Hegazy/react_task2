import React, { useState, useEffect } from "react";
import { getUserPostsAPI } from "@/api/post";
import { Link } from "react-router-dom";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await getUserPostsAPI();
        // Ensure data is always an array, even if API returns single object for one post or null
        setPosts(Array.isArray(data) ? data : (data ? [data] : []));
        setError(null);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch posts. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading posts...</span>
        </div>
        <p className="ms-3 fs-4">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error Loading Posts!</h4>
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

  if (posts.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="alert alert-info col-md-6 offset-md-3" role="alert">
          <h4 className="alert-heading">No Posts Yet!</h4>
          <p>You haven't created any posts. Why not create your first one now?</p>
          <hr />
          <Link to="/posts/create" className="btn btn-primary btn-lg">
            Create Your First Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Your Posts</h2>
        <Link to="/posts/create" className="btn btn-success btn-lg shadow-sm">
          <i className="bi bi-plus-circle-fill me-2"></i> {/* Example using Bootstrap Icons */}
          Create New Post
        </Link>
      </div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {posts.map((post) => (
          <div key={post.id} className="col">
            <div className="card h-100 shadow-sm hover-shadow-lg"> {/* Added hover effect class if you have one */}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-truncate">{post.title}</h5>
                <p className="card-text flex-grow-1" style={{ minHeight: '60px' }}>
                  {post.content
                    ? post.content.substring(0, 120) + (post.content.length > 120 ? "..." : "")
                    : "No content preview available."}
                </p>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <Link to={`/posts/${post.id}`} className="btn btn-outline-primary btn-sm">
                    Read More &raquo;
                  </Link>
                  <small className="text-muted">
                    {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
