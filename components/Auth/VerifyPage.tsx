import { useRouter, useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { AnimatePresence, motion } from "framer-motion";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Sms } from "iconsax-react";
import sendVerificationOTP from "@/utils/auth/sendVerificationOTP";
import verifyOTP from "@/utils/auth/verifyOTP";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendRequest = async (path: string, body: { [key: string]: any }) => {
  const res = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw await res.text();
  }
  const data = await res.json();
  return data;
};

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(email);

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log({ values });
      toast.promise(
        sendVerificationOTP({ email: values.email }, "/api/graphql"),
        {
          loading: (() => {
            setLoading(true);
            return "Sending verifcation code to your mail...";
          })(),
          success: (data) => {
            console.log("🪵🪵🪵🪵🪵 ~ sendVerificationOTP data:", data);
            setUserEmail(values.email);
            return "Verfication code sent successfully!";
          },
          error: (err) => {
            console.log("🚨🚨🚨🚨🚨🚨 ~ sendVerificationOTP err: ", err);

            return (
              err ||
              "Something went wrong while sending the code, try again later"
            );
          },
          finally: () => {
            setLoading(false);
          },
        },
      );
    },
  });

  const handleVerifyEmail = () => {
    console.log("time to verify", userEmail);

    if (userEmail && value.trim()) {
      toast.promise(
        verifyOTP(
          {
            email: userEmail,
            otp: value.toUpperCase(),
          },
          "/api/graphql",
        ),
        {
          loading: (() => {
            setLoading(true);
            return "Verifying your email address...";
          })(),
          success: (data) => {
            console.log("🪵🪵🪵🪵🪵 ~ verifyEmail data:", data);

            router.push("/auth/login");
            return "Email successfully verified, redirecting you to login...";
          },
          error: (error) => {
            console.log({ error });
            setValue("");
            return `Something went wrong: ${error}`;
          },
          finally: () => {
            setLoading(false);
          },
        },
      );
    } else {
      toast.error("Please make sure the email and OTP is entered correctly");
    }
  };

  return (
    <section className="site-section flex w-full flex-col max-lg:px-0 lg:justify-center">
      <div className="wrapper">
        <header className="section-header my-12">
          <div className="wrapper">
            <h1 className="mb-2 text-xl font-bold lg:text-5xl">
              Verify your email address
            </h1>
            <p>
              Enter the code that was sent to <strong>{email}</strong> to
              confirm your email address.
            </p>
          </div>
        </header>
        <AnimatePresence>
          {userEmail ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              className="flex flex-col gap-6"
            >
              <InputOTP
                maxLength={6}
                value={value}
                onChange={(value) => setValue(value)}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              >
                <InputOTPGroup className="flex gap-2">
                  {Array.from({ length: 6 }, (_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="form-input !rounded-none !border-gray-300 capitalize lg:text-xl"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <div className="action-cont flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setUserEmail(null);
                  }}
                  className="btn secondary"
                >
                  Back
                </button>
                <button onClick={handleVerifyEmail} className="btn primary">
                  Verify
                  <Loader loading={loading} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{
                opacity: 0,
                scale: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0,
              }}
              onSubmit={formik.handleSubmit}
            >
              <div className="wrapper flex flex-col gap-4">
                <div className="form-control flex grow flex-col gap-2">
                  {/* <label htmlFor="email">Email Address</label> */}
                  <div className="form-input">
                    <Sms variant="TwoTone" className="icon" />
                    <input
                      aria-label="Email Address"
                      id="email"
                      type="email"
                      placeholder="Email Address"
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
                    {!loading ? "Send code" : "Sending code..."}
                    <Loader loading={loading} />{" "}
                  </button>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default VerifyEmailPage;
