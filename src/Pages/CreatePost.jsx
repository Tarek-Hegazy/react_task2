import React from "react";
import { useForm } from "react-hook-form";
import { createPostAPI } from "@/api/post";
import { useNavigate, Link } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const postSchema = yup.object({
  title: yup.string().required("Title is required").min(3, "Title must be at least 3 characters"),
  content: yup.string().required("Content is required").min(10, "Content must be at least 10 characters"),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(postSchema),
  });

  const onSubmit = async (data) => {
    try {
      await createPostAPI(data);
      alert("Post created successfully!");
      navigate("/posts"); // Navigate to the list of posts or the new post's page
      // reset(); // Reset is good here after successful creation
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(
        `Failed to create post: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-7">
        <div className="card shadow-lg border-0 rounded-lg mt-5 mb-5">
          <div className="card-header bg-success text-white text-center">
            <h3 className="fw-light my-4">Create New Post</h3>
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
                  placeholder="Enter post title"
                  {...register("title")}
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
                  rows="8"
                  placeholder="Write your post content here..."
                  {...register("content")}
                ></textarea>
                {errors.content && (
                  <div className="invalid-feedback">{errors.content.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Link to="/posts" className="btn btn-outline-secondary">
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
                      {" "}Publishing...
                    </>
                  ) : (
                    "Publish Post"
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
