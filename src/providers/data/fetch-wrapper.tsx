import { type GraphQLFormattedError } from "graphql";

interface Error {
  message: string;
  statusCode: string;
}

const customFetch = async (
  url: string, 
  options: RequestInit
): Promise<Response> => {
  const accessToken = localStorage.getItem("access_token");
  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization !== undefined && 
        headers.Authorization !== '' ? headers.Authorization : 
        `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true", // This fixes cross origin errors
    }
  });
};

const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
): Error | null => {
  if (body.errors === undefined) {
    return {
      message: "Unknown error",
      statusCode: "INTERNAL_SERVER_ERROR",
    }
  }

  if ("errors" in body) {
    const errors = body?.errors;

    const messages = errors?.map((error) => error?.message)?.join("");
    const code = errors?.[0]?.extensions?.code ?? 500;

    return {
      message: messages ?? JSON.stringify(errors),
      statusCode: code
    }
  }

  return null
}

export const fetchWrapper = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  const response = await customFetch(url, options);

  // so response object can be manipulated
  const responseClone = response.clone(); 
  // get the response body from the cloned response
  const body: Record<"errors", GraphQLFormattedError[] 
    | undefined> = await responseClone.json();

  const error = getGraphQLErrors(body);

  // Explicitly check if error is not null
  if (error !== null) {
    const errorObj = new Error(error.message);
    (errorObj as any).statusCode = error.statusCode;
    throw errorObj;
  };

  return response;
}
