import * as yup from "yup";
export const logInAndRegisterSchema = yup.object({
  email: yup
    .string()
    .email("please enter avalid email")
    .required("the email is required for registration"),

  password: yup
    .string()
    .min(8, "please make sure the password is more then 7 char")
    .required("the password is required for registration"),
});
