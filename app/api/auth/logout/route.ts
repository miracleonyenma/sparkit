import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const GET = async (request: NextRequest, response: NextResponse) => {
  const url = request.nextUrl.clone();

  try {
    cookies().set("accessToken", "", { expires: new Date() });
    cookies().set("refreshToken", "", { expires: new Date() });
    cookies().set("user", "", { expires: new Date() });

    return Response.json({ success: true });
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨🚨 ~ error", error);
    return new Response(error.message, { status: 500 });
  }
};

export { GET };
