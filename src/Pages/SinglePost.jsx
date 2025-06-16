import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getPostByIdAPI, deletePostAPI } from "@/api/post";
import { useAuthStore } from "@/store/auth";
import { jwtDecode } from "jwt-decode";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const { token } = useAuthStore.getState();

  useEffect(() => {
    let currentUserId = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        currentUserId = decodedToken?.id;
      } catch (e) {
        console.error("Failed to decode token:", e);
        // Optionally set an error state here if token decoding is critical
      }
    }

    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostByIdAPI(id);
        setPost(data);
        if (currentUserId && data.author && data.author.id === currentUserId) {
          setIsAuthor(true);
        } else if (currentUserId && data.authorId === currentUserId) {
          setIsAuthor(true);
        }
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch post with ID ${id}:`, err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch post. It might not exist or an error occurred."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, token]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setLoading(true); // Indicate loading state during deletion
      try {
        await deletePostAPI(post.id);
        alert("Post deleted successfully!");
        navigate("/posts");
      } catch (deleteError) {
        console.error("Failed to delete post:", deleteError);
        alert(
          `Failed to delete post: ${
            deleteError.response?.data?.message || deleteError.message
          }`
        );
        setLoading(false); // Reset loading state on error
      }
    }
  };

  if (loading && !post) { // Show full page loader only if post is not yet loaded
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading post...</span>
        </div>
        <p className="ms-3 fs-4">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error Loading Post!</h4>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-center gap-2">
            <Link to="/posts" className="btn btn-outline-primary">
              Back to Posts List
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-danger"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    // This should ideally be caught by the error state if API returns 404
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">Post Not Found</h4>
          <p>The post you are looking for could not be found.</p>
          <hr />
          <Link to="/posts" className="btn btn-primary">
            Back to Posts List
          </Link>
        </div>
      </div>
    );
  }

  const authorName = post.author?.name || "Unknown Author";
  const authorUsername = post.author?.username || null;
  const createdAtDate = new Date(post.createdAt || Date.now());
  const createdAt = createdAtDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  const updatedAt = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/posts">My Posts</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {post.title || "Post Details"}
          </li>
        </ol>
      </nav>

      <div className="card shadow-lg border-0 rounded-lg">
        <div className="card-header bg-light py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0 text-primary">{post.title}</h1>
            {isAuthor && (
              <div className="btn-group">
                <Link to={`/posts/${post.id}/edit`} className="btn btn-outline-secondary">
                  <i className="bi bi-pencil-square me-1"></i>Edit {/* Example using Bootstrap Icons */}
                </Link>
                <button onClick={handleDelete} className="btn btn-outline-danger" disabled={loading}>
                  {loading && post ? <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span> : <i className="bi bi-trash me-1"></i>}
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card-body p-4">
          <div className="text-muted mb-3">
            <span>By {authorName}</span>
            {authorUsername && <span className="ms-2 text-secondary">(@{authorUsername})</span>}
            <span className="mx-2">|</span>
            <span>Published on: {createdAt}</span>
            {updatedAt && updatedAt !== createdAt && (
              <span className="ms-2 fst-italic">(Last updated: {updatedAt})</span>
            )}
          </div>
          <hr/>
          {/* Use a class for pre-wrap to respect newlines and formatting from content */}
          <p className="card-text fs-5" style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/posts" className="btn btn-lg btn-outline-secondary">
          <i className="bi bi-arrow-left-circle me-2"></i>Back to All My Posts
        </Link>
      </div>
    </div>
  );
}
