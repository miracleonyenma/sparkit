import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleGetGoogleSession } from "@/utils/auth/google";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const url = request.nextUrl.clone();
  const code = searchParams.get("code");
  console.log("🪵🪵🪵🪵🪵 ~ code", code);
  console.log("🪵🪵🪵🪵🪵 ~ API_URL", API_URL);

  if (!code) {
    url.pathname = "/auth/failure";
    url.searchParams.append("name", "google");
    url.searchParams.append("error", "No code provided");
    return NextResponse.redirect(url);
  }

  try {
    const res = await handleGetGoogleSession({ code });
    console.log("🌴🌴🌴🌴🌴 ~ res", res);

    if (res.errors) {
      throw new Error(res.errors[0].message);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const googleAuth = (res as any).data?.googleAuth;
    const { user, accessToken, refreshToken } = googleAuth;

    if (accessToken && refreshToken) {
      cookies().set("accessToken", accessToken);
      cookies().set("refreshToken", refreshToken);
      cookies().set("user", JSON.stringify(user));
    }

    return NextResponse.redirect(`${APP_URL}/`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🚨🚨🚨🚨🚨 ~ error", error);
    url.pathname = "/auth/failure";
    url.searchParams.append("name", "google");
    url.searchParams.append("error", error.message);
    return NextResponse.redirect(url);
  }
};

export { GET };
