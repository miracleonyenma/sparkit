import { NextRequest } from "next/server";
const GRAPHQL_API = process.env.NEXT_PUBLIC_GRAPHQL_API as string;
const API_KEY = process.env.API_KEY as string;

const POST = async (request: NextRequest) => {
  const body = await request.json();
  const cookies = request.cookies;
  const accessToken = cookies.get("accessToken")?.value;

  // console.log({ body });

  const res = await fetch(GRAPHQL_API, {
    method: "POST",
    headers: {
      ...(accessToken && {
        Authorization: `Bearer ${cookies.get("accessToken")?.value}`,
      }),
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...body.headers,
    },
    body: JSON.stringify({
      query: body.query,
      variables: body.variables,
    }),
  });

  console.log({ res });

  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }

  return Response.json(await res.json());
  // return Response.json({
  //   data: "Hello World",
  // });
};

export { POST };
