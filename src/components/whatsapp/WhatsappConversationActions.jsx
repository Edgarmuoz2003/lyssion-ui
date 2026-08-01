import { Button, Space, Tag } from "antd";

const getStatusMeta = (conversation) => {
  const status = String(conversation?.status || "");

  if (status === "HUMAN_ACTIVE") {
    return { color: "blue", label: "Humano en control" };
  }

  if (status === "NEEDS_HUMAN" || status === "HUMAN_PENDING") {
    return { color: "orange", label: "Intervencion humana requerida" };
  }

  if (status === "ORDER_CREATED") {
    return { color: "default", label: "Pedido creado" };
  }

  return { color: "processing", label: "Bot activo" };
};

const WhatsappConversationActions = ({
  conversation,
  onTake,
  onRelease,
  onPause,
  loading,
}) => {
  const isTaken = Boolean(conversation?.assignedUserId);
  const isAgentEnabled = Boolean(conversation?.agentEnabled);
  const statusMeta = getStatusMeta(conversation);

  return (
    <div className="whatsapp-actions-card">
      <div className="whatsapp-actions-status">
        <Tag color={statusMeta.color}>{statusMeta.label}</Tag>
        <Tag color={isAgentEnabled ? "green" : "orange"}>
          {isAgentEnabled ? "Agente activo" : "Agente pausado"}
        </Tag>
        {isTaken ? <Tag color="blue">Tomada</Tag> : <Tag>Sin asignar</Tag>}
      </div>
      <Space wrap>
        <Button type="primary" onClick={onTake} disabled={isTaken} loading={loading}>
          Tomar conversacion
        </Button>
        <Button onClick={onRelease} disabled={!isTaken} loading={loading}>
          Liberar al agente
        </Button>
        <Button onClick={onPause} disabled={!isAgentEnabled} loading={loading}>
          Pausar agente
        </Button>
      </Space>
    </div>
  );
};

export default WhatsappConversationActions;
