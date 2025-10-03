import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_CLIENTES } from "../graphql/queries/productQueries";
import { CREATE_CLIENTE } from "../graphql/mutations/productMutatios";
const uri = import.meta.env.VITE_GRAPHQL_API_URL;

const client = new ApolloClient({
    uri: uri,
    cache: new InMemoryCache(),
})

const validateCliente = async (dataCliente) => {
    console.log('validando cliente...')
    console.log('la uri que envias es: ', uri)
    try {
            const { data } = await client.query({
        query: GET_CLIENTES,
        variables: {
            where: {
                documento: dataCliente.documento
            }
        },
        fetchPolicy: "network-only"
    })

    if (data.clientes.length > 0) {
        console.log('retornando cliente existente...')
        return data.clientes[0];
    } else {
        console.log('no se encontro cliente, creando...')
        const { data: newCliente } = await client.mutate({
            mutation: CREATE_CLIENTE,
            variables: {
                input: dataCliente
            }
        });
        console.log('cliente creado...')
        console.log(`${JSON.stringify(newCliente)}`)
        return newCliente.createCliente;
    }

    } catch (error) {
        console.error("GraphQL error:", error);
        throw error;
    }
};

export default validateCliente;
