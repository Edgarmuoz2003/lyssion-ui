import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import { useState, useMemo } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaCog, FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";
import { useMainStore } from "../store/useMainStore";
import ProductCard from "../layouts/poducto";

const Configuraciones = () => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 1. Obtenemos la lista completa de productos desde Zustand.
  const todosLosProductos = useMainStore((state) => state.productos);

  // 2. Filtramos la lista de productos en el cliente cada vez que el término de búsqueda o la lista cambian.
  // `useMemo` optimiza para que el filtrado no se ejecute en cada render, solo cuando es necesario.
  const productosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) {
      return todosLosProductos;
    }
    return todosLosProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, todosLosProductos]);


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
              <Dropdown.Item href="/Categorias">Categorías</Dropdown.Item>
              <Dropdown.Item href="/Usuarios">Usuarios</Dropdown.Item>
              <Dropdown.Item href="/PedidosList">Ordenes de pedido</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="input-icon">
            <FaSearch size={18} className="icono-buscar" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleShow}>
            <IoMdAdd size={22} /> Crear
          </Button>
        </div>
        <ModalCrear handleClose={handleClose} show={show} />
      </Container>

      <Container className="productos_container">
        {productosFiltrados.length > 0 ? (
          <Row>
            {productosFiltrados.map((producto) => (
              <Col key={producto.id} sm={12} md={6} lg={4} xl={3} className="mt-5">
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </Container>
    </>
  );
};

export default Configuraciones;
