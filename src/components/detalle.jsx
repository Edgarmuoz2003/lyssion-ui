import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { Container, Row, Col, Button, Modal, Form, Image } from "react-bootstrap";
import {
  FaHandPaper,
  FaBan,
  FaTshirt,
  FaTemperatureLow,
  FaWater,
  FaSoap,
  FaRegSnowflake,
} from "react-icons/fa";
import { BsTrash, BsCircleFill, BsXCircleFill } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { MdIron } from "react-icons/md";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useLogindata } from "../utils/hooks/useLoginData";
import { useKartProductos } from "@/utils/hooks/useKartProductos";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import AlertComponent from "@/layouts/alertComponent";
import SpinnerComponet from "@/layouts/spinnerComponent";
import Input from "antd/es/input/Input";
import ProductoBaseFields from "@/components/producto/ProductoBaseFields";
import {
  GET_CATEGORIAS,
  GET_COLORS,
  GET_TALLAS,
} from "@/graphql/queries/productQueries";
import {
  currencyFormatter,
  getPrincipalImage,
} from "@/components/detalle.helpers";
import { useDetalleEditor } from "@/components/detalle/useDetalleEditor";

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
    updateProducto,
    actualizando,
    setProductoWhere,
    refetch,
  } = useProductosStore();

  const { hasProducts: productsOnKart, addOrUpdateProduct } =
    useKartProductos();

  const { data: coloresData } = useQuery(GET_COLORS);
  const { data: tallasData } = useQuery(GET_TALLAS);
  const { data: categoriasData } = useQuery(GET_CATEGORIAS);

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

  const {
    isEditing,
    editDraft,
    editColorEntries,
    editSelectedColor,
    hoveredColorId,
    hoveredTallaId,
    showAddColorModal,
    showAddTallaModal,
    newColorId,
    newTallaId,
    newTallaPrice,
    newTallaStock,
    availableColorOptions,
    availableTallaOptionsForSelectedColor,
    handleEdit,
    handleCancelEdit,
    handleDraftFieldChange,
    handleRemoveColor,
    handleAddImagesToColor,
    handleRemoveImage,
    handleSetPrincipalImage,
    handleOpenAddColorModal,
    handleConfirmAddColor,
    handleOpenAddTallaModal,
    handleConfirmAddTalla,
    handleRemoveTalla,
    handleVariationFieldChange,
    handleSaveEdit,
    setHoveredColorId,
    setHoveredTallaId,
    setShowAddColorModal,
    setShowAddTallaModal,
    setNewColorId,
    setNewColorFiles,
    setNewTallaId,
    setNewTallaPrice,
    setNewTallaStock,
    setEditSelectedColorId,
  } = useDetalleEditor({
    producto,
    coloresData,
    tallasData,
    setMainImage,
    updateProducto,
  });

  useEffect(() => {
    if (isEditing) return;

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
        (entry) => entry?.color?.id === prev?.color?.id,
      );
      return match || producto.coloresDisponibles[0];
    });
  }, [producto, isEditing]);

  useEffect(() => {
    if (isEditing) return;

    const nextImage = getPrincipalImage(selectedColorEntry) || null;
    setMainImage(nextImage);

    const currentColorId = selectedColorEntry?.color?.id || null;
    if (previousColorIdRef.current !== currentColorId) {
      previousColorIdRef.current = currentColorId;
      setSelectedTalla(null);
    }
  }, [selectedColorEntry, isEditing]);

  const selectedColorId = selectedColorEntry?.color?.id;

  const selectedColorVariations = useMemo(() => {
    if (!selectedColorId || !producto?.variaciones) {
      return [];
    }
    return producto.variaciones.filter(
      (variacion) =>
        Number(variacion?.infoColor?.id) === Number(selectedColorId),
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
          Number(variacion?.infoTalla?.id) === Number(selectedTalla.id),
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

  const thumbnails = isEditing
    ? editSelectedColor?.imagenes || []
    : selectedColorEntry?.imagenes || [];
  const colorEntries = isEditing ? editColorEntries : producto.coloresDisponibles || [];

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
                  mainImage?.id === img.id
                    ? "2px solid black"
                    : "2px solid #eee",
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
                isEditing
                  ? editSelectedColor?.color?.nombre || "sin color"
                  : selectedColorEntry?.color?.nombre || "sin color"
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

          {isAuthenticated ? (
            <div className="d-flex gap-3 mb-2 mt-3">
              <Button
                variant="danger"
                onClick={() => handleDelete(producto.id)}
                className="flex-fill d-flex align-items-center justify-content-center m-4"
                disabled={actualizando}
              >
                <BsTrash size={20} /> Eliminar
              </Button>
              {!isEditing ? (
                <Button
                  variant="primary"
                  onClick={handleEdit}
                  className="flex-fill d-flex align-items-center justify-content-center m-4"
                >
                  <CiEdit size={20} /> Editar
                </Button>
              ) : null}
            </div>
          ) : null}
        </Col>

        <Col md={6}>
          <ProductoBaseFields
            isEditing={isEditing}
            producto={producto}
            editDraft={editDraft}
            categorias={categoriasData?.categorias || []}
            onFieldChange={handleDraftFieldChange}
            formattedPrice={formattedPrice}
          />

          <hr />

          <div className="mb-3">
            <p>
              <strong>Color:</strong>{" "}
              {isEditing
                ? editSelectedColor?.color?.nombre || "No disponible"
                : selectedColorEntry?.color?.nombre || "No disponible"}
            </p>
            <div className="d-flex gap-2 flex-wrap align-items-center">
              {colorEntries.length > 0 ? (
                colorEntries.map((colorEntry) => {
                  const currentColor = isEditing ? colorEntry.color : colorEntry?.color;
                  const colorId = colorEntry?.colorId || currentColor?.id;
                  const hex = currentColor?.codigo_hex || "#000000";
                  const isSelected = isEditing
                    ? Number(editSelectedColor?.colorId) === Number(colorId)
                    : Number(selectedColorEntry?.color?.id) === Number(colorId);

                  return (
                    <div
                      key={colorEntry?.id || colorId}
                      style={{ position: "relative", width: 24, height: 24 }}
                      onMouseEnter={() => setHoveredColorId(colorId)}
                      onMouseLeave={() => setHoveredColorId(null)}
                    >
                      <BsCircleFill
                        className="color-swatch"
                        style={{
                          color: hex,
                          cursor: "pointer",
                          outline: isSelected
                            ? "2px solid black"
                            : `1px solid ${
                                hex.toUpperCase() === "#FFFFFF"
                                  ? "#ccc"
                                  : "transparent"
                              }`,
                          outlineOffset: "2px",
                        }}
                        onClick={() => {
                          if (isEditing) {
                            setEditSelectedColorId(colorId);
                            setMainImage(getPrincipalImage(colorEntry) || null);
                            return;
                          }
                          handleColorClick(colorEntry);
                        }}
                        title={currentColor?.nombre}
                      />

                      {isEditing && hoveredColorId === colorId ? (
                        <BsXCircleFill
                          size={14}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            color: "#dc3545",
                            background: "white",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemoveColor(colorId)}
                        />
                      ) : null}
                    </div>
                  );
                })
              ) : (
                <span className="text-muted">Sin colores disponibles</span>
              )}

              {isEditing ? (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleOpenAddColorModal}
                >
                  <IoMdAdd size={18} />
                </Button>
              ) : null}
            </div>
          </div>

          {isEditing && editSelectedColor ? (
            <div className="mb-3">
              <p>
                <strong>Imagenes del color seleccionado:</strong>
              </p>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => {
                  handleAddImagesToColor(editSelectedColor.colorId, event.target.files);
                  event.target.value = "";
                }}
              />

              <div className="d-flex gap-2 flex-wrap mt-3">
                {editSelectedColor.imagenes.map((image) => (
                  <div
                    key={image.id}
                    style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}
                  >
                    <Image
                      src={image.url}
                      alt={editSelectedColor.color?.nombre}
                      thumbnail
                      style={{ width: 110, height: 120, objectFit: "cover" }}
                    />
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <Form.Check
                        type="radio"
                        label="Principal"
                        name={`principal-${editSelectedColor.colorId}`}
                        checked={Boolean(image.isPrincipal)}
                        onChange={() =>
                          handleSetPrincipalImage(editSelectedColor.colorId, image.id)
                        }
                      />
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleRemoveImage(editSelectedColor.colorId, image.id)
                        }
                      >
                        Quitar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <hr />

          <div className="mb-3">
            <p>
              <strong>Tallas disponibles:</strong>
            </p>

            {!isEditing ? (
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
            ) : (
              <>
                <div className="d-flex gap-2 flex-wrap align-items-center">
                  {(editSelectedColor?.variaciones || []).map((variacion) => (
                    <div
                      key={`${variacion.tallaId}-${variacion.id || "new"}`}
                      style={{ position: "relative" }}
                      onMouseEnter={() => setHoveredTallaId(variacion.tallaId)}
                      onMouseLeave={() => setHoveredTallaId(null)}
                    >
                      <span
                        style={{
                          padding: "0.5rem 1rem",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          display: "inline-block",
                        }}
                      >
                        {variacion.tallaNombre}
                      </span>

                      {hoveredTallaId === variacion.tallaId ? (
                        <BsXCircleFill
                          size={14}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            color: "#dc3545",
                            background: "white",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            handleRemoveTalla(editSelectedColor.colorId, variacion.tallaId)
                          }
                        />
                      ) : null}
                    </div>
                  ))}

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={handleOpenAddTallaModal}
                  >
                    <IoMdAdd size={18} />
                  </Button>
                </div>

                {(editSelectedColor?.variaciones || []).length > 0 ? (
                  <div className="mt-3 d-flex flex-column gap-2">
                    {editSelectedColor.variaciones.map((variacion) => (
                      <div
                        key={`inputs-${variacion.tallaId}-${variacion.id || "new"}`}
                        className="d-flex gap-2 align-items-center"
                      >
                        <div style={{ minWidth: 80 }}>{variacion.tallaNombre}</div>
                        <Input
                          type="number"
                          min="1"
                          value={variacion.precio}
                          placeholder="Precio"
                          onChange={(event) =>
                            handleVariationFieldChange(
                              editSelectedColor.colorId,
                              variacion.tallaId,
                              "precio",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          type="number"
                          min="0"
                          value={variacion.stock}
                          placeholder="Stock"
                          onChange={(event) =>
                            handleVariationFieldChange(
                              editSelectedColor.colorId,
                              variacion.tallaId,
                              "stock",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted">Sin tallas en este color.</span>
                )}
              </>
            )}
          </div>

          <hr />

          {!isEditing ? (
            <>
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
            </>
          ) : (
            <div className="d-flex gap-2 mt-4">
              <Button
                variant="primary"
                onClick={handleSaveEdit}
                disabled={actualizando}
              >
                {actualizando ? "Guardando..." : "Guardar"}
              </Button>
              <Button variant="secondary" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            </div>
          )}
        </Col>
      </Row>

      <Modal show={showAddColorModal} onHide={() => setShowAddColorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Color</Form.Label>
            <Form.Select
              value={newColorId}
              onChange={(event) => setNewColorId(event.target.value)}
            >
              {availableColorOptions.map((color) => (
                <option key={color.id} value={color.id}>
                  {color.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Imagenes</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={(event) => {
                setNewColorFiles(Array.from(event.target.files || []));
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddColorModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAddColor}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddTallaModal} onHide={() => setShowAddTallaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Talla</Form.Label>
            <Form.Select
              value={newTallaId}
              onChange={(event) => setNewTallaId(event.target.value)}
            >
              {availableTallaOptionsForSelectedColor.map((talla) => (
                <option key={talla.id} value={talla.id}>
                  {talla.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newTallaPrice}
              onChange={(event) => setNewTallaPrice(event.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={newTallaStock}
              onChange={(event) => setNewTallaStock(event.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTallaModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAddTalla}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Detalle;
