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

// ACTUALIZADO: Query para obtener productos con la nueva estructura de SKUs
export const GET_PRODUCTOS = gql`
  query GetProducts($where: JSON) {
    productos(where: $where) {
      id
      nombre
      descripcion
      categoria {
        id
        nombre
      }
      # 'coloresDisponibles' te da los colores y sus imágenes asociadas
      coloresDisponibles {
        id
        color {
          id
          nombre
          codigo_hex
        }
        imagenes {
          id
          url
          isPrincipal
        }
      }
      # 'variaciones' te da cada SKU (combinación talla-color) con su precio y stock
      variaciones {
        id
        precio
        stock
        infoTalla {
          id
          nombre
        }
        infoColor {
          id
          nombre
        }
      }
    }
  }
`;

// ACTUALIZADO: Query para últimos productos, igual que GET_PRODUCTOS
export const GET_ULTIMOS_PRODUCTOS = gql`
  query GetUltimosProductos {
    ultimosProductos {
      id
      nombre
      descripcion
      categoria {
        id
        nombre
      }
      coloresDisponibles {
        id
        color {
          id
          nombre
          codigo_hex
        }
        imagenes {
          id
          url
          isPrincipal
        }
      }
      variaciones {
        id
        precio
        stock
        infoTalla {
          id
          nombre
        }
        infoColor {
          id
          nombre
        }
      }
    }
  }
`;

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

// ACTUALIZADO: Query para obtener órdenes con la nueva estructura de items
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
      }
      # 'productos' ahora es 'items', que son las variaciones del producto
      items {
        id # ID de la ProductoVariacion
        # Información de la variación comprada
        infoTalla {
          nombre
        }
        infoColor {
          nombre
        }
        # 'ProductoOrden' contiene los datos de la tabla intermedia
        ProductoOrden {
          cantidad
          precioUnitario
        }
      }
    }
  }
`;
