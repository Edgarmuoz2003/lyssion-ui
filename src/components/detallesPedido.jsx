import { useMemo, useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  Container,
  Card,
  Table,
  Alert,
  Button,
  Spinner,
} from "react-bootstrap";
import { useOrdenesStore } from "../utils/hooks/useOrdenesStore";
import { useVariacionesProductoMap } from "../utils/hooks/useVariacionesProductoMap";
import { normalizeOrdenProductos } from "../utils/normalizeOrden";

const DetallesPedido = () => {
  const { id } = useParams();
  const location = useLocation();
  const [syncMessage, setSyncMessage] = useState("");
  const {
    ordenes,
    loadingOrdenes,
    errorOrdenes,
    refetchOrdenes,
    syncWompiTransaction,
    sincronizandoWompi,
  } = useOrdenesStore({ where: { id } });

  const orden = ordenes?.[0] ?? null;
  const { variacionesMap } = useVariacionesProductoMap({ skip: !orden });
  const productos = useMemo(
    () => normalizeOrdenProductos(orden, { variacionesMap }),
    [orden, variacionesMap]
  );
  const subtotalProductos = useMemo(() => {
    return productos.reduce((acc, item) => {
      const cantidad = Number(item.cantidad) || 0;
      const precio = Number(item.precioUnitario) || 0;
      return acc + cantidad * precio;
    }, 0);
  }, [productos]);
  const costoEnvio = productos.length ? 15000 : 0;
  const totalOrden = Number(orden?.total) || 0;
  const totalCliente = useMemo(() => {
    const incluyeEnvio =
      Math.abs(totalOrden - subtotalProductos - costoEnvio) < 1;
    return incluyeEnvio ? totalOrden : totalOrden + costoEnvio;
  }, [totalOrden, subtotalProductos, costoEnvio]);

  const estadoLabel = useMemo(() => {
    const estado = String(orden?.estadoPago || "");
    const labels = {
      pagado: "Pagado",
      pago_pendiente: "Pago pendiente",
      pago_rechazado: "Pago rechazado",
      pago_anulado: "Pago anulado",
      pago_error: "Pago con error",
      contra_entrega_pendiente: "Contra entrega pendiente",
    };
    return labels[estado] || estado || "Sin estado";
  }, [orden?.estadoPago]);

  const paymentStatusBanner = useMemo(() => {
    const estado = String(orden?.estadoPago || "");
    const configByStatus = {
      pagado: {
        variant: "success",
        title: "Pago aprobado",
        message: "Tu pago fue confirmado exitosamente.",
      },
      pago_pendiente: {
        variant: "warning",
        title: "Pago pendiente",
        message: "Estamos confirmando tu pago con la pasarela.",
      },
      pago_rechazado: {
        variant: "danger",
        title: "Pago rechazado",
        message: "El pago fue rechazado. Puedes intentarlo nuevamente.",
      },
      pago_anulado: {
        variant: "secondary",
        title: "Pago anulado",
        message: "La transaccion fue anulada.",
      },
      pago_error: {
        variant: "danger",
        title: "Error en el pago",
        message: "Ocurrio un error al procesar el pago.",
      },
      contra_entrega_pendiente: {
        variant: "primary",
        title: "Pago contra entrega",
        message: "Pagas al recibir tu pedido.",
      },
      no_aplica: {
        variant: "secondary",
        title: "Pago no aplica",
        message: "Esta orden no tiene pago online asociado.",
      },
    };

    return (
      configByStatus[estado] || {
        variant: "info",
        title: "Estado de pago",
        message: estadoLabel || "Pendiente de confirmacion",
      }
    );
  }, [orden?.estadoPago, estadoLabel]);

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const transactionId = search.get("transactionId");
    if (!transactionId) return;

    let ignore = false;
    const syncPayment = async () => {
      try {
        const { data } = await syncWompiTransaction({
          variables: { transactionId },
        });
        if (ignore) return;
        const result = data?.syncWompiTransaction;
        setSyncMessage(
          result?.message ||
            "Se sincronizo el estado de tu pago con Wompi."
        );
        await refetchOrdenes();
      } catch (error) {
        if (ignore) return;
        setSyncMessage(
          error?.message ||
            "No fue posible sincronizar el estado del pago con Wompi."
        );
      }
    };

    syncPayment();
    return () => {
      ignore = true;
    };
  }, [location.search, syncWompiTransaction, refetchOrdenes]);

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice)) return "$0";

    return numericPrice.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (loadingOrdenes) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
        <p className="mt-3">Cargando información del pedido...</p>
      </Container>
    );
  }

  if (errorOrdenes) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          <Alert.Heading>No pudimos obtener el pedido</Alert.Heading>
          <p>{errorOrdenes.message}</p>
          <div className="d-flex justify-content-end">
            <Button as={Link} to="/" variant="dark">
              Volver a la tienda
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!orden) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <Alert.Heading>¡Orden no encontrada!</Alert.Heading>
          <p>
            No pudimos encontrar los detalles del pedido que buscas. Es posible
            que el enlace sea incorrecto o que el pedido ya no exista.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button as={Link} to="/" variant="dark">
              Volver a la tienda
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        <div className="text-center mb-4">
          <h1>¡Pedido enviado con éxito!</h1>
          <p className="lead">
            Gracias por tu compra en <strong>Lyssion Style</strong>.
          </p>
        </div>
        <Alert variant={paymentStatusBanner.variant} className="py-4 mb-4">
          <h2 className="mb-2 text-center">{paymentStatusBanner.title}</h2>
          <p className="mb-0 text-center">{paymentStatusBanner.message}</p>
        </Alert>
        <Alert variant="info">
          <p className="mb-1">
            <strong>Estado de orden:</strong> {orden?.estado || "Sin estado"}
          </p>
          <p className="mb-1">
            <strong>Estado de pago:</strong> {estadoLabel}
          </p>
          {sincronizandoWompi ? (
            <p className="mb-0">Sincronizando estado de pago...</p>
          ) : null}
          {syncMessage ? <p className="mb-0">{syncMessage}</p> : null}
        </Alert>
        <Alert variant="info">
          <p>
            Apreciado cliente, es un placer que nos hayas elegido. Ya estamos
            trabajando para enviar tu pedido lo antes posible.
          </p>
          <p className="mb-0">
            En breve, uno de nuestros asesores se comunicará contigo para
            confirmar los detalles de su pedido y organizar su entrega. Le
            informamos que si no logramos contactarte, tu pedido no podrá ser
            enviado.
          </p>
        </Alert>
        <hr />
        <p>Estos son los detalles de tu pedido:</p>

        <Card>
          <Card.Header as="h5">
            Orden de compra número: {orden.numeroOrden}
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th className="text-center">Cantidad</th>
                  <th className="text-end">Precio Unitario</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.nombre}
                      <br />
                      <small className="text-muted">
                        Talla: {item.talla} / Color: {item.color}
                      </small>
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">
                      {formatPrice(item.precioUnitario)}
                    </td>
                    <td className="text-end">
                      {formatPrice(item.precioUnitario * item.cantidad)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Costo de Envio:</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatPrice(costoEnvio)}</strong>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end">
                    <strong>Total del Pedido:</strong>
                  </td>
                  <td className="text-end">
                    <strong>{formatPrice(totalCliente)}</strong>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>

        <Alert variant="info" className="mt-4">
          <p>
            Su pedidio sera facturado a nombre de{" "}
            <strong>
              {orden.cliente.nombre} {orden.cliente.apellido}
            </strong>{" "}
            con documento de identidad #{" "}
            <strong>{orden.cliente.documento}</strong> y sera enviado a la{" "}
            <strong>{orden.cliente.direccion}</strong> en la ciudad de{" "}
            <strong>
              {orden.cliente.ciudad} - {orden.cliente.departamento}
            </strong>
            .
          </p>
        </Alert>
        <Alert variant="warning">
          <p>
            Si tiene dudas o inquietudes, comuniquese con nostros en nuestro
            canal de Whatsapp cuyo enlace encontraras en la parte inferior
            derecha de esta pagina.
          </p>
        </Alert>
      </Container>
    </>
  );
};

export default DetallesPedido;



