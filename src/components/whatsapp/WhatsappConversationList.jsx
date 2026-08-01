import { Avatar, Badge, Empty, Input, List, Select, Tag } from "antd";
import { MessageOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";

const STATUS_OPTIONS = [
  { value: "", label: "Todos los estados" },
  { value: "open", label: "Abiertas" },
  { value: "NEEDS_HUMAN", label: "Requieren humano" },
  { value: "HUMAN_ACTIVE", label: "Tomadas" },
  { value: "ORDER_CREATED", label: "Con pedido" },
];

const statusColorMap = {
  open: "processing",
  NEEDS_HUMAN: "warning",
  HUMAN_PENDING: "warning",
  HUMAN_ACTIVE: "success",
  ORDER_CREATED: "default",
};

const formatRelativeDate = (value) => {
  if (!value) return "Sin actividad";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin actividad";

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

const WhatsappConversationList = ({
  conversations,
  loading,
  selectedConversationId,
  statusFilter,
  searchValue,
  onStatusFilterChange,
  onSearchChange,
  onSelectConversation,
}) => {
  return (
    <section className="whatsapp-list-card">
      <div className="whatsapp-list-toolbar">
        <Input
          allowClear
          placeholder="Buscar por teléfono o cliente"
          prefix={<SearchOutlined />}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Select
          className="whatsapp-status-select"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={onStatusFilterChange}
        />
      </div>

      <List
        loading={loading}
        locale={{
          emptyText: <Empty description="No hay conversaciones para este filtro." />,
        }}
        dataSource={conversations}
        renderItem={(conversation) => {
          const customerName = conversation.customer
            ? `${conversation.customer.nombre} ${conversation.customer.apellido ?? ""}`.trim()
            : "Cliente sin vincular";

          return (
            <List.Item
              className={`whatsapp-list-item ${
                selectedConversationId === conversation.id ? "is-selected" : ""
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <List.Item.Meta
                avatar={
                  <Badge
                    status={statusColorMap[conversation.status] || "default"}
                    offset={[-4, 34]}
                  >
                    <Avatar icon={<UserOutlined />} />
                  </Badge>
                }
                title={
                  <div className="whatsapp-list-title">
                    <span>{customerName}</span>
                    <Tag>{conversation.phoneNumber}</Tag>
                  </div>
                }
                description={
                  <div className="whatsapp-list-description">
                    <p>{conversation.summary || "Sin resumen todavía."}</p>
                    <div className="whatsapp-list-meta">
                      <span>{formatRelativeDate(conversation.lastMessageAt)}</span>
                      {conversation.order?.numeroOrden && (
                        <Tag icon={<MessageOutlined />}>
                          Pedido {conversation.order.numeroOrden}
                        </Tag>
                      )}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </section>
  );
};

export default WhatsappConversationList;
