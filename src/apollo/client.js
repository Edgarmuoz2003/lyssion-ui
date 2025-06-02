import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";


export const client = new ApolloClient({
  link: createUploadLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL, 
     headers: {
      "x-apollo-operation-name": "upload", // Puedes poner cualquier valor no vacío
    },
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});