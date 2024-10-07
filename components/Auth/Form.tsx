"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { getGoogleAuthURL } from "@/utils/auth/google";
import {
  Eye,
  EyeSlash,
  Google,
  PasswordCheck,
  Personalcard,
  Sms,
} from "iconsax-react";
import { toast } from "sonner";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import loginUser from "@/utils/auth/loginUser";
import Loader from "@/components/Loader";
import registerUser from "@/utils/auth/registerUser";

const AuthVerifyEmailPrompt: React.FC<{
  children?: ReactNode;
  openPrompt: boolean;
  email: string;
}> = ({ children, openPrompt, email }) => {
  const [open, setOpen] = useState(openPrompt);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    setOpen(openPrompt);
  }, [openPrompt]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Verify Email</DialogTitle>
            <DialogDescription>
              A verification code has been sent to your email address. Please
              enter the code to verify your email.
            </DialogDescription>
          </DialogHeader>
          <Link href={`/auth/verify?email=${email}`} className="btn primary">
            Verify Email
          </Link>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer shouldScaleBackground open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Verify Email</DrawerTitle>
          <DrawerDescription>
            A verification code has been sent to your email address. Please
            enter the code to verify your email.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-row gap-4">
          <DrawerClose asChild>
            <button className="btn">Cancel</button>
          </DrawerClose>
          <Link href={`/auth/verify?email=${email}`} className="btn primary">
            Verify Email
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const AuthForm: React.FC<{
  type: "login" | "register";
}> = ({ type }) => {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openPrompt, setOpenPrompt] = useState(false);

  const googleURL = getGoogleAuthURL();

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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object(
      type == "register"
        ? {
            firstName: Yup.string()
              .max(15, "Must be 15 characters or less")
              .required("Required"),
            lastName: Yup.string()
              .max(20, "Must be 20 characters or less")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: validatePassword,
          }
        : {
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: validatePassword,
          },
    ),
    onSubmit: async (values) => {
      console.log("🥋🥋🥋🥋🥋🥋 ~ values: ", values);
      if (type == "register") {
        toast.promise(
          registerUser(
            {
              email: values.email.trim().toLowerCase(),
              password: values.password.trim(),
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
            },
            "/api/graphql",
          ),
          {
            loading: (() => {
              setLoading(true);
              return "Registering User...";
            })(),
            success: (data) => {
              console.log("🪵🪵🪵🪵🪵 ~ handleAuth Register:", data);
              setOpenPrompt(true);
              return "User Registered Successfully";
            },
            error: (error) => {
              return error.message;
            },
            finally: () => {
              setLoading(false);
            },
          },
        );
      }
      if (type == "login") {
        toast.promise(
          loginUser(
            {
              email: values.email.trim().toLowerCase(),
              password: values.password.trim(),
            },
            "/api/graphql",
          ),
          {
            loading: (() => {
              setLoading(true);
              return "Logging In...";
            })(),
            success: (data) => {
              setLoading(false);
              console.log("🪵🪵🪵🪵🪵 ~ handleAuth Login:", data);

              if (!data?.data?.login?.user?.id) {
                console.log(data.data?.login);

                throw new Error("User not found");
              }
              setUser(data?.data?.login?.user);
              router.push("/");
              return "User Logged In Successfully";
            },
            error: (error) => {
              setLoading(false);
              return (
                <>
                  <span>{error.message}</span>
                  {(error.message as string)
                    .toLowerCase()
                    .includes("not verified") && (
                    <Link
                      href={`/auth/verify?email=${values.email}`}
                      className="btn ml-auto"
                    >
                      Verify
                    </Link>
                  )}
                </>
              );
            },
          },
        );
      }
    },
  });

  return (
    <>
      <div className="form-cont flex w-full flex-col gap-8 py-12">
        <div className="socials relative flex flex-col items-start justify-center gap-4">
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gray-100 px-2 dark:bg-gray-900">
            OR
          </span>
          <Link href={googleURL} className="btn primary w-full">
            <Google className="icon" variant="Bold" />
            Sign In With Google
          </Link>
        </div>
        <hr className="border border-gray-200 dark:border-gray-700" />

        <form onSubmit={formik.handleSubmit} className="w-full">
          <div className="wrapper mx-auto flex w-full flex-col gap-4">
            {type == "register" && (
              <div className="form-group flex flex-wrap gap-4">
                <div className="form-control flex grow flex-col gap-2">
                  {/* <label htmlFor="firstName">First Name</label> */}
                  <div className="form-input">
                    <Personalcard className="icon" />
                    <input
                      aria-label="First Name"
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      {...formik.getFieldProps("firstName")}
                    />
                  </div>
                  {formik.touched.firstName && formik.errors.firstName ? (
                    <div className="form-error">
                      {/* <Danger variant="TwoTone" className="icon h-4 w-4" /> */}
                      <span className="dark:text-red-200">
                        {formik.errors.firstName}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="form-control flex grow flex-col gap-2">
                  {/* <label htmlFor="lastName">Last Name</label> */}
                  <div className="form-input">
                    <Personalcard className="icon" />
                    <input
                      aria-label="Last Name"
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      {...formik.getFieldProps("lastName")}
                    />
                  </div>
                  {formik.touched.lastName && formik.errors.lastName ? (
                    <div className="form-error">
                      {/* <Danger variant="TwoTone" className="icon h-4 w-4" /> */}
                      <span className="dark:text-red-200">
                        {formik.errors.lastName}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
            <div>
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
            </div>
            <div>
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
            </div>
            <div>
              <button disabled={loading} className="btn primary">
                {type == "register" ? "Register" : "Login"}
                <Loader loading={loading} />
              </button>
            </div>
            {/* forgot password */}
            {type == "login" && (
              <div className="form-control flex grow flex-col gap-2">
                <Link
                  href="/auth/forgot-password"
                  className="w-fit text-sm text-gray-600 underline"
                >
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>
        </form>
      </div>
      <AuthVerifyEmailPrompt
        email={formik.values.email}
        openPrompt={openPrompt}
      />
    </>
  );
};

export default AuthForm;
