import { Container, Form, Row, Col, Button } from "react-bootstrap";
import data from "../utils/colombia.json";
import { useState } from "react";
import ValidateCliente from "../services/cliente.service";

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

  const [productKart, setProductKart] = useState(
    JSON.parse(localStorage.getItem("kartProducts")) || []
  );

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
    const datacliente = {
      nombre,
      apellido,
      documento,
      direccion,
      telefono,
      email,
      departamento,
      ciudad
    }
    try {
      console.log('Se envio la peticion con estos datos: ', datacliente)
      const cliente =  await ValidateCliente(datacliente);
      console.log(cliente);
    } catch (error) {
      console.log(error);
    }
    

  }
  return (
    <>
      <Container>
        <h1>Datos de envío y Facturación</h1>
        <Form onSubmit={handlesubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre de quien recibe"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value) }
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Apellido</Form.Label>
                <Form.Control type="text" placeholder="Apellidos" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Documento</Form.Label>
                <Form.Control type="text" placeholder="Cédula de ciudadanía" value={documento} onChange={(e) => setDocumento(e.target.value) } />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Dirección</Form.Label>
                <Form.Control type="text" placeholder="Dirección de entrega" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </Form.Group>
            </Col>
             <Col md={6}>
              <Form.Group>
                <Form.Label>Telefono</Form.Label>
                <Form.Control type="text" placeholder="3151234567" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </Form.Group>
            </Col>
             <Col md={6}>
              <Form.Group>
                <Form.Label>Correo</Form.Label>
                <Form.Control type="email" placeholder="Andres@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
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
              <Button type="submit" className="m-5">
                Enviar Pedido
              </Button>
            </Row>
          )}
        </Form>
      </Container>
    </>
  );
};

export default Pedido;
