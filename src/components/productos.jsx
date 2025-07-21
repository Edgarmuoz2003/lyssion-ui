import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaCog, FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";
import { useMainStore } from "../store/useMainStore";
import ProductCard from "../layouts/poducto";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";

const Productos = () => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const productosIniciales = useMainStore((state) => state.productos);

  // Hook para el debouncing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Hook de Apollo para buscar productos
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: {
      where: { nombre: { $iLike: `%${debouncedSearchTerm}%` } },
    },
    skip: !debouncedSearchTerm, // No ejecutar la query si no hay término de búsqueda
  });

  const productos = debouncedSearchTerm ? data?.productos || [] : productosIniciales;

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
        {loading && <p>Buscando...</p>}
        {error && <p>Error en la búsqueda: {error.message}</p>}
        {!loading && !error && productos.length > 0 ? (
          <Row>
            {productos.map((producto) => (
              <Col key={producto.id} sm={12} md={6} lg={4} xl={3} className="mt-5">
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        ) : (
          !loading && <p>No se encontraron productos.</p>
        )}
      </Container>
    </>
  );
};

export default Productos;
