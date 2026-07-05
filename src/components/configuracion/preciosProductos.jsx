import { useEffect, useMemo, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import Input from "antd/es/input/Input";
import { FaSearch, FaTag } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import SpinnerComponet from "@/layouts/spinnerComponent";
import AlertComponent from "@/layouts/alertComponent";
import {
  buildEditDraft,
  buildProductoUpdateInput,
} from "@/components/detalle.helpers";
import { mostrarError, mostrarExito } from "@/utils/hookMensajes";

const getSafeHex = (value) => value || "#000000";

const normalizeNumericInput = (value) => {
  if (value === "") return "";
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : "";
};

const getUniqueTallas = (producto) => {
  const tallasMap = new Map();

  (producto?.variaciones || []).forEach((variacion) => {
    const talla = variacion?.infoTalla;
    if (!talla?.id || tallasMap.has(Number(talla.id))) return;

    tallasMap.set(Number(talla.id), {
      id: talla.id,
      nombre: talla.nombre,
      precio: variacion?.precio ?? "",
      precioMayorista: variacion?.precioMayorista ?? "",
    });
  });

  return Array.from(tallasMap.values());
};

const PreciosProductos = () => {
  const {
    productos,
    loading,
    error,
    refetch,
    productoWhere,
    setProductoWhere,
    updateProducto,
    actualizando,
  } = useProductosStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedTallaId, setSelectedTallaId] = useState(null);
  const [editDraft, setEditDraft] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [precioDetal, setPrecioDetal] = useState("");
  const [precioMayorista, setPrecioMayorista] = useState("");

  useEffect(() => {
    if (productoWhere && Object.keys(productoWhere).length > 0) {
      setProductoWhere({});
    }
  }, [productoWhere, setProductoWhere]);

  const productosFiltrados = useMemo(() => {
    if (!searchTerm.trim()) return productos;

    const term = searchTerm.toLowerCase();
    return productos.filter((producto) =>
      producto.nombre?.toLowerCase().includes(term),
    );
  }, [productos, searchTerm]);

  const selectedProduct = useMemo(
    () =>
      productos.find((producto) => Number(producto.id) === Number(selectedProductId)) ||
      null,
    [productos, selectedProductId],
  );

  const selectedTalla = useMemo(() => {
    if (!selectedProduct || !selectedTallaId) return null;
    return (
      getUniqueTallas(selectedProduct).find(
        (talla) => Number(talla.id) === Number(selectedTallaId),
      ) || null
    );
  }, [selectedProduct, selectedTallaId]);

  const handleOpenTallaModal = (producto, talla) => {
    setSelectedProductId(producto.id);
    setSelectedTallaId(talla.id);
    setPrecioDetal(
      talla?.precio !== null && talla?.precio !== undefined ? String(talla.precio) : "",
    );
    setPrecioMayorista(
      talla?.precioMayorista !== null && talla?.precioMayorista !== undefined
        ? String(talla.precioMayorista)
        : "",
    );
    setEditDraft(buildEditDraft(producto));
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProductId(null);
    setSelectedTallaId(null);
    setEditDraft(null);
    setPrecioDetal("");
    setPrecioMayorista("");
  };

  const validateSelectedTalla = () => {
    if (!editDraft || !selectedTallaId) {
      mostrarError("No hay una talla seleccionada para editar.");
      return false;
    }

    if (!Number.isInteger(Number(precioDetal)) || Number(precioDetal) <= 0) {
      mostrarError("El precio al detal debe ser un entero mayor que cero.");
      return false;
    }

    if (
      precioMayorista !== "" &&
      (!Number.isInteger(Number(precioMayorista)) || Number(precioMayorista) <= 0)
    ) {
      mostrarError(
        "El precio mayorista debe ser un entero mayor que cero o dejarlo vacio.",
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!selectedProduct?.id || !validateSelectedTalla()) return;

    const nextDraft = {
      ...editDraft,
      colores: (editDraft?.colores || []).map((color) => ({
        ...color,
        variaciones: (color.variaciones || []).map((variacion) => {
          if (Number(variacion.tallaId) !== Number(selectedTallaId)) {
            return variacion;
          }

          return {
            ...variacion,
            precio: Number(precioDetal),
            precioMayorista: normalizeNumericInput(precioMayorista),
          };
        }),
      })),
    };

    try {
      await updateProducto({
        variables: {
          id: selectedProduct.id,
          input: buildProductoUpdateInput(nextDraft),
        },
      });

      mostrarExito("Precios actualizados con exito.");
      handleCloseModal();
    } catch (err) {
      console.error("Error al actualizar precios por talla:", err);
      mostrarError("No se pudieron actualizar los precios.");
    }
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
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
        </div>
      </Container>

      <Container className="catalog-section pb-5">
        {productosFiltrados.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Colores disponibles</th>
                <th>Tallas disponibles</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((producto) => {
                const tallas = getUniqueTallas(producto);

                return (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria?.nombre || "Sin categoria"}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {(producto.coloresDisponibles || []).map((colorEntry) => (
                          <span
                            key={colorEntry.id}
                            className="d-inline-flex align-items-center gap-2 px-2 py-1 border rounded bg-white"
                          >
                            <BsCircleFill
                              style={{ color: getSafeHex(colorEntry?.color?.codigo_hex) }}
                            />
                            <span>{colorEntry?.color?.nombre || "Sin color"}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-2">
                        {tallas.map((talla) => (
                          <Button
                            key={talla.id}
                            variant="outline-dark"
                            size="sm"
                            onClick={() => handleOpenTallaModal(producto, talla)}
                          >
                            {talla.nombre}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : (
          <div className="empty-catalog-state">
            <h3>No se encontraron productos</h3>
            <p>Prueba con otro termino de busqueda.</p>
          </div>
        )}
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <FaTag />
            <span>
              {selectedProduct?.nombre || "Producto"} - talla{" "}
              {selectedTalla?.nombre || ""}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-3">
            <div className="text-muted small">
              Este cambio se aplicara a la talla seleccionada en todos los colores del producto.
            </div>

            <div className="d-flex flex-column gap-2">
              <label>Precio 1</label>
              <Input
                type="number"
                min="1"
                value={precioDetal}
                placeholder="Precio 1"
                onChange={(event) => setPrecioDetal(event.target.value)}
              />
            </div>

            <div className="d-flex flex-column gap-2">
              <label>Precio 2</label>
              <Input
                type="number"
                min="1"
                value={precioMayorista}
                placeholder="Precio 2"
                onChange={(event) => setPrecioMayorista(event.target.value)}
              />
            </div>

            <div className="text-muted small">
              `Precio 1` corresponde al precio al detal y `Precio 2` al precio mayorista.
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={actualizando}>
            {actualizando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PreciosProductos;
