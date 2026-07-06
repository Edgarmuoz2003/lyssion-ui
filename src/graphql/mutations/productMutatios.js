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
        precioMayorista
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

export const UPDATE_PRODUCTS = gql`
  mutation UpdateProducts($id: ID!, $input: UpdateProductoInput!) {
    updateProducto(id: $id, input: $input) {
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
        precioMayorista
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

export const SUBIR_BANNERS = gql`
  mutation SubirBanners($archivos: [Upload!]!) {
    subirBanners(archivos: $archivos) {
      id
      nombre
      url
      public_id
      activo
      posicion
    }
  }
`;

export const PUBLICAR_BANNERS = gql`
  mutation PublicarBanners($ids: [ID!]!, $modo: String!) {
    publicarBanners(ids: $ids, modo: $modo) {
      id
      nombre
      url
      public_id
      activo
      posicion
    }
  }
`;

export const DELETE_BANNERS = gql`
  mutation DeleteBanners($ids: [ID!]!) {
    deleteBanners(ids: $ids)
  }
`;

export const SUBIR_CATEGORIA_MENU_IMAGENES = gql`
  mutation SubirCategoriaMenuImagenes($archivos: [Upload!]!) {
    subirCategoriaMenuImagenes(archivos: $archivos) {
      id
      nombre
      url
      public_id
      activo
      categoriaId
      categoria {
        id
        nombre
      }
    }
  }
`;

export const PUBLICAR_CATEGORIA_MENU_IMAGEN = gql`
  mutation PublicarCategoriaMenuImagen($categoriaId: ID!, $imagenId: ID!) {
    publicarCategoriaMenuImagen(categoriaId: $categoriaId, imagenId: $imagenId) {
      id
      nombre
      url
      public_id
      activo
      categoriaId
      categoria {
        id
        nombre
      }
    }
  }
`;

export const DELETE_CATEGORIA_MENU_IMAGENES = gql`
  mutation DeleteCategoriaMenuImagenes($ids: [ID!]!) {
    deleteCategoriaMenuImagenes(ids: $ids)
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

export const UPDATE_CLIENTE = gql`
  mutation updateCliente($id: ID!, $input: ClienteInput!) {
    updateCliente(id: $id, input: $input) {
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
      estadoPago
      cliente {
        id
        nombre
        apellido
        documento
        email
        telefono
        direccion
        ciudad
        departamento
      }
      items {
        id # ID de la ProductoVariacion
        infoTalla {
          nombre
        }
        infoColor {
          nombre
        }
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

export const CREATE_WOMPI_CHECKOUT = gql`
  mutation CreateWompiCheckout($ordenId: ID!, $totalEnCentavos: Int) {
    createWompiCheckout(ordenId: $ordenId, totalEnCentavos: $totalEnCentavos) {
      publicKey
      currency
      amountInCents
      reference
      integritySignature
      redirectUrl
      expirationTime
      widgetScriptUrl
      customerData {
        email
        fullName
        phoneNumber
        phoneNumberPrefix
        legalId
        legalIdType
      }
    }
  }
`;

export const SYNC_WOMPI_TRANSACTION = gql`
  mutation SyncWompiTransaction($transactionId: String!) {
    syncWompiTransaction(transactionId: $transactionId) {
      ok
      message
      orderId
      transactionId
      reference
      wompiStatus
      internalEstadoPago
      statusMessage
    }
  }
`;

export const UPDATE_CONFIGURACION_TIENDA = gql`
  mutation UpdateConfiguracionTienda($costoEnvio: Int!) {
    updateConfiguracionTienda(costoEnvio: $costoEnvio) {
      id
      costoEnvio
      updatedAt
    }
  }
`;



