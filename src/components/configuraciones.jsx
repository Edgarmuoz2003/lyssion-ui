import { Container, Button, Row, Col } from "react-bootstrap";
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
  color: #10243e;
  cursor: pointer;
  transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  border: 1px solid #d8e0e8;
  border-radius: 12px;
  width: 44px;
  height: 44px;
  background: #fff;

  &:hover {
    color: #193f66;
    border-color: #193f66;
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
    // En Configuraciones usamos filtro local para evitar enviar operadores
    // no soportados por el backend (ej: nombre.contains).
    if (productoWhere && Object.keys(productoWhere).length > 0) {
      setProductoWhere({});
    }
  }, [productoWhere, setProductoWhere]);

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
      <Container className="config-toolbar-wrap">
        <div className="productos_header config-toolbar">
          <CogIconButton onClick={handleToggleDrawer} onKeyDown={handleIconKeyDown}>
            <FaCog size={24} />
          </CogIconButton>
          
          <div className="input-icon config-search">
            <FaSearch size={18} className="icono-buscar" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <Button onClick={handleShow} className="btn-crearProducto config-create-btn">
            <IoMdAdd size={22} /> Crear producto
          </Button>
        </div>
        <ModalCrear handleClose={handleClose} show={show} />
      </Container>

      <Container className="productos_container catalog-section">
        {productosFiltrados.length > 0 ? (
          <Row className="g-4 pb-5">
            {productosFiltrados.map((producto) => (
              <Col
                key={producto.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="d-flex align-items-stretch"
              >
                <ProductCard producto={producto} />
              </Col>
            ))}
          </Row>
        ) : (
          <div className="empty-catalog-state">
            <h3>No se encontraron productos</h3>
            <p>Prueba con otro término de búsqueda o crea uno nuevo.</p>
          </div>
        )}
      </Container>

      <DrawerComponent open={isOpen} onClose={handleCloseDrawer} />
    </>
  );
};

export default Configuraciones;
