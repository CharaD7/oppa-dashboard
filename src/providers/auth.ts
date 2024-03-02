import { AuthBindings } from "@refinedev/core";
import { API_URL, dataProvider } from "./data";

export const authCredentials = {
  email: "micael.scott@dundermifflin.com",
  password: "demodemo",
};

export const authProvider: AuthBindings = {
  login: async ({ email }) => {
    try {
      // call the login mutation
      // dataProvider.custom is used to make a custom request to the GraphQL API
      // this will call dataProvider which will go through the fetchWrapper function
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          // pass the email to see if th euser exists and if so, return the accessToken
        }
      });
    }
  },
};
