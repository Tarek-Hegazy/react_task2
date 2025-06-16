import { logInAndRegisterSchema } from "@/forms/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAPI } from "@/api/auth";
import { useNavigate, Link } from "react-router-dom"; // Added Link

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(logInAndRegisterSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerAPI(data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (e) {
      console.error(e);
      alert(
        `Registration failed: ${
          e.response?.data?.message || e.message || "Unknown error"
        }`
      );
    } finally {
      // reset(); // Consider not resetting form on failure so user can correct
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5 col-xl-4">
        <div className="card shadow-lg border-0 rounded-lg mt-5 mb-5">
          <div className="card-header bg-primary text-white text-center">
            <h3 className="fw-light my-4">Create Account</h3>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Enter your full name"
                  {...register("name")}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  className={`form-control ${
                    errors.username ? "is-invalid" : ""
                  }`}
                  placeholder="Choose a username"
                  {...register("username")}
                />
                {errors.username && (
                  <div className="invalid-feedback">
                    {errors.username.message}
                  </div>
                )}
              </div>

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
                  placeholder="Create a password (min. 8 characters)"
                  {...register("password")}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Enter your phone number"
                  {...register("phone")}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="avatar" className="form-label">
                  Avatar URL (Optional)
                </label>
                <input
                  id="avatar"
                  type="url"
                  className={`form-control ${
                    errors.avatar ? "is-invalid" : ""
                  }`}
                  placeholder="https://example.com/avatar.jpg"
                  {...register("avatar")}
                />
                {errors.avatar && (
                  <div className="invalid-feedback">
                    {errors.avatar.message}
                  </div>
                )}
              </div>

              <div className="d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg">
                  Register
                </button>
              </div>
            </form>
          </div>
          <div className="card-footer text-center py-3">
            <div className="small">
              Already have an account? <Link to="/login">Go to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
