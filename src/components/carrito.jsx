import { Container, Button, Table, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaCreditCard } from "react-icons/fa";
import ValoresLyssion from "../layouts/valoresLyssion";
import { useKartProductos } from "@/utils/hooks/useKartProductos";

const formatPrice = (value) => {
  const numericValue = Number(value) || 0;
  return numericValue.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const Carrito = () => {
  const { kartProductos, hasProducts, total, clearKart } = useKartProductos();
  const navigate = useNavigate();

  const fullName = (producto) =>
    `${producto?.nombre} talla ${producto?.talla} color ${producto?.color}`;

  const handleResetKart = () => {
    if (window.confirm("Estas seguro de que deseas vaciar el carrito?")) {
      clearKart();
    }
  };

  return (
    <Container className="mt-4">
      <ValoresLyssion />
      <h1 className="m-4">Carrito de compras</h1>
      {!hasProducts ? (
        <div className="text-center p-5">
          <h2>No hay productos en el carrito</h2>
          <Button variant="dark" onClick={() => navigate("/")}>
            <FaArrowLeft /> Volver a la tienda
          </Button>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {kartProductos.map((producto, index) => (
                <tr key={`${producto?.variationId || producto?.id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center">
                      {producto?.imagen && (
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          style={{
                            width: "50px",
                            height: "60px",
                            objectFit: "cover",
                            marginRight: "10px",
                          }}
                        />
                      )}
                      {fullName(producto)}
                    </div>
                  </td>
                  <td>{formatPrice(producto?.precio)}</td>
                  <td>{producto?.cantidad}</td>
                  <td>{formatPrice(Number(producto?.precio) * Number(producto?.cantidad))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"></td>
                <td className="text-end">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{formatPrice(total)}</strong>
                </td>
              </tr>
            </tfoot>
          </Table>
          <Row className="mt-4 justify-content-end">
            <Col md="auto">
              <Button
                variant="secondary"
                onClick={() => navigate(-1)}
                className="me-2"
              >
                <FaArrowLeft /> Seguir comprando
              </Button>
              <Button variant="danger" onClick={handleResetKart} className="me-2">
                <FaTrash /> Vaciar carrito
              </Button>
              <Button variant="dark" onClick={() => navigate("/pedido")}>
                <FaCreditCard /> Realizar pedido
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Carrito;
