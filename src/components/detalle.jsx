import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import {
  FaHandPaper,
  FaBan,
  FaTshirt,
  FaTemperatureLow,
  FaWater,
  FaSoap,
  FaRegSnowflake,
} from "react-icons/fa";
import { MdIron } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useLogindata } from "../utils/hooks/useLoginData";
import { useKartProductos } from "@/utils/hooks/useKartProductos";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import AlertComponent from "@/layouts/alertComponent";
import SpinnerComponet from "@/layouts/spinnerComponent";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const getPrincipalImage = (colorEntry) => {
  if (!colorEntry?.imagenes?.length) return null;
  return (
    colorEntry.imagenes.find((imagen) => Boolean(imagen?.isPrincipal)) ||
    colorEntry.imagenes[0]
  );
};

const Detalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useLogindata();

  const [selectedColorEntry, setSelectedColorEntry] = useState(null);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [mainImage, setMainImage] = useState(null);
  const previousColorIdRef = useRef(null);

  const {
    productos,
    loading,
    error,
    deleteProducto,
    setProductoWhere,
    refetch,
  } = useProductosStore();

  const { hasProducts: productsOnKart, addOrUpdateProduct } =
    useKartProductos();

  useEffect(() => {
    const numericId = Number(id);
    if (Number.isFinite(numericId)) {
      setProductoWhere({ id: numericId });
    } else {
      setProductoWhere({});
    }
    return () => setProductoWhere({});
  }, [id, setProductoWhere]);

  const producto = useMemo(() => {
    const numericId = Number(id);
    if (!Array.isArray(productos) || productos.length === 0) {
      return null;
    }
    if (Number.isFinite(numericId)) {
      return (
        productos.find((item) => Number(item?.id) === numericId) || productos[0]
      );
    }
    return productos[0];
  }, [productos, id]);

  useEffect(() => {
    if (!producto?.coloresDisponibles?.length) {
      setSelectedColorEntry(null);
      previousColorIdRef.current = null;
      return;
    }

    setSelectedColorEntry((prev) => {
      if (!prev) {
        return producto.coloresDisponibles[0];
      }
      const match = producto.coloresDisponibles.find(
        (entry) => entry?.color?.id === prev?.color?.id
      );
      return match || producto.coloresDisponibles[0];
    });
  }, [producto]);

  useEffect(() => {
    const nextImage = getPrincipalImage(selectedColorEntry) || null;
    setMainImage(nextImage);

    const currentColorId = selectedColorEntry?.color?.id || null;
    if (previousColorIdRef.current !== currentColorId) {
      previousColorIdRef.current = currentColorId;
      setSelectedTalla(null);
    }
  }, [selectedColorEntry]);

  const selectedColorId = selectedColorEntry?.color?.id;

  const selectedColorVariations = useMemo(() => {
    if (!selectedColorId || !producto?.variaciones) {
      return [];
    }
    return producto.variaciones.filter(
      (variacion) => Number(variacion?.infoColor?.id) === Number(selectedColorId)
    );
  }, [producto, selectedColorId]);

  const availableTallas = useMemo(() => {
    const unique = new Map();
    selectedColorVariations.forEach((variacion) => {
      const talla = variacion?.infoTalla;
      if (talla?.id && !unique.has(talla.id)) {
        unique.set(talla.id, { id: talla.id, nombre: talla.nombre });
      }
    });
    return Array.from(unique.values());
  }, [selectedColorVariations]);

  const selectedVariation = useMemo(() => {
    if (!selectedTalla) return null;
    return (
      selectedColorVariations.find(
        (variacion) =>
          Number(variacion?.infoTalla?.id) === Number(selectedTalla.id)
      ) || null
    );
  }, [selectedColorVariations, selectedTalla]);

  const allVariationPrices =
    producto?.variaciones
      ?.map((variacion) => Number(variacion?.precio))
      .filter((precio) => Number.isFinite(precio)) || [];

  const colorVariationPrices =
    selectedColorVariations
      ?.map((variacion) => Number(variacion?.precio))
      .filter((precio) => Number.isFinite(precio)) || [];

  const priceToShow = Number.isFinite(Number(selectedVariation?.precio))
    ? Number(selectedVariation.precio)
    : colorVariationPrices.length > 0
    ? Math.min(...colorVariationPrices)
    : allVariationPrices.length > 0
    ? Math.min(...allVariationPrices)
    : null;

  const formattedPrice =
    priceToShow !== null ? currencyFormatter.format(priceToShow) : "Sin precio";

  const handleColorClick = (colorEntry) => {
    setSelectedColorEntry(colorEntry);
  };

  const handleTallaClick = (talla) => {
    setSelectedTalla(talla);
  };

  const handleCantidadChange = (event) => {
    const value = Number(event.target.value);
    if (!Number.isFinite(value) || value <= 0) {
      setCantidad(1);
      return;
    }
    setCantidad(Math.floor(value));
  };

  const validateInputs = () => {
    if (!selectedColorEntry) {
      mostrarError("Debes seleccionar un color");
      return false;
    }
    if (!selectedTalla) {
      mostrarError("Debes seleccionar una talla");
      return false;
    }
    if (!selectedVariation) {
      mostrarError("La combinacion seleccionada no tiene variaciones");
      return false;
    }
    if (cantidad <= 0) {
      mostrarError("La cantidad debe ser al menos 1");
      return false;
    }
    return true;
  };

  const handleKartClick = () => {
    if (!validateInputs()) return;

    const variationPrice = Number(selectedVariation?.precio);
    const normalizedPrice = Number.isFinite(variationPrice)
      ? variationPrice
      : priceToShow || 0;

    const newProduct = {
      id: producto?.id,
      nombre: producto?.nombre,
      precio: normalizedPrice,
      color: selectedColorEntry?.color?.nombre,
      colorId: selectedColorEntry?.color?.id,
      talla: selectedTalla?.nombre,
      tallaId: selectedTalla?.id,
      imagen: mainImage?.url,
      cantidad,
      variationId: selectedVariation?.id,
    };

    addOrUpdateProduct(newProduct);
    mostrarExito("Producto anadido al carrito con exito");
  };

  const handleDelete = async (productoId) => {
    try {
      await deleteProducto({ variables: { id: productoId } });
      mostrarExito("Producto eliminado con exito");
      setProductoWhere({});
      navigate("/Configuraciones");
    } catch (err) {
      console.error("Error al eliminar el producto:", err);
      mostrarError("Error al eliminar el producto");
    }
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

  if (!producto) {
    return <p className="text-center mt-5">Producto no encontrado.</p>;
  }

  const thumbnails = selectedColorEntry?.imagenes || [];
  const colorEntries = producto.coloresDisponibles || [];

  return (
    <Container className="mt-4">
      <p className="text-muted breadcrumb-text">
        {producto.categoria?.nombre} / {producto.nombre}
      </p>
      <Row className="mt-3">
        <Col md={1} className="d-flex flex-md-column align-items-center gap-2">
          {thumbnails.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Thumbnail ${producto.nombre}`}
              className="img-fluid detail-thumbnail"
              style={{
                cursor: "pointer",
                border:
                  mainImage?.id === img.id ? "2px solid black" : "2px solid #eee",
                width: "80px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
              onClick={() => setMainImage(img)}
            />
          ))}
        </Col>

        <Col md={5}>
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={`${producto.nombre} - ${
                selectedColorEntry?.color?.nombre || "sin color"
              }`}
              className="img-fluid detail-main-image"
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "100%",
                minHeight: "400px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <span className="text-muted">No hay imagen para este color</span>
            </div>
          )}

          {isAuthenticated && (
            <Button onClick={() => handleDelete(producto.id)} className="mt-3">
              Eliminar
            </Button>
          )}
        </Col>

        <Col md={6}>
          <h2>{producto.nombre}</h2>
          <p className="text-muted">{producto.descripcion}</p>

          <h3 className="price my-3">{formattedPrice}</h3>

          <hr />

          <div className="mb-3">
            <p>
              <strong>Color:</strong>{" "}
              {selectedColorEntry?.color?.nombre || "No disponible"}
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {colorEntries.length > 0 ? (
                colorEntries.map((colorEntry) => {
                  const hex = colorEntry?.color?.codigo_hex || "#000000";
                  return (
                    <BsCircleFill
                      key={colorEntry?.color?.id || colorEntry?.id}
                      className="color-swatch"
                      style={{
                        color: hex,
                        outline:
                          selectedColorEntry?.color?.id ===
                          colorEntry?.color?.id
                            ? "2px solid black"
                            : `1px solid ${
                                hex.toUpperCase() === "#FFFFFF" ? "#ccc" : "transparent"
                              }`,
                        outlineOffset: "2px",
                      }}
                      onClick={() => handleColorClick(colorEntry)}
                      title={colorEntry?.color?.nombre}
                    />
                  );
                })
              ) : (
                <span className="text-muted">Sin colores disponibles</span>
              )}
            </div>
          </div>

          <hr />

          <div className="mb-3">
            <p>
              <strong>Tallas disponibles:</strong>
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {availableTallas.length > 0 ? (
                availableTallas.map((talla) => (
                  <span
                    key={talla.id}
                    className="talla-badge"
                    style={{
                      padding: "0.5rem 1rem",
                      border:
                        selectedTalla?.id === talla.id
                          ? "2px solid black"
                          : "1px solid #eee",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleTallaClick(talla)}
                  >
                    {talla.nombre}
                  </span>
                ))
              ) : (
                <span className="text-muted">Sin tallas disponibles</span>
              )}
            </div>
          </div>

          <hr />

          <div>
            <p>
              <strong>Cantidad:</strong>
            </p>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={handleCantidadChange}
              style={{ width: "60px" }}
            />
          </div>

          <div className="mt-4">
            <p>
              <strong>Recomendaciones de cuidado:</strong>
            </p>
            <div className="d-flex justify-content-around flex-wrap gap-3">
              <div className="text-center cuidado-item">
                <FaHandPaper size={30} />
                <p className="cuidado-texto">Lavar a mano</p>
              </div>
              <div className="text-center cuidado-item">
                <FaBan size={30} />
                <p className="cuidado-texto">No usar cloro</p>
              </div>
              <div className="text-center cuidado-item">
                <FaTshirt size={30} />
                <p className="cuidado-texto">No secadora</p>
              </div>
              <div className="text-center cuidado-item">
                <FaTemperatureLow size={30} />
                <p className="cuidado-texto">Agua fria</p>
              </div>
              <div className="text-center cuidado-item">
                <MdIron size={30} />
                <p className="cuidado-texto">Plancha tibia</p>
              </div>
              <div className="text-center cuidado-item">
                <FaWater size={30} />
                <p className="cuidado-texto">No remojar</p>
              </div>
              <div className="text-center cuidado-item">
                <FaSoap size={30} />
                <p className="cuidado-texto">Jabon suave</p>
              </div>
              <div className="text-center cuidado-item">
                <FaRegSnowflake size={30} />
                <p className="cuidado-texto">Secar a la sombra</p>
              </div>
            </div>
          </div>

          <hr />

          <div className="d-grid gap-2 mt-4">
            <Button variant="dark" size="lg" onClick={handleKartClick}>
              Agregar al carrito
            </Button>
          </div>
          <div className="d-grid gap-2 mt-4">
            {productsOnKart && (
              <Button onClick={() => navigate(-1)}>Seguir comprando</Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Detalle;
