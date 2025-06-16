import { logInAndRegisterSchema } from "@/forms/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerAPI } from "@/api/auth";
import { useNavigate } from "react-router-dom";

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

      navigate("/login");
    } catch (e) {
      console.error(e);
    } finally {
      reset();
    }
  };
  return (
    <div className="text-center">
      <h2>Register Page (Form goes here)</h2>
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
            <input type="submit" value="create my user" />
          </div>
        </form>
      </div>
    </div>
  );
}
