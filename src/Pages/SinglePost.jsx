import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostByIdAPI } from "@/api/post";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const data = await getPostByIdAPI(id);
        setPost(data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading post...</span>
        </div>
        <p className="mt-2">Loading post details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <h4>Error loading post</h4>
        <p>{error}</p>
        <Link to="/posts" className="btn btn-primary me-2">
          Back to Posts
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-danger"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!post) {
    // This case might be redundant if error state is properly set for "not found"
    return (
      <div className="alert alert-warning" role="alert">
        Post not found.
        <Link to="/posts" className="btn btn-primary ms-2">
          Back to Posts
        </Link>
      </div>
    );
  }

  // Safely access nested properties like author name
  const authorName = post.author?.name || "Unknown Author";
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date not available";
  const updatedAt = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null; // Only show updated date if it exists and differs from created_at potentially

  return (
    <div className="container mt-4">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/posts">Posts</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {post.title || "Post Details"}
          </li>
        </ol>
      </nav>
      <div className="card">
        <div className="card-header">
          <h2>{post.title}</h2>
        </div>
        <div className="card-body">
          <p className="card-text">{post.content}</p>
        </div>
        <div className="card-footer text-muted">
          <p>
            <strong>Author:</strong> {authorName}
          </p>
          <p>
            <strong>Published on:</strong> {createdAt}
          </p>
          {updatedAt && updatedAt !== createdAt && (
            <p>
              <strong>Last updated:</strong> {updatedAt}
            </p>
          )}
        </div>
      </div>
      <Link to="/posts" className="btn btn-secondary mt-3">
        Back to All Posts
      </Link>
    </div>
  );
}
