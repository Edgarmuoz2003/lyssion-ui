import { gql } from "@apollo/client";

export const GET_WHATSAPP_CONVERSATIONS = gql`
  query GetWhatsappConversations(
    $status: String
    $search: String
    $limit: Int
    $offset: Int
  ) {
    whatsappConversations(
      status: $status
      search: $search
      limit: $limit
      offset: $offset
    ) {
      id
      phoneNumber
      status
      assignedUserId
      agentEnabled
      summary
      lastMessageAt
      customer {
        id
        nombre
        apellido
        telefono
      }
      order {
        id
        numeroOrden
        estado
      }
    }
  }
`;

export const GET_WHATSAPP_CONVERSATION = gql`
  query GetWhatsappConversation($id: ID!) {
    whatsappConversation(id: $id) {
      id
      phoneNumber
      status
      assignedUserId
      agentEnabled
      summary
      draftOrderData
      lastMessageAt
      createdAt
      updatedAt
      customer {
        id
        nombre
        apellido
        telefono
        email
        direccion
        ciudad
        departamento
      }
      order {
        id
        numeroOrden
        estado
        estadoPago
        total
      }
      assignedUser {
        id
        nombre
        email
      }
      messages {
        id
        direction
        senderType
        type
        text
        payload
        status
        createdAt
        sentByUser {
          id
          nombre
          email
        }
      }
    }
  }
`;
