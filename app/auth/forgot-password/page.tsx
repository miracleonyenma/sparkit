"use client";

import Loader from "@/components/Loader";
import requestPasswordReset from "@/utils/auth/requestPasswordReset";

import { useFormik } from "formik";
import {
  ArrowLeft2,
  Back,
  Eye,
  EyeSlash,
  PasswordCheck,
  Sms,
} from "iconsax-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import * as Yup from "yup";

const ForgotPassword = () => {
  const router = useRouter();
  useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("🥋🥋🥋🥋🥋🥋 ~ values: ", values);

      toast.promise(
        requestPasswordReset({ email: values.email }, "/api/graphql"),
        {
          loading: (() => {
            setLoading(true);
            return "Requesting password reset...";
          })(),
          success: (data) => {
            console.log("data ~", data);
            if (data.errors) throw Error(data.errors[0].message);
            if (!data.data?.requestPasswordReset)
              throw Error("Unable to send password reset link");

            return "Success! Password reset link sent to your email";
          },
          error: (error) => {
            console.log("🚨🚨🚨🚨🚨🚨 ~ error", error);

            return `Something went wrong: ${error}`;
          },
          finally: () => {
            setLoading(false);
          },
        },
      );
    },
  });
  return (
    <main>
      <section className="site-section">
        <div className="wrapper">
          <header className="section-header my-12">
            <div className="wrapper flex flex-col items-start gap-4">
              <Link className="btn ghost" href="/auth/login">
                <ArrowLeft2 variant="TwoTone" className="icon" />
                Back to login
              </Link>
              <h1 className="mb-2 text-xl font-bold lg:text-5xl">
                Forgot Password
              </h1>
            </div>
          </header>

          <div className="form-cont">
            <form onSubmit={formik.handleSubmit} className="w-full">
              <div className="wrapper mx-auto flex w-full flex-col gap-4">
                <div className="form-control flex grow flex-col gap-2">
                  {/* <label htmlFor="email">Password</label> */}
                  <div className="form-input">
                    <Sms variant="TwoTone" className="icon" />
                    <input
                      aria-label="Confirm email"
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      {...formik.getFieldProps("email")}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="form-error">
                      {/* <Danger variant="TwoTone" className="icon h-4 w-4" /> */}
                      <span className="dark:text-red-200">
                        {formik.errors.email}
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
                    Continue
                    <Loader loading={loading} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
