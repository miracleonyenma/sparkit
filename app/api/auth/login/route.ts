import loginUser from "@/utils/auth/loginUser";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const POST = async (request: Request, response: NextResponse) => {
  const body = await request.json();

  try {
    const data = await loginUser({ ...body });
    console.log("🚀 ~ file: route.ts ~ line 13 ~ POST ~ data", data.data);

    data.data?.login.accessToken &&
      cookies().set("accessToken", data.data?.login.accessToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 3 days
      });
    data.data?.login.refreshToken &&
      cookies().set("refreshToken", data.data?.login.refreshToken, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      });
    data.data?.login.user &&
      cookies().set("user", JSON.stringify(data.data?.login.user), {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 3 days
      });

    return Response.json(data);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

export { POST };
