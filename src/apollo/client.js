import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs"

// Este link agrega el token a los headers
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "x-apollo-operation-name": operation.operationName || "unknown",
    },
  }));

  return forward(operation);
});

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_API_URL,
});

export const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});
