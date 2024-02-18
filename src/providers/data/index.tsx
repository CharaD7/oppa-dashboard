import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

export const API_URL = "https://api.crm.refine.dev";

export const client = new GraphQLClient(API_URL, {
  fetch: async (url: string, options: RequestInit) => {
    try {
      return await fetchWrapper(url, options);
    } catch (error) {
      // Ensure the rejection reason is an Error
      if (error instanceof Error) {
        return await Promise.reject(error);
      } else {
        // If it's not, create a new Error with the given error as the message
        return await Promise.reject(new Error(String(error)));
      }
    }
  }
});
