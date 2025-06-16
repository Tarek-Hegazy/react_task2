import { logInAPI } from "@/api/auth";
import { logInAndRegisterSchema } from "@/forms/schema"; // Assuming this schema only has email/password
import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import qs from "qs";
import { useLocation, useNavigate, Link } from "react-router-dom"; // Added Link

// Create a specific login schema if logInAndRegisterSchema includes other fields
const loginSchema = logInAndRegisterSchema.pick(["email", "password"]);

export default function Login() {
  const { search } = useLocation();
  const { redirectTo } = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // Added isSubmitting
  } = useForm({
    resolver: yupResolver(loginSchema), // Use the specific login schema
  });

  const onSubmit = async (data) => {
    try {
      const res = await logInAPI(data);
      setTokens(res.data);
      navigate(redirectTo ?? "/");
    } catch (e) {
      console.error(e);
      alert(
        `Login failed: ${
          e.response?.data?.message || e.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5 col-xl-4">
        <div className="card shadow-lg border-0 rounded-lg mt-5 mb-5">
          <div className="card-header bg-primary text-white text-center">
            <h3 className="fw-light my-4">Login</h3>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="name@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>
              {/* Optional: Add a "Forgot password?" link here */}
              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {" "}Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer text-center py-3">
            <div className="small">
              Need an account? <Link to="/register">Sign up!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
