import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import { useEffect, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { IoMdAdd } from "react-icons/io";
import { FaCog, FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";
import ProductCard from "../layouts/poducto";
import { useProductosStore } from "../utils/hooks/useProductosStore";
import SpinnerComponet from "../layouts/spinnerComponent";
import AlertComponent from "../layouts/alertComponent";
import DrawerComponent from "../layouts/drawerComponet";

const getNombreFilterValue = (where) => {
  if (!where || typeof where !== "object") return "";
  const { nombre } = where;
  if (!nombre) return "";
  if (typeof nombre === "string") return nombre;
  if (typeof nombre === "object") {
    if (typeof nombre.contains === "string") return nombre.contains;
    if (typeof nombre.containsi === "string") return nombre.containsi;
  }
  return "";
};

const CogIconButton = styled.span.attrs({
  role: "button",
  tabIndex: 0,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #000;
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #0d6efd;
  }

  &:focus-visible {
    outline: 2px solid #0d6efd;
    outline-offset: 2px;
    border-radius: 4px;
  }
`;

const Configuraciones = () => {
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleDrawer = useCallback(() => {
    setIsOpen((prevOpen) => !prevOpen);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleIconKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggleDrawer();
      }
    },
    [handleToggleDrawer]
  );

  const {
    productos,
    loading,
    error,
    refetch,
    productoWhere,
    setProductoWhere,
  } = useProductosStore();
  const [searchTerm, setSearchTerm] = useState(() =>
    getNombreFilterValue(productoWhere)
  );

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const valueFromStore = getNombreFilterValue(productoWhere);
    if (valueFromStore !== searchTerm) {
      setSearchTerm(valueFromStore);
    }
  }, [productoWhere, searchTerm]);

  const productosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) {
      return productos;
    }
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [productos, searchTerm]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const trimmed = value.trim();
    setProductoWhere(trimmed ? { nombre: { contains: trimmed } } : {});
  };

  if (loading) return <SpinnerComponet />;
  if (error)
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar productos"
        actions={<Button onClick={() => refetch()}>Reintentar</Button>}
      >
        {error.message}
      </AlertComponent>
    );

  return (
    <>
      <Container>
        <div className="productos_header">
          <CogIconButton onClick={handleToggleDrawer} onKeyDown={handleIconKeyDown}>
            <FaCog size={24} />
          </CogIconButton>
          
          <div className="input-icon">
            <FaSearch size={18} className="icono-buscar" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button onClick={handleShow} className="btn-crearProducto">
            <IoMdAdd size={22} /> Crear producto
          </Button>
        </div>
        <ModalCrear handleClose={handleClose} show={show} />
      </Container>

      <Container className="productos_container">
        {productosFiltrados.length > 0 ? (
          <Row>
            {productosFiltrados.map((producto) => (
              <Col
                key={producto.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="mt-5"
              >
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </Container>

      <DrawerComponent open={isOpen} onClose={handleCloseDrawer} />
    </>
  );
};

export default Configuraciones;
