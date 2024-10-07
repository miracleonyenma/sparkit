import verifyOTP from "@/utils/auth/verifyOTP";
import { NextResponse } from "next/server";

const POST = async (request: Request, response: NextResponse) => {
  const body = await request.json();

  try {
    const data = await verifyOTP({ ...body });
    return Response.json(data);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
};

export { POST };
