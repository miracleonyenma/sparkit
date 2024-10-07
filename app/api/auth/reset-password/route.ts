import resetPassword from "@/utils/auth/resetPassword";
import { NextResponse } from "next/server";

const POST = async (request: Request, response: NextResponse) => {
  const body = await request.json();

  try {
    const data = await resetPassword({ ...body });
    return Response.json(data);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

export { POST };
