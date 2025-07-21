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
  query GetProducts($where: JSON) {
    productos(where: $where) {
      id
      nombre
      descripcion
      precio
      imagenes {
        id
        url
        color {
          id
          nombre
          codigo_hex
        }
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

export const GET_ULTIMOS_PRODUCTOS = gql`
  query GetUltimosProductos {
    ultimosProductos {
      id
      nombre
      descripcion
      precio
      imagenes {
        id
        url
        color {
          id
          nombre
          codigo_hex
        }
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

// export const GET_PIJAMAS = gql`
//   query GetPijamas($where: JSON){
//     productos(where: { categoria: { nombre: "Pijamas" } }) {
//       id
//       nombre
//       descripcion
//       precio
//       imagenes {
//         id
//         url
//       }
//       categoria {
//         id
//         nombre
//       }
//       tallas {
//         id
//         nombre
//       }
//       colores {
//         id
//         nombre
//         codigo_hex
//       }
//     }
//   }
// `;

export const GET_USUARIO = gql`
  query GetUsuarios {
    usuarios {
      id
      nombre
      email
    }
  }
`;
