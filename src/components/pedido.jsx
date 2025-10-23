import {
  Container,
  Form,
  Row,
  Col,
  Button,
  Card,
  ListGroup,
} from "react-bootstrap";
import data from "../utils/colombia.json";
import { useState } from "react";
import ValidateCliente from "../services/cliente.service";
import { useMutation } from "@apollo/client";
import { CREATE_PEDIDO } from "../graphql/mutations/productMutatios";
import { useMainStore } from "../store/useMainStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import AvisoPrivacidad from "./AvisoPrivacidad"; // Asumo que este componente existe
import { useNavigate } from "react-router-dom";

const Pedido = () => {
  const departamentos = data.map((item) => item.departamento);
  const [ciudades, setCiudades] = useState([]);
  const [ciudad, setCiudad] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [pais] = useState("Colombia");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [aceptaPoliticas, setAceptaPoliticas] = useState(false);
  const navigate = useNavigate();

  const addOrden = useMainStore((state) => state.addOrden);

  const [productKart, setProductKart] = useState(
    JSON.parse(localStorage.getItem("kartProducts")) || []
  );

  const datacliente = {
    nombre,
    apellido,
    documento,
    direccion,
    telefono,
    email,
    departamento,
    ciudad,
  };

  const clearCliente = () => {
    setNombre("");
    setApellido("");
    setDocumento("");
    setDireccion("");
    setTelefono("");
    setEmail("");
    setDepartamento("");
    setCiudad("");
  };

  const formatPrice = (price) => {
    return price.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const productos = productKart.map((producto) => ({
    productoId: producto.id,
    cantidad: producto.cantidad,
    precioUnitario: producto.precio,
    color: producto.color,
    talla: producto.talla,
  }));

  const subtotal = productKart.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  const costoEnvio = 15000;
  const totalAPagar = subtotal + costoEnvio;

  const [createOrden, { data: producData, loading, error }] =
    useMutation(CREATE_PEDIDO);

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);
    console.log("Departamento seleccionado:", departamento);
    // Reset ciudades when departamento changes
    setCiudades([]);
    setCiudad(""); // Reset ciudad when departamento changes
    const filteredCiudades =
      data.find((item) => item.departamento === selectedDepartamento)
        ?.ciudades || [];
    // Aquí podrías actualizar el estado de las ciudades si estás usando React state
    setCiudades(filteredCiudades);
  };

  const handleCiudadChange = (e) => {
    setCiudad(e.target.value);
  };

  const handlesubmit = async (e) => {
    e.preventDefault();

    try {
      const cliente = await ValidateCliente(datacliente);
      const clienteId = cliente?.id;

      if (!clienteId) {
        throw new Error(
          `no se recibio un ID de cliente valido, el valor recibido fue ${clienteId}`
        );
      }

      const input = {
        clienteId: clienteId,
        fecha: new Date().toISOString(),
        total: totalAPagar,
        estado: "pendiente",
        productos,
      };

      const { data } = await createOrden({ variables: { input } });
      addOrden(data.createOrden);

      localStorage.removeItem("kartProducts");
      clearCliente();
      setProductKart([]);
      mostrarExito("Pedido creado con éxito");
      navigate(`/detallesPedido/${data.createOrden.id}`);
    } catch (error) {
      mostrarError(
        "Error al crear el pedido",
        error?.message || "Error desconocido"
      );
      console.log(error);
    }
  };
  return (
    <>
      <Container>
        <h1>Datos de envío y Facturación</h1>
        <Row className="mt-4">
          <Col md={8}>
            <Form onSubmit={handlesubmit}>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre de quien recibe"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellidos"
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Documento</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Cédula de ciudadanía"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Dirección de entrega"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="3151234567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Andres@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>País</Form.Label>
                    <Form.Control value={pais} readOnly disabled />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Departamento</Form.Label>
                    <Form.Select
                      value={departamento}
                      onChange={handleDepartamentoChange}
                    >
                      <option value="" disabled>
                        Selecciona un departamento
                      </option>
                      {departamentos.map((dep, index) => (
                        <option key={index} value={dep}>
                          {dep}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {departamento && (
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Ciudad / Municipio</Form.Label>
                      <Form.Select value={ciudad} onChange={handleCiudadChange}>
                        <option value="" disabled>
                          Selecciona una ciudad
                        </option>
                        {ciudades.map((ciudad, index) => (
                          <option key={index} value={ciudad}>
                            {ciudad}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12} className="mt-4">
                    <AvisoPrivacidad />
                    <Form.Group controlId="formAceptaPoliticas">
                      <Form.Check
                        type="checkbox"
                        checked={aceptaPoliticas}
                        onChange={(e) => setAceptaPoliticas(e.target.checked)}
                        label="He leído y acepto la Política de Tratamiento de Datos."
                        required
                      />
                    </Form.Group>
                  </Col>
                  <div className="d-grid gap-2 mt-4">
                    <Row>
                      <Col>
                        <Button variant="primary" size="lg" className="w-100" disabled={!aceptaPoliticas || loading}>
                          Pagar Ahora
                        </Button>
                      </Col>
                      <Col>
                        <Button type="submit" variant="success" size="lg" className="w-100" disabled={!aceptaPoliticas || loading}>
                          {loading ? "Enviando..." : "Pagar Contra Entrega"}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Row>
              )}
            </Form>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header as="h5">Resumen de tu pedido</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {productKart.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        {item.nombre} ({item.cantidad})
                        <br />
                        <small className="text-muted">
                          Talla: {item.talla} / Color: {item.color}
                        </small>
                      </div>
                      <span>{formatPrice(item.precio * item.cantidad)}</span>
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Subtotal</span>
                    <strong>{formatPrice(subtotal)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Envío</span>
                    <strong>{formatPrice(costoEnvio)}</strong>
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="d-flex justify-content-between"
                    style={{ backgroundColor: "#f0f0f0" }}
                  >
                    <h5>Total a Pagar</h5>
                    <h5>{formatPrice(totalAPagar)}</h5>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Pedido;
