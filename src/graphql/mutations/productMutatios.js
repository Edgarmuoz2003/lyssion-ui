import { gql } from "@apollo/client";

// ACTUALIZADO: Mutación para crear productos con la nueva estructura anidada.
export const CREATE_PRODUCTS = gql`
  mutation CreateProducts($input: CreateProductoInput!) {
    createProducto(input: $input) {
      id
      nombre
      descripcion
      # Puedes pedir los datos que acabas de crear para actualizar el estado de tu app
      variaciones {
        id
        precio
        stock
      }
    }
  }
`;

export const DELETE_PRODUCTS = gql`
  mutation DeleteProducts($id: ID!) {
    deleteProducto(id: $id)
  }
`;

export const CREATE_COLORS = gql`
  mutation CreateColors($nombre: String!, $codigo_hex: String) {
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

export const CREATE_TALLAS = gql`
  mutation CreateTallas($nombre: String!) {
    createTalla(nombre: $nombre) {
      id
      nombre
    }
  }
`;

export const CREATE_USUARIO = gql`
  mutation CreateUsuarios($input: UsuarioInput!) {
    createUsuario(input: $input) {
      id
      nombre
      email
    }
  }
`;

export const DELETE_TALLAS = gql`
  mutation DeleteTallas($id: ID!) {
    deleteTalla(id: $id)
  }
`;

export const CREATE_CATEGORIAS = gql`
  mutation CreateCategorias($nombre: String!) {
    createCategoria(nombre: $nombre) {
      id
      nombre
    }
  }
`;
export const DELETE_CATEGORIAS = gql`
  mutation DeleteCategorias($id: ID!) {
    deleteCategoria(id: $id)
  }
`;

export const DELETE_USUARIO = gql`
  mutation DeleteUsuarios($id: ID!) {
    deleteUsuario(id: $id)
  }
`;

export const MAKE_LOGIN = gql`
  mutation makeLogin($data: inputLogin!) {
    login(data: $data) {
      user {
        nombre
        email
      }
      token
    }
  }
`;

export const CREATE_CLIENTE = gql`
  mutation createCliente($input: ClienteInput!) {
    createCliente(input: $input) {
      id
      nombre
      apellido
      documento
      email
      direccion
      telefono
      departamento
      ciudad
    }
  }
`;

// ACTUALIZADO: Mutación para crear órdenes (pedidos) con la nueva estructura de items.
export const CREATE_PEDIDO = gql`
  mutation createOrden($input: OrdenInput!) {
    createOrden(input: $input) {
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
      items {
        id # ID de la ProductoVariacion
        ProductoOrden {
          cantidad
          precioUnitario
        }
      }
    }
  }
`;

export const UPDATE_ORDEN_ESTADO = gql`
  mutation UpdateOrdenEstado($id: ID!, $estado: String!) {
    updateOrdenEstado(id: $id, estado: $estado) {
      id
      estado
    }
  }
`;

export const DELETE_ORDEN = gql`
  mutation DeleteOrden($id: ID!) {
    deleteOrden(id: $id)
  }
`;

