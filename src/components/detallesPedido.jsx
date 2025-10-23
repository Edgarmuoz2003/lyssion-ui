import { useParams, Link } from "react-router-dom";
import { useMainStore } from "../store/useMainStore";
import { Container, Card, Table, Alert, Button } from "react-bootstrap";

const DetallesPedido = () => {
  const { id } = useParams();
  const orden = useMainStore((state) => state.getOrdenById(id));

  const formatPrice = (price) => {
    if (typeof price !== 'number') return '$0';
    return price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  if (!orden) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="warning">
          <Alert.Heading>¡Orden no encontrada!</Alert.Heading>
          <p>
            No pudimos encontrar los detalles del pedido que buscas. Es posible que el enlace sea incorrecto o que el pedido ya no exista.
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
          <p className="lead">Gracias por tu compra en <strong>Lyssion Style</strong>.</p>
        </div>
        <Alert variant="info">
          <p>
            Apreciado cliente, es un placer que nos hayas elegido. Ya estamos trabajando para enviar tu pedido lo antes posible.
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
                {orden.productos.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.producto.nombre}
                      <br />
                      <small className="text-muted">Talla: {item.talla} / Color: {item.color}</small>
                    </td>
                    <td className="text-center">{item.cantidad}</td>
                    <td className="text-end">{formatPrice(item.precioUnitario)}</td>
                    <td className="text-end">{formatPrice(item.precioUnitario * item.cantidad)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                 <tr>
                    <td colSpan="3" className="text-end"><strong>Costo de Envio:</strong></td>
                    <td className="text-end"><strong>{formatPrice(15000)}</strong></td>
                </tr>
                <tr>
                    <td colSpan="3" className="text-end"><strong>Total del Pedido:</strong></td>
                    <td className="text-end"><strong>{formatPrice(orden.total)}</strong></td>
                </tr>
              </tfoot>
            </Table>
          </Card.Body>
        </Card>

        <Alert variant="info" className="mt-4">
            <p>
                Su pedidio sera facturado a nombre de <strong>{orden.cliente.nombre} {orden.cliente.apellido}</strong> con 
                documento de identidad # <strong>{orden.cliente.documento}</strong> y sera enviado a la <strong>{orden.cliente.direccion}</strong> en 
                la ciudad de <strong>{orden.cliente.ciudad} - {orden.cliente.departamento}</strong>.
            </p>
        </Alert>
        <Alert variant="warning">
            <p>
                Si tiene dudas o inquietudes, comuniquese con nostros en nuestro canal de Whatsapp cuyo enlace encontraras
                en la parte inferior derecha de esta pagina.
            </p>
        </Alert>

      </Container>
    </>
  );
};

export default DetallesPedido;
