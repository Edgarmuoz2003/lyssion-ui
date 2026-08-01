import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Col, Row, Spin, Typography } from "antd";
import { MessageOutlined, ReloadOutlined } from "@ant-design/icons";
import { Container } from "react-bootstrap";
import {
  GET_WHATSAPP_CONVERSATION,
  GET_WHATSAPP_CONVERSATIONS,
} from "../../graphql/queries/whatsappQueries";
import {
  PAUSE_WHATSAPP_AGENT,
  RELEASE_WHATSAPP_CONVERSATION,
  SEND_WHATSAPP_MANUAL_MESSAGE,
  TAKE_WHATSAPP_CONVERSATION,
  UPDATE_WHATSAPP_DRAFT_ORDER,
} from "../../graphql/mutations/whatsappMutations";
import { mostrarError, mostrarExito } from "../../utils/hookMensajes";
import WhatsappConversationList from "./WhatsappConversationList";
import WhatsappChatDrawer from "./WhatsappChatDrawer";

const { Paragraph, Title } = Typography;

const LIST_POLL_INTERVAL = 8000;
const DETAIL_POLL_INTERVAL = 5000;

const WhatsappInboxPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const listVariables = useMemo(
    () => ({
      status: statusFilter || null,
      search: searchValue.trim() || null,
      limit: 20,
      offset: 0,
    }),
    [searchValue, statusFilter]
  );

  const {
    data: listData,
    loading: listLoading,
    refetch: refetchList,
  } = useQuery(GET_WHATSAPP_CONVERSATIONS, {
    variables: listVariables,
    pollInterval: LIST_POLL_INTERVAL,
    fetchPolicy: "network-only",
  });

  const {
    data: detailData,
    loading: detailLoading,
    refetch: refetchDetail,
  } = useQuery(GET_WHATSAPP_CONVERSATION, {
    variables: { id: selectedConversationId },
    skip: !selectedConversationId,
    pollInterval: drawerOpen && selectedConversationId ? DETAIL_POLL_INTERVAL : 0,
    fetchPolicy: "network-only",
  });

  const [sendMessage, sendMessageState] = useMutation(SEND_WHATSAPP_MANUAL_MESSAGE);
  const [takeConversation, takeConversationState] = useMutation(
    TAKE_WHATSAPP_CONVERSATION
  );
  const [releaseConversation, releaseConversationState] = useMutation(
    RELEASE_WHATSAPP_CONVERSATION
  );
  const [pauseAgent, pauseAgentState] = useMutation(PAUSE_WHATSAPP_AGENT);
  const [updateDraftOrder, updateDraftOrderState] = useMutation(
    UPDATE_WHATSAPP_DRAFT_ORDER
  );

  const conversations = listData?.whatsappConversations ?? [];
  const selectedConversation = detailData?.whatsappConversation ?? null;
  const actionLoading =
    sendMessageState.loading ||
    takeConversationState.loading ||
    releaseConversationState.loading ||
    pauseAgentState.loading ||
    updateDraftOrderState.loading;

  const refreshSelectedConversation = async () => {
    const tasks = [refetchList()];
    if (selectedConversationId) {
      tasks.push(refetchDetail());
    }
    await Promise.all(tasks);
  };

  const handleSelectConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setDrawerOpen(true);
  };

  const runConversationAction = async (runner, successMessage, variables) => {
    try {
      await runner({ variables });
      mostrarExito(successMessage);
      await refreshSelectedConversation();
      return true;
    } catch (error) {
      mostrarError("No fue posible actualizar la conversación", error?.message);
      return false;
    }
  };

  const handleSendMessage = async (text) =>
    runConversationAction(sendMessage, "Mensaje enviado correctamente.", {
      conversationId: selectedConversationId,
      text,
    });

  const handleTakeConversation = async () =>
    runConversationAction(takeConversation, "Conversación tomada.", {
      conversationId: selectedConversationId,
    });

  const handleReleaseConversation = async () =>
    runConversationAction(releaseConversation, "Conversación liberada.", {
      conversationId: selectedConversationId,
      enableAgent: true,
    });

  const handlePauseAgent = async () =>
    runConversationAction(pauseAgent, "Agente pausado para esta conversación.", {
      conversationId: selectedConversationId,
    });

  const handleUpdateDraftOrder = async (patch) =>
    runConversationAction(updateDraftOrder, "Borrador actualizado.", {
      conversationId: selectedConversationId,
      patch,
    });

  return (
    <Container className="banner-config-page whatsapp-inbox-page">
      <div className="whatsapp-page-hero">
        <div>
          <Title level={2}>Bandeja de conversaciones</Title>
          <Paragraph>
            Vista administrativa inicial para seguimiento humano del agente con
            polling de Apollo y respuesta manual.
          </Paragraph>
        </div>
        <Button icon={<ReloadOutlined />} onClick={() => refreshSelectedConversation()}>
          Refrescar
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <div className="whatsapp-summary-strip">
            <span>
              <MessageOutlined /> Conversaciones cargadas: <strong>{conversations.length}</strong>
            </span>
            <span>Polling listado: {LIST_POLL_INTERVAL / 1000}s</span>
            <span>Polling detalle: {DETAIL_POLL_INTERVAL / 1000}s</span>
          </div>
        </Col>

        <Col xs={24}>
          {listLoading && !conversations.length ? (
            <div className="whatsapp-drawer-loading">
              <Spin />
            </div>
          ) : (
            <WhatsappConversationList
              conversations={conversations}
              loading={listLoading}
              selectedConversationId={selectedConversationId}
              statusFilter={statusFilter}
              searchValue={searchValue}
              onStatusFilterChange={setStatusFilter}
              onSearchChange={setSearchValue}
              onSelectConversation={handleSelectConversation}
            />
          )}
        </Col>
      </Row>

      <WhatsappChatDrawer
        open={drawerOpen}
        conversation={selectedConversation}
        loading={detailLoading}
        actionLoading={actionLoading}
        onClose={() => setDrawerOpen(false)}
        onSendMessage={handleSendMessage}
        onTakeConversation={handleTakeConversation}
        onReleaseConversation={handleReleaseConversation}
        onPauseAgent={handlePauseAgent}
        onUpdateDraftOrder={handleUpdateDraftOrder}
      />
    </Container>
  );
};

export default WhatsappInboxPage;
