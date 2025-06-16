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
  name: yup.string().required("Name is required"),
  username: yup.string().required("Username is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Phone number must be only digits")
    .required("Phone number is required"),
  avatar: yup.string().url("Avatar must be a valid URL"),
});
