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

export const GET_CLIENTES = gql`
  query GetClientes($where: JSON) {
    clientes(where: $where) {
      id
      nombre
      apellido
      documento
      direccion
      telefono
      email
      departamento
      ciudad
    }
  }
`;

export const GET_CLIENTE = gql`
  query GetCliente($id: ID!) {
    cliente(id: $id) {
      id
      nombre
      apellido
      documento
      direccion
      telefono
      email
      departamento
      ciudad
    }
  }
`;

export const GET_ORDENES = gql`
  query GetOrdenes($where: JSON) {
    ordenes(where: $where) {
      id
      numeroOrden
      fecha
      total
      estado
      cliente {
        id
        nombre
        apellido
        documento
        direccion
        telefono
        email
        departamento
        ciudad
      }
      productos {
        id
        cantidad
        precioUnitario
        color
        talla
        producto {
          id
          nombre
          precio
        }
      }
    }
  }
`;