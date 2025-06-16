import { logInAPI } from "@/api/auth";
import { logInAndRegisterSchema } from "@/forms/schema";
import { useAuthStore } from "@/store/auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import qs from "qs";
import { useLocation, useNavigate } from "react-router-dom";
export default function Login() {
  const { search } = useLocation();
  const { redirectTo } = qs.parse(search, { ignoreQueryPrefix: true });
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
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
      const res = await logInAPI(data);
      setTokens(res.data);
      navigate(redirectTo ?? "/");
    } catch (e) {
      console.error(e);
    } finally {
      // reset();
    }
  };
  return (
    <div className="text-center">
      <h2>Login Page (Form goes here)</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="">
            <label htmlFor="email">Email :</label>{" "}
            <input id="email" type="email" {...register("email", {})} />
            <p style={{ color: "orange" }}>{errors?.email?.message}</p>
          </div>

          <div className="">
            <label htmlFor="password">Password :</label>{" "}
            <input type="password" {...register("password", {})} />
            <p style={{ color: "orange" }}>{errors?.password?.message}</p>
          </div>
          <div className="">
            <input type="submit" value="log in" />
          </div>
        </form>
      </div>
    </div>
  );
}
