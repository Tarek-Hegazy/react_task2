import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getPostByIdAPI, updatePostAPI } from "@/api/post";

const postSchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  content: yup.string().required("Content is required").min(10, "Content must be at least 10 characters"),
});

export default function EditPost() {
  const { id: postId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postTitle, setPostTitle] = useState(""); // To display in header while loading form

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      setError(null);
      try {
        const postData = await getPostByIdAPI(postId);
        if (postData) {
          reset({ title: postData.title, content: postData.content });
          setPostTitle(postData.title); // For header
        } else {
          setError("Post not found. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error fetching post data for edit:", err);
        setError(err.response?.data?.message || err.message || "Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };
    if (postId) {
      fetchPostData();
    }
  }, [postId, reset]);

  const onSubmit = async (data) => {
    try {
      await updatePostAPI(postId, data);
      alert("Post updated successfully!");
      navigate(`/posts/${postId}`);
    } catch (updateError) {
      console.error("Failed to update post:", updateError);
      alert(
        `Failed to update post: ${
          updateError.response?.data?.message || updateError.message
        }`
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading post data...</span>
        </div>
        <p className="ms-3 fs-4">Loading post for editing...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error Loading Post</h4>
          <p>{error}</p>
          <hr />
          <Link to="/posts" className="btn btn-outline-danger">
            Back to Posts List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div className="card shadow-lg border-0 rounded-lg mt-5 mb-5">
          <div className="card-header bg-warning text-dark text-center">
            <h3 className="fw-light my-4">Edit Post: {postTitle}</h3>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Post Title
                </label>
                <input
                  id="title"
                  type="text"
                  className={`form-control form-control-lg ${errors.title ? "is-invalid" : ""}`}
                  {...register("title")}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <div className="invalid-feedback">{errors.title.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Post Content
                </label>
                <textarea
                  id="content"
                  className={`form-control form-control-lg ${errors.content ? "is-invalid" : ""}`}
                  rows="10"
                  {...register("content")}
                  disabled={isSubmitting}
                ></textarea>
                {errors.content && (
                  <div className="invalid-feedback">{errors.content.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link
                  to={postId ? `/posts/${postId}` : "/posts"}
                  className="btn btn-outline-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      {" "}Saving Changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
