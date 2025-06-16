import { APIClient } from "./index";

export const createPostAPI = async (postData) => {
  try {
    const response = await APIClient.post("/posts", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePostAPI = async (postId, postData) => {
  try {
    const response = await APIClient.put(`/posts/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post with ID ${postId}:`, error);
    throw error;
  }
};

export const deletePostAPI = async (postId) => {
  try {
    const response = await APIClient.delete(`/posts/${postId}`);
    return response.data; // Or handle based on what your API returns (e.g., status code)
  } catch (error) {
    console.error(`Error deleting post with ID ${postId}:`, error);
    throw error;
  }
};

export const getPostByIdAPI = async (postId) => {
  try {
    const response = await APIClient.get(`/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with ID ${postId}:`, error);
    throw error;
  }
};

export const getUserPostsAPI = async () => {
  try {
    const response = await APIClient.get("/posts/mine"); // Assuming endpoint for user's posts
    return response.data;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};
