import { gql } from "@apollo/client";

export const SEND_WHATSAPP_MANUAL_MESSAGE = gql`
  mutation SendWhatsappManualMessage($conversationId: ID!, $text: String!) {
    sendWhatsappManualMessage(conversationId: $conversationId, text: $text) {
      id
      conversationId
      direction
      senderType
      type
      text
      status
      createdAt
      sentByUser {
        id
        nombre
      }
    }
  }
`;

export const TAKE_WHATSAPP_CONVERSATION = gql`
  mutation TakeWhatsappConversation($conversationId: ID!) {
    takeWhatsappConversation(conversationId: $conversationId) {
      id
      status
      assignedUserId
      agentEnabled
    }
  }
`;

export const RELEASE_WHATSAPP_CONVERSATION = gql`
  mutation ReleaseWhatsappConversation($conversationId: ID!, $enableAgent: Boolean!) {
    releaseWhatsappConversation(
      conversationId: $conversationId
      enableAgent: $enableAgent
    ) {
      id
      status
      assignedUserId
      agentEnabled
    }
  }
`;

export const PAUSE_WHATSAPP_AGENT = gql`
  mutation PauseWhatsappAgent($conversationId: ID!) {
    pauseWhatsappAgent(conversationId: $conversationId) {
      id
      status
      assignedUserId
      agentEnabled
    }
  }
`;

export const REQUEST_WHATSAPP_HUMAN_HANDOFF = gql`
  mutation RequestWhatsappHumanHandoff($conversationId: ID!, $reason: String!) {
    requestHumanHandoff(conversationId: $conversationId, reason: $reason) {
      id
      status
      assignedUserId
      agentEnabled
    }
  }
`;

export const UPDATE_WHATSAPP_DRAFT_ORDER = gql`
  mutation UpdateWhatsappDraftOrder($conversationId: ID!, $patch: JSON!) {
    updateWhatsappDraftOrder(conversationId: $conversationId, patch: $patch) {
      id
      draftOrderData
      updatedAt
    }
  }
`;
