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
      // this will call dataProvider which will go through the
      // fetchWrapper function
      const { data } = await dataProvider.custom({
        url: API_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          // pass the email to see if th euser exists and if so,
          // return the accessToken
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
              }
            }
          `
        }
      });

      // save the accessToken in localStorage
      localStorage.setItem("access_token", data.login.accessToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
        }
      };
    }
  },
};
