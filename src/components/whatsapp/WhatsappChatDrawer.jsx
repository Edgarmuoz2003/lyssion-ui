import { useEffect, useMemo, useState } from "react";
import { Button, Card, Drawer, Empty, Input, Space, Spin, Tag, Typography } from "antd";
import { Link } from "react-router-dom";
import WhatsappMessageBubble from "./WhatsappMessageBubble";
import WhatsappConversationActions from "./WhatsappConversationActions";
import WhatsappDraftOrderPanel from "./WhatsappDraftOrderPanel";

const { TextArea } = Input;
const { Paragraph, Text, Title } = Typography;

const WhatsappChatDrawer = ({
  open,
  conversation,
  loading,
  actionLoading,
  onClose,
  onSendMessage,
  onTakeConversation,
  onReleaseConversation,
  onPauseAgent,
  onUpdateDraftOrder,
}) => {
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    if (!open) {
      setMessageText("");
    }
  }, [open]);

  const customerName = useMemo(() => {
    if (!conversation?.customer) return "Cliente sin vincular";
    return `${conversation.customer.nombre} ${conversation.customer.apellido ?? ""}`.trim();
  }, [conversation?.customer]);

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const ok = await onSendMessage(trimmed);
    if (ok) {
      setMessageText("");
    }
  };

  return (
    <Drawer
      title="Conversación de WhatsApp"
      placement="right"
      width={720}
      onClose={onClose}
      open={open}
      destroyOnClose={false}
    >
      {loading ? (
        <div className="whatsapp-drawer-loading">
          <Spin />
        </div>
      ) : !conversation ? (
        <Empty description="Selecciona una conversación para verla." />
      ) : (
        <div className="whatsapp-drawer-layout">
          <Card className="whatsapp-panel-card">
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <div className="whatsapp-header-row">
                <Title level={4}>{customerName}</Title>
                <Tag>{conversation.phoneNumber}</Tag>
              </div>
              <Space wrap>
                <Tag color="processing">{conversation.status}</Tag>
                <Tag color={conversation.agentEnabled ? "green" : "orange"}>
                  {conversation.agentEnabled ? "Agente activo" : "Agente pausado"}
                </Tag>
              </Space>
              <Text type="secondary">{conversation.summary || "Sin resumen todavía."}</Text>
              {conversation.order && (
                <Paragraph className="mb-0">
                  Pedido relacionado:{" "}
                  <Link to={`/detallesPedido/${conversation.order.id}`}>
                    {conversation.order.numeroOrden}
                  </Link>
                </Paragraph>
              )}
            </Space>
          </Card>

          <WhatsappConversationActions
            conversation={conversation}
            onTake={onTakeConversation}
            onRelease={onReleaseConversation}
            onPause={onPauseAgent}
            loading={actionLoading}
          />

          <Card title="Mensajes" className="whatsapp-panel-card">
            {conversation.messages?.length ? (
              <div className="whatsapp-messages-list">
                {conversation.messages.map((message) => (
                  <WhatsappMessageBubble key={message.id} message={message} />
                ))}
              </div>
            ) : (
              <Empty description="No hay mensajes para esta conversación." />
            )}

            <div className="whatsapp-reply-box">
              <TextArea
                rows={4}
                placeholder="Responde como Lyssion..."
                value={messageText}
                onChange={(event) => setMessageText(event.target.value)}
              />
              <div className="whatsapp-reply-actions">
                <Button type="primary" onClick={handleSend} loading={actionLoading}>
                  Enviar mensaje
                </Button>
              </div>
            </div>
          </Card>

          <WhatsappDraftOrderPanel
            conversation={conversation}
            loading={actionLoading}
            onSaveDraft={onUpdateDraftOrder}
          />
        </div>
      )}
    </Drawer>
  );
};

export default WhatsappChatDrawer;
