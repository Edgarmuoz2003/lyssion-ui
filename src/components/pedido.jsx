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
import { useEffect, useState } from "react";
import { useClienteStore } from "../utils/hooks/useClienteStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import AvisoPrivacidad from "./AvisoPrivacidad";
import { Tabs } from "antd";
import SpinnerComponet from "@/layouts/spinnerComponent";
import { useOrdenesStore } from "../utils/hooks/useOrdenesStore";
import { useKartProductos } from "../utils/hooks/useKartProductos";
import { formatPrice } from "../utils/helpers";
import { DivContainer } from "@/utils/styledComponents";
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
  const [cliente, setCliente] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [submited, setSubmited] = useState(false);
  const [clienteWhere, setClienteWhere] = useState(null);
  const [activeTab, setActiveTab] = useState("datos");
  const [isEditingCliente, setIsEditingCliente] = useState(false);
  const [ordenCreada, setOrdenCreada] = useState(null);
  const navigate = useNavigate();

  const { createOrden, creandoOrden } = useOrdenesStore({ skipQuery: true });
  const {
    kartProductos,
    total: totalProductos,
    clearKart,
    hasProducts,
  } = useKartProductos();
  const {
    clientes: clientesEncontrados,
    loadingClientes,
    errorClientes,
    createCliente,
    creandoCliente,
    updateCliente,
    actualizandoCliente,
  } = useClienteStore({
    where: clienteWhere,
    skipQuery: !clienteWhere,
  });

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

  const syncFormWithCliente = (clienteData) => {
    if (!clienteData) return;
    setNombre(clienteData.nombre ?? "");
    setApellido(clienteData.apellido ?? "");
    setDocumento(clienteData.documento ?? "");
    setDireccion(clienteData.direccion ?? "");
    setTelefono(clienteData.telefono ?? "");
    setEmail(clienteData.email ?? "");
    const dept = clienteData.departamento ?? "";
    setDepartamento(dept);
    const availableCities =
      data.find((item) => item.departamento === dept)?.ciudades || [];
    setCiudades(availableCities);
    setCiudad(clienteData.ciudad ?? "");
  };

  const clearForm = () => {
    setNombre("");
    setApellido("");
    setDocumento("");
    setDireccion("");
    setTelefono("");
    setEmail("");
    setDepartamento("");
    setCiudad("");
    setCiudades([]);
  };

  const items = kartProductos.map((producto) => ({
    productoVariacionId: producto.variationId ?? null,
    cantidad: Number(producto.cantidad) || 0,
    precioUnitario: Number(producto.precio) || 0,
  }));

  const subtotal = totalProductos;
  const costoEnvio = hasProducts ? 15000 : 0;
  const totalAPagar = hasProducts ? subtotal + costoEnvio : 0;
  const totalInterno = subtotal;

  const handleDepartamentoChange = (e) => {
    const selectedDepartamento = e.target.value;
    setDepartamento(selectedDepartamento);
    setCiudades([]);
    setCiudad("");
    const filteredCiudades =
      data.find((item) => item.departamento === selectedDepartamento)
        ?.ciudades || [];
    setCiudades(filteredCiudades);
  };

  const handleCiudadChange = (e) => {
    setCiudad(e.target.value);
  };

  useEffect(() => {
    if (!clienteWhere || loadingClientes) return;
    const clienteEncontrado = clientesEncontrados?.[0] ?? null;

    if (clienteEncontrado) {
      setCliente(clienteEncontrado);
      setShowForm(false);
      setActiveTab("confirmar");
    } else {
      setCliente(null);
      setShowForm(true);
    }
  }, [clienteWhere, clientesEncontrados, loadingClientes]);

  useEffect(() => {
    if (cliente) {
      syncFormWithCliente(cliente);
    }
  }, [cliente]);

  useEffect(() => {
    if (!errorClientes) return;
    console.error("Error al obtener el cliente", errorClientes);
    mostrarError("Error al obtener el cliente");
    setSubmited(false);
  }, [errorClientes]);

  const handleSaveCliente = async (e) => {
    e.preventDefault();

    try {
      const { data: clienteData } = await createCliente({
        variables: { input: datacliente },
      });
      const clienteCreado = clienteData?.createCliente;

      if (!clienteCreado?.id) {
        throw new Error("No se pudo crear el cliente");
      }

      setCliente(clienteCreado);
      setShowForm(false);
      setSubmited(false);
      setIsEditingCliente(false);
      setActiveTab("confirmar");
      mostrarExito("Cliente creado con exito");
    } catch (error) {
      console.error(error);
      mostrarError(
        "Error al crear el cliente",
        error?.message || "Error desconocido"
      );
    }
  };

  const handleUpdateCliente = async (e) => {
    e.preventDefault();
    if (!cliente?.id) {
      mostrarError("No hay cliente para actualizar");
      return;
    }

    try {
      const { data: clienteData } = await updateCliente({
        variables: {
          id: cliente.id,
          input: datacliente,
        },
      });
      const clienteActualizado = clienteData?.updateCliente;
      if (!clienteActualizado?.id) {
        throw new Error("No se pudo actualizar el cliente");
      }
      setCliente(clienteActualizado);
      setIsEditingCliente(false);
      mostrarExito("Datos del cliente actualizados");
    } catch (error) {
      console.error("Error al actualizar el cliente", error);
      mostrarError("No se pudo actualizar el cliente");
    }
  };

  const handleCreateOrden = async (metodoPago) => {
    const validItems = items.filter((item) => Number(item.productoVariacionId));
    if (!validItems.length) {
      mostrarError("No hay productos validos en el carrito");
      return;
    }

    if (!cliente?.id) {
      mostrarError("Debes seleccionar o crear un cliente antes de continuar");
      return;
    }

    if (!aceptaPoliticas) {
      mostrarError("Debes aceptar la politica de tratamiento de datos");
      return;
    }

    try {
      const input = {
        clienteId: cliente.id,
        fecha: new Date().toISOString(),
        total: totalInterno,
        estado: "pendiente",
        items: validItems.map((item) => ({
          productoVariacionId: Number(item.productoVariacionId),
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
        })),
      };

      const totalOrden = totalInterno;
      const { data } = await createOrden({ variables: { input } });
      const nuevaOrden = data?.createOrden;
      clearKart();
      setOrdenCreada({
        id: nuevaOrden?.id ?? null,
        numeroOrden: nuevaOrden?.numeroOrden ?? null,
        metodoPago,
        total: nuevaOrden?.total ?? totalOrden,
        totalCliente: totalAPagar,
      });
      setSubmited(false);
      setActiveTab("pago");
      setIsEditingCliente(false);
      setAceptaPoliticas(false);
      const metodo =
        metodoPago === "contra_entrega" ? "contra entrega" : "online";
      mostrarExito(`Pedido creado con exito (${metodo})`);
    } catch (error) {
      console.error(error);
      mostrarError(
        "Error al crear el pedido",
        error?.message || "Error desconocido"
      );
    }
  };

  const handleGetCliente = (e) => {
    e.preventDefault();
    if (!documento?.trim()) {
      mostrarError("Debes ingresar un documento");
      return;
    }

    setSubmited(true);
    setCliente(null);
    setShowForm(true);
    setClienteWhere({ documento });
    setActiveTab("datos");
  };

  const renderClienteResumen = () => (
    <DivContainer>
      <h4>
        {cliente.nombre} {cliente.apellido}
      </h4>
      <h4>{cliente.direccion}</h4>
      <h4>{cliente.telefono}</h4>
      <h4>{cliente.email}</h4>
      <h4>
        {cliente.ciudad} - {cliente.departamento}
      </h4>
    </DivContainer>
  );

  const handleCancelEdit = () => {
    if (cliente) {
      syncFormWithCliente(cliente);
    }
    setIsEditingCliente(false);
  };

  const handleNuevoPedido = () => {
    clearForm();
    setCliente(null);
    setShowForm(true);
    setSubmited(false);
    setClienteWhere(null);
    setActiveTab("datos");
    setIsEditingCliente(false);
    setAceptaPoliticas(false);
    setOrdenCreada(null);
  };

  const handleVerDetallePedido = () => {
    if (ordenCreada?.id) {
      navigate(`/detallesPedido/${ordenCreada.id}`);
    }
  };

  const renderPagoContent = () => {
    if (!ordenCreada) {
      return <p>Completa los pasos anteriores para ver el estado del pago.</p>;
    }

    const esContraEntrega = ordenCreada.metodoPago === "contra_entrega";
    const numero =
      ordenCreada.numeroOrden ?? ordenCreada.id ?? "sin numero disponible";

    return (
      <DivContainer>
        <h3>Pedido #{numero}</h3>
        <p>
          Total:{" "}
          {formatPrice(
            ordenCreada.totalCliente ??
              ordenCreada.total ??
              totalAPagar
          )}
        </p>
        {esContraEntrega ? (
          <p>
            Gracias por tu compra. Hemos registrado tu pedido para pago contra
            entrega. Te contactaremos para coordinar el envio.
          </p>
        ) : (
          <p>
            Proximamente habilitaremos la pasarela de pago. Por ahora hemos
            registrado tu pedido y te enviaremos instrucciones de pago.
          </p>
        )}
        <div className="d-flex flex-column flex-md-row gap-2 mt-3">
          <Button
            variant="primary"
            onClick={handleVerDetallePedido}
            disabled={!ordenCreada?.id}
          >
            Ver detalle del pedido
          </Button>
          <Button variant="secondary" onClick={handleNuevoPedido}>
            Crear un nuevo pedido
          </Button>
        </div>
      </DivContainer>
    );
  };

  return (
    <>
      <Container>
        <h1>Realizar pedido</h1>
        <Row className="mt-4">
          <Col md={8}>
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              items={[
                {
                  label: "1. Datos de envio",
                  key: "datos",
                  children: (
                    <>
                      <h2>
                        <strong>Para continuar ingrese su documento</strong>
                      </h2>
                      <Form onSubmit={handleGetCliente}>
                        <Form.Group className="mb-3" controlId="formDocumento">
                          <Form.Label>Numero de Documento</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese el documento"
                            value={documento}
                            onChange={(e) => setDocumento(e.target.value)}
                            style={{ maxWidth: "250px" }}
                          />
                        </Form.Group>

                        <Button type="submit" disabled={loadingClientes}>
                          {loadingClientes ? <SpinnerComponet /> : "Buscar"}
                        </Button>
                      </Form>

                      {cliente && (
                        <>
                          {renderClienteResumen()}
                          <Button
                            variant="link"
                            className="px-0"
                            onClick={() => setActiveTab("confirmar")}
                          >
                            Ir a confirmar
                          </Button>
                        </>
                      )}

                      {showForm && submited && (
                        <Form className="mt-4" onSubmit={handleSaveCliente}>
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
                                  placeholder="Cedula de ciudadania"
                                  value={documento}
                                  onChange={(e) => setDocumento(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Direccion</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Direccion de entrega"
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
                                  placeholder="andres@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Pais</Form.Label>
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
                                  {departamentos.map((dep) => (
                                    <option key={dep} value={dep}>
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
                                  <Form.Select
                                    value={ciudad}
                                    onChange={handleCiudadChange}
                                  >
                                    <option value="" disabled>
                                      Selecciona una ciudad
                                    </option>
                                    {ciudades.map((ciudadItem) => (
                                      <option key={ciudadItem} value={ciudadItem}>
                                        {ciudadItem}
                                      </option>
                                    ))}
                                  </Form.Select>
                                </Form.Group>
                              </Col>
                            </Row>
                          )}

                          <Button
                            type="submit"
                            className="mt-2"
                            disabled={creandoCliente}
                          >
                            {creandoCliente ? (
                              <SpinnerComponet />
                            ) : (
                              "Guardar cliente"
                            )}
                          </Button>
                        </Form>
                      )}
                    </>
                  ),
                },
                {
                  label: "2. Confirmar",
                  key: "confirmar",
                  disabled: !cliente,
                  children: cliente ? (
                    <>
                      {renderClienteResumen()}
                      <Button
                        variant="link"
                        className="px-0"
                        onClick={() => setIsEditingCliente((prev) => !prev)}
                      >
                        {isEditingCliente ? "Cerrar edicion" : "Editar datos"}
                      </Button>

                      {isEditingCliente && (
                        <Form className="mt-3" onSubmit={handleUpdateCliente}>
                          <Row className="mb-3">
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                  type="text"
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
                                  value={documento}
                                  onChange={(e) => setDocumento(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Direccion</Form.Label>
                                <Form.Control
                                  type="text"
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
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row className="mb-3">
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
                                  {departamentos.map((dep) => (
                                    <option key={dep} value={dep}>
                                      {dep}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              <Form.Group>
                                <Form.Label>Ciudad / Municipio</Form.Label>
                                <Form.Select
                                  value={ciudad}
                                  onChange={handleCiudadChange}
                                >
                                  <option value="" disabled>
                                    Selecciona una ciudad
                                  </option>
                                  {ciudades.map((ciudadItem) => (
                                    <option key={ciudadItem} value={ciudadItem}>
                                      {ciudadItem}
                                    </option>
                                  ))}
                                </Form.Select>
                              </Form.Group>
                            </Col>
                          </Row>

                          <div className="d-flex gap-2 mt-3">
                            <Button
                              type="submit"
                              disabled={actualizandoCliente}
                            >
                              {actualizandoCliente ? (
                                <SpinnerComponet />
                              ) : (
                                "Guardar cambios"
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleCancelEdit}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </Form>
                      )}

                      <div className="mt-4">
                        <AvisoPrivacidad />
                        <Form.Group controlId="formAceptaPoliticas" className="mt-3">
                          <Form.Check
                            type="checkbox"
                            checked={aceptaPoliticas}
                            onChange={(e) => setAceptaPoliticas(e.target.checked)}
                            label="He leido y acepto la Politica de Tratamiento de Datos."
                          />
                        </Form.Group>
                      </div>

                      <div className="d-grid gap-2 mt-4">
                        <Row>
                          <Col>
                            <Button
                              variant="primary"
                              size="lg"
                              className="w-100"
                              disabled={!aceptaPoliticas || creandoOrden}
                              onClick={() => handleCreateOrden("online")}
                            >
                              {creandoOrden ? "Procesando..." : "Pagar Ahora"}
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              variant="success"
                              size="lg"
                              className="w-100"
                              disabled={!aceptaPoliticas || creandoOrden}
                              onClick={() => handleCreateOrden("contra_entrega")}
                            >
                              {creandoOrden
                                ? "Procesando..."
                                : "Pagar Contra Entrega"}
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : (
                    <p>Primero busca o crea un cliente en la pestaña anterior.</p>
                  ),
                },
                {
                  label: "3. Pago",
                  key: "pago",
                  disabled: !ordenCreada,
                  children: renderPagoContent(),
                },
              ]}
            />
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header as="h5">Resumen de tu pedido</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {hasProducts ? (
                    <>
                      {kartProductos.map((item, index) => (
                        <ListGroup.Item
                          key={`${item.id}-${index}`}
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
                        <span>Envio</span>
                        <strong>{formatPrice(costoEnvio)}</strong>
                      </ListGroup.Item>
                      <ListGroup.Item
                        className="d-flex justify-content-between"
                        style={{ backgroundColor: "#f0f0f0" }}
                      >
                        <h5>Total a Pagar</h5>
                        <h5>{formatPrice(totalAPagar)}</h5>
                      </ListGroup.Item>
                    </>
                  ) : (
                    <ListGroup.Item className="text-center text-muted">
                      Tu carrito está vacío. Agrega productos para ver el resumen
                      y costos de envío.
                    </ListGroup.Item>
                  )}
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
