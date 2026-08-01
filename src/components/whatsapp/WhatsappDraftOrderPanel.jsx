import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Empty,
  Input,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import { mostrarError } from "../../utils/hookMensajes";

const normalizeDraftItems = (draftOrderData) =>
  Array.isArray(draftOrderData?.items) ? draftOrderData.items : [];

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? currencyFormatter.format(amount) : "No definido";
};

const buildDraftEditorState = (conversation) => {
  const draftOrderData = conversation?.draftOrderData;
  const customer = draftOrderData?.customer ?? {};

  return {
    customerName:
      customer.name ||
      draftOrderData?.customerName ||
      draftOrderData?.nombreCliente ||
      conversation?.customer?.nombre ||
      "",
    customerPhone: customer.phone || conversation?.phoneNumber || "",
    city: customer.city || conversation?.customer?.ciudad || "",
    address: customer.address || conversation?.customer?.direccion || "",
    saleType: draftOrderData?.saleType || undefined,
    notes: draftOrderData?.notes || draftOrderData?.notas || "",
    itemsJson: JSON.stringify(normalizeDraftItems(draftOrderData), null, 2),
  };
};

const WhatsappDraftOrderPanel = ({ conversation, loading, onSaveDraft }) => {
  const draftOrderData = conversation?.draftOrderData;
  const items = normalizeDraftItems(draftOrderData);
  const [editorState, setEditorState] = useState(() =>
    buildDraftEditorState(conversation)
  );

  useEffect(() => {
    setEditorState(buildDraftEditorState(conversation));
  }, [conversation]);

  const missingFields = useMemo(
    () =>
      Array.isArray(draftOrderData?.missingFields) ? draftOrderData.missingFields : [],
    [draftOrderData]
  );

  const handleFieldChange = (field, value) => {
    setEditorState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!onSaveDraft) {
      return;
    }

    let parsedItems = [];
    const trimmedItems = editorState.itemsJson.trim();

    if (trimmedItems) {
      try {
        parsedItems = JSON.parse(trimmedItems);
      } catch (error) {
        mostrarError("El JSON de items no es valido", error?.message);
        return;
      }
    }

    if (!Array.isArray(parsedItems)) {
      mostrarError("El borrador requiere un arreglo de items");
      return;
    }

    await onSaveDraft({
      customer: {
        name: editorState.customerName,
        phone: editorState.customerPhone,
        city: editorState.city,
        address: editorState.address,
      },
      saleType: editorState.saleType || null,
      notes: editorState.notes,
      items: parsedItems,
    });
  };

  const itemColumns = [
    {
      title: "Variacion",
      dataIndex: "productoVariacionId",
      key: "productoVariacionId",
      render: (value, record) =>
        record?.nombreProducto ||
        record?.productName ||
        `#${value || record?.variationId || "sin referencia"}`,
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
      render: (value, record) => value ?? record?.quantity ?? 0,
    },
    {
      title: "Precio",
      dataIndex: "precioUnitario",
      key: "precioUnitario",
      render: (value, record) =>
        formatCurrency(value ?? record?.unitPrice ?? record?.estimatedUnitPrice),
    },
  ];

  return (
    <Card title="Borrador de pedido" className="whatsapp-panel-card">
      {conversation?.order && (
        <div className="whatsapp-order-link-wrap">
          <Tag color="green">Pedido relacionado</Tag>
          <Link to={`/detallesPedido/${conversation.order.id}`}>
            <Button type="link">Abrir pedido {conversation.order.numeroOrden}</Button>
          </Link>
        </div>
      )}

      {draftOrderData ? (
        <>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Cliente">
              {draftOrderData.customer?.name ||
                draftOrderData.customerName ||
                draftOrderData.nombreCliente ||
                conversation?.customer?.nombre ||
                "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Telefono">
              {draftOrderData.customer?.phone ||
                conversation?.phoneNumber ||
                "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo de venta">
              {draftOrderData.saleType || "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Metodo de pago">
              {draftOrderData.paymentMethod ||
                draftOrderData.metodoPago ||
                "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Ciudad">
              {draftOrderData.customer?.city || "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Direccion">
              {draftOrderData.customer?.address || "PENDIENTE DE CONFIRMAR"}
            </Descriptions.Item>
            <Descriptions.Item label="Total estimado">
              {formatCurrency(draftOrderData.total || draftOrderData.estimatedTotal)}
            </Descriptions.Item>
            <Descriptions.Item label="Notas">
              {draftOrderData.notes ||
                draftOrderData.notas ||
                draftOrderData.shippingAddress ||
                "Sin notas"}
            </Descriptions.Item>
          </Descriptions>

          {missingFields.length ? (
            <div className="whatsapp-draft-missing-fields">
              <Typography.Text strong>Campos minimos faltantes:</Typography.Text>
              <div style={{ marginTop: 8 }}>
                {missingFields.map((field) => (
                  <Tag key={field} color="orange">
                    {field}
                  </Tag>
                ))}
              </div>
            </div>
          ) : (
            <Tag color="green" style={{ marginTop: 12 }}>
              Borrador con campos minimos completos
            </Tag>
          )}

          <Table
            className="whatsapp-draft-table"
            columns={itemColumns}
            dataSource={items.map((item, index) => ({
              key: `${index}-${item.id || ""}`,
              ...item,
            }))}
            locale={{ emptyText: "Sin productos en el borrador" }}
            pagination={false}
            size="small"
          />
        </>
      ) : (
        <Empty description="Esta conversacion todavia no tiene borrador guardado." />
      )}

      <Card
        size="small"
        title="Edicion manual"
        style={{ marginTop: 16 }}
        extra={<Tag color="blue">MVP</Tag>}
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Input
            placeholder="Nombre del cliente"
            value={editorState.customerName}
            onChange={(event) => handleFieldChange("customerName", event.target.value)}
          />
          <Input
            placeholder="Telefono"
            value={editorState.customerPhone}
            onChange={(event) => handleFieldChange("customerPhone", event.target.value)}
          />
          <Input
            placeholder="Ciudad"
            value={editorState.city}
            onChange={(event) => handleFieldChange("city", event.target.value)}
          />
          <Input
            placeholder="Direccion"
            value={editorState.address}
            onChange={(event) => handleFieldChange("address", event.target.value)}
          />
          <Select
            allowClear
            placeholder="Tipo de venta"
            value={editorState.saleType}
            onChange={(value) => handleFieldChange("saleType", value)}
            options={[
              { value: "RETAIL", label: "Detal" },
              { value: "WHOLESALE", label: "Mayorista" },
            ]}
          />
          <Input.TextArea
            rows={3}
            placeholder="Notas del borrador"
            value={editorState.notes}
            onChange={(event) => handleFieldChange("notes", event.target.value)}
          />
          <Input.TextArea
            rows={8}
            placeholder='Items del borrador en JSON, por ejemplo: [{"productId":12,"productName":"Pijama","quantity":6}]'
            value={editorState.itemsJson}
            onChange={(event) => handleFieldChange("itemsJson", event.target.value)}
          />
          <Button type="primary" onClick={handleSave} loading={loading}>
            Guardar borrador
          </Button>
        </Space>
      </Card>
    </Card>
  );
};

export default WhatsappDraftOrderPanel;
