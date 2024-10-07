import Loader from "@/components/Loader";
import resetPassword from "@/utils/auth/resetPassword";
import { useFormik } from "formik";
import { ArrowLeft2, Back, Eye, EyeSlash, PasswordCheck } from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const AuthResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const token = searchParams.get("token");

  const validatePassword = Yup.string()
    .min(8, "Password must be at least 8 characters")
    .test(
      "password",
      "Password must contain at least one uppercase, one lowercase, one number and one special character",
      (value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(
          value || "",
        );
      },
    )
    .required("Required");
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: validatePassword,
      confirmPassword: Yup.string().test(
        "passwords-match",
        "Passwords must match",
        function (value) {
          return this.parent.password === value;
        },
      ),
    }),
    onSubmit: async (values) => {
      console.log("🥋🥋🥋🥋🥋🥋 ~ values: ", values);
      token &&
        toast.promise(
          resetPassword({ password: values.password, token }, "/api/graphql"),
          {
            loading: (() => {
              setLoading(true);
              return "Reseting password...";
            })(),
            success: (data) => {
              console.log("data ~", data);
              if (data.errors) throw Error(data.errors[0].message);
              setTimeout(() => {
                router.push("/auth/login");
              }, 3000);
              return "Password reset successfully, you'll be redirected to login page";
            },
            error: (error) => {
              console.log("🚨🚨🚨🚨🚨🚨 ~ error", error);

              return `Something went wrong: ${error}. You can try again by clicking the forgot password link in the login page`;
            },
            finally: () => {
              setLoading(false);
            },
          },
        );
    },
  });
  return (
    <section className="site-section">
      <div className="wrapper">
        <header className="section-header my-12">
          <div className="wrapper flex flex-col items-start gap-4">
            <Link className="btn" href="/auth/login">
              <ArrowLeft2 variant="TwoTone" className="icon" />
              Back to login
            </Link>
            <h1 className="mb-2 text-xl font-bold lg:text-5xl">
              Reset your password
            </h1>
          </div>
        </header>

        <div className="form-cont">
          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="wrapper mx-auto flex w-full flex-col gap-4">
              <div className="form-control flex grow flex-col gap-2">
                {/* <label htmlFor="password">Password</label> */}
                <div className="form-input">
                  <PasswordCheck variant="TwoTone" className="icon" />
                  <input
                    aria-label="Password"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...formik.getFieldProps("password")}
                  />
                  {showPassword ? (
                    <button
                      type="button"
                      onClick={() => setShowPassword(false)}
                      className="btn bg-transparent"
                    >
                      <EyeSlash className="icon" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPassword(true)}
                      className="btn bg-transparent"
                    >
                      <Eye className="icon" />
                    </button>
                  )}
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <div className="form-error">
                    {/* <Danger variant="TwoTone" className="icon h-4 w-4" /> */}
                    <span className="dark:text-red-200">
                      {formik.errors.password}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="form-control flex grow flex-col gap-2">
                {/* <label htmlFor="password">Password</label> */}
                <div className="form-input">
                  <PasswordCheck variant="TwoTone" className="icon" />
                  <input
                    aria-label="Confirm password"
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...formik.getFieldProps("confirmPassword")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="btn bg-transparent"
                  >
                    {showConfirmPassword ? (
                      <EyeSlash className="icon" />
                    ) : (
                      <Eye className="icon" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="form-error">
                    {/* <Danger variant="TwoTone" className="icon h-4 w-4" /> */}
                    <span className="dark:text-red-200">
                      {formik.errors.confirmPassword}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="action-cont">
                <button
                  disabled={loading}
                  type="submit"
                  className="btn primary"
                >
                  Reset Password
                  <Loader loading={loading} />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AuthResetPassword;
