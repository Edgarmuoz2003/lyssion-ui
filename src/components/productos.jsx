import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaCog, FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";
import { useMainStore } from "../store/useMainStore";
import ProductCard from "../layouts/poducto";

const Productos = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const productos = useMainStore((state) => state.productos);

  return (
    <>
      <Container>
        <div className="productos_header">
          <Dropdown>
            <Dropdown.Toggle variant="link" id="dropdown-basic">
              <FaCog size={24} style={{ color: "black" }} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/Colores">Colores</Dropdown.Item>
              <Dropdown.Item href="/Tallas">Tallas</Dropdown.Item>
              <Dropdown.Item href="/Categorias">Categorias</Dropdown.Item>
              <Dropdown.Item href="/Usuarios">Categorias</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="input-icon">
            <FaSearch size={18} className="icono-buscar" />
            <input type="text" placeholder="Buscar..." />
          </div>
          <Button onClick={handleShow}>
            <IoMdAdd size={22} /> Crear
          </Button>
        </div>
        <ModalCrear handleClose={handleClose} show={show} />
      </Container>

      <Container className="productos_container">
        {productos.length > 0 ? (
          <Row>
            {productos.map((producto) => (
              <Col key={producto.id} sm={12} md={6} lg={4} xl={3} className="mt-5"> 
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </Container>
    </>
  );
};

export default Productos;
