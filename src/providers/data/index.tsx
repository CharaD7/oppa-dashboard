import graphqlDataProvider, { 
  GraphQLClient, 
  liveProvider as graphqlLiveProvider 
} from "@refinedev/nestjs-query";
import { createClient } from "graphql-ws";
import { fetchWrapper } from "./fetch-wrapper";

export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = "https://api.crm.refine.dev";
export const WS_URL = "wss://api.crm.refine.dev/graphql";

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

export const wsClient = typeof window !== "undefined"
  ? createClient({
      url: WS_URL,
      connectionParams: () => {
        const accessToken = localStorage.getItem("access_token");

        return {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      }
    })
  : undefined

// data provider to make requests to the graphQL server
export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient != null 
  ? graphqlLiveProvider(wsClient) : undefined;
