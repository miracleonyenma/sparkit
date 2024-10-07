import getMe from "@/utils/auth/me";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const GET = async (request: Request, response: NextResponse) => {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("accessToken");

  if (!accessToken) {
    return NextResponse.redirect(new URL("/auth/register", request.url));
  }

  const data = await getMe({ token: accessToken.value });

  data?.data?.me &&
    cookiesStore.set("user", JSON.stringify(data.data.me), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days
    });

  console.log("🚀 ~ file: route.ts ~ line 22 ~ GET ~ data", data);

  return NextResponse.json(data);
};

export { GET };
