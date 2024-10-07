import { User } from "@/types/gql/graphql";
import graphqlRequest from "@/utils/graphQLRequest";

const GRAPHQL_API = process.env.NEXT_PUBLIC_GRAPHQL_API as string;

export type MeResponse = {
  me: User;
};

const ME_QUERY = `
query Me {
  me {
    id
    firstName
    lastName
    email
    emailVerified
    picture
    roles {
      id
      name
    }
  }
}
`;

const getMe = async ({ token }: { token: string }, url?: string) => {
  const headers: { [key: string]: string } = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const data = await graphqlRequest<{ me: User }>(
      url || GRAPHQL_API,
      {
        query: ME_QUERY,
      },
      headers,
    );

    console.log("🚀 ~ file: me.ts ~ line 52 ~ getMe ~ data", data);

    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨 ~ getMe error: ", error);
    throw new Error(error.message);
  }
};

export default getMe;
