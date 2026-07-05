import { Container, Button, Row, Col } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ModalCrear from "../forms/crearProducto";
import ProductCard from "../layouts/poducto";
import { useProductosStore } from "../utils/hooks/useProductosStore";
import SpinnerComponet from "../layouts/spinnerComponent";
import AlertComponent from "../layouts/alertComponent";

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

const Configuraciones = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

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
  const handleCreated = (productoId) => {
    setShow(false);
    if (productoId) {
      navigate(`/detalles/${productoId}`);
    }
  };

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
    setSearchTerm(event.target.value);
  };

  if (loading) return <SpinnerComponet />;
  if (error) {
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar productos"
        actions={<Button onClick={() => refetch()}>Reintentar</Button>}
      >
        {error.message}
      </AlertComponent>
    );
  }

  return (
    <>
      <Container className="config-toolbar-wrap">
        <div className="productos_header config-toolbar">
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
        <ModalCrear handleClose={handleClose} show={show} onCreated={handleCreated} />
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
    </>
  );
};

export default Configuraciones;
