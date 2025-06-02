import { gql } from "@apollo/client";

export const CREATE_PRODUCTS = gql`
  mutation CreateProducts($input: ProductoInput!) {
    createProducto(input: $input) {
      id
      nombre
      descripcion
      precio
    }
  }
`;

export const CREATE_COLORS = gql`
  mutation CreateColors($nombre: String!, $codigo_hex: String!) {
    createColor(nombre: $nombre, codigo_hex: $codigo_hex) {
      id
      nombre
      codigo_hex
    }
  }
`;

export const DELETE_COLORS = gql`
  mutation DeleteColors($id: ID!) {
    deleteColor(id: $id) 
  }
`;