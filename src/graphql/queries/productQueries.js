import { gql } from "@apollo/client";

export const GET_COLORS = gql`
  query GetColors {
    colores {
      id
      nombre
      codigo_hex
    }
  }
`;

export const GET_TALLAS = gql`
  query GetSizes {
    tallas {
      id
      nombre
    }
  }
`;

export const GET_CATEGORIAS = gql`
  query GetCategorias {
    categorias {
      id
      nombre
    }
  }
`;

export const GET_PRODUCTOS = gql`
  query GetProducts {
    productos {
      id
      nombre
      descripcion
      precio
      imagenes {
        id
        url
      }
      categoria {
        id
        nombre
      }
      tallas {
        id
        nombre
      }
      colores {
        id
        nombre
        codigo_hex
      }
    }
  }
`;
