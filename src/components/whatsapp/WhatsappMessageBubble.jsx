import { Tag } from "antd";

const formatMessageTime = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const getBubbleMeta = (message) => {
  const normalizedSenderType = String(message?.senderType || "").toUpperCase();

  if (message.direction === "outbound") {
    return {
      alignClassName: "is-outbound",
      author: message.sentByUser?.nombre || "Equipo Lyssion",
      toneClassName: normalizedSenderType === "AGENT" ? "is-customer" : "is-human",
    };
  }

  return {
    alignClassName: "is-inbound",
    author: "Cliente",
    toneClassName: "is-customer",
  };
};

const WhatsappMessageBubble = ({ message }) => {
  const normalizedSenderType = String(message?.senderType || "").toUpperCase();
  const { alignClassName, author, toneClassName } = getBubbleMeta(message);
  const fallbackText =
    message.type && message.type !== "text"
      ? `Mensaje tipo ${message.type}`
      : "Mensaje sin texto";

  return (
    <div className={`whatsapp-message-row ${alignClassName}`}>
      <article className={`whatsapp-message-bubble ${toneClassName}`}>
        <div className="whatsapp-message-head">
          <strong>{author}</strong>
          {normalizedSenderType === "AGENT" && <Tag color="gold">Agente</Tag>}
          {normalizedSenderType === "HUMAN" && <Tag color="blue">Humano</Tag>}
        </div>
        <p>{message.text || fallbackText}</p>
        <time>{formatMessageTime(message.createdAt)}</time>
      </article>
    </div>
  );
};

export default WhatsappMessageBubble;
