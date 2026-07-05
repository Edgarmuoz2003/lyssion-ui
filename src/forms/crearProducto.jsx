import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import Select from "react-select";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import { IoMdAdd } from "react-icons/io";
import { BsCircleFill, BsXCircleFill } from "react-icons/bs";
import {
  GET_CATEGORIAS,
  GET_COLORS,
  GET_TALLAS,
} from "../graphql/queries/productQueries";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import SpinnerComponet from "@/layouts/spinnerComponent";

const placeholderBoxStyle = {
  minHeight: "420px",
  border: "1px dashed #c8c8c8",
  borderRadius: "10px",
  background: "#f8f9fa",
};

const ensurePrincipalImage = (images) => {
  const normalized = images.map((image) => ({ ...image }));
  if (normalized.length > 0 && !normalized.some((image) => image.isPrincipal)) {
    normalized[0].isPrincipal = true;
  }
  return normalized;
};

const buildVariation = (talla) => ({
  id: `new-${talla.value}`,
  tallaId: talla.value,
  tallaNombre: talla.label,
  precio: "",
  precioMayorista: "",
  stock: "10",
});

const ModalCrear = ({ handleClose, show, onCreated }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [colorEntries, setColorEntries] = useState([]);
  const [selectedColorId, setSelectedColorId] = useState(null);
  const [selectedTallaId, setSelectedTallaId] = useState(null);

  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [pendingColorId, setPendingColorId] = useState("");
  const [showAddTallaModal, setShowAddTallaModal] = useState(false);
  const [pendingTallaId, setPendingTallaId] = useState("");
  const [useSamePricesForAllSizes, setUseSamePricesForAllSizes] = useState(false);
  const [useSameSizesForAllColors, setUseSameSizesForAllColors] = useState(false);

  const {
    data: coloresData,
    loading: coloresLoading,
    error: coloresError,
  } = useQuery(GET_COLORS);
  const {
    data: tallasData,
    loading: tallasLoading,
    error: tallasError,
  } = useQuery(GET_TALLAS);
  const {
    data: categoriasData,
    loading: categoriasLoading,
    error: categoriasError,
  } = useQuery(GET_CATEGORIAS);

  const { createProducto, creando, loading } = useProductosStore();

  const colorOptions = useMemo(
    () =>
      (coloresData?.colores || []).map((color) => ({
        value: color.id,
        label: color.nombre,
        color: color.codigo_hex,
      })),
    [coloresData],
  );

  const tallaOptions = useMemo(
    () =>
      (tallasData?.tallas || []).map((talla) => ({
        value: talla.id,
        label: talla.nombre,
      })),
    [tallasData],
  );

  const categoriaOptions = useMemo(
    () =>
      (categoriasData?.categorias || []).map((categoria) => ({
        value: categoria.id,
        label: categoria.nombre,
      })),
    [categoriasData],
  );

  const selectedColorEntry =
    colorEntries.find((entry) => Number(entry.colorId) === Number(selectedColorId)) ||
    colorEntries[0] ||
    null;

  const selectedColorImages = selectedColorEntry?.images || [];

  const selectedVariation =
    selectedColorEntry?.variaciones.find(
      (variacion) => Number(variacion.tallaId) === Number(selectedTallaId),
    ) || selectedColorEntry?.variaciones[0] || null;

  const selectedMainImage =
    selectedColorImages.find((image) => image.isPrincipal) || selectedColorImages[0] || null;

  const availableColorOptions = useMemo(() => {
    const usedIds = new Set(colorEntries.map((entry) => Number(entry.colorId)));
    return colorOptions.filter((color) => !usedIds.has(Number(color.value)));
  }, [colorEntries, colorOptions]);

  const availableTallaOptions = useMemo(() => {
    if (!selectedColorEntry) return [];
    const usedIds = new Set(
      selectedColorEntry.variaciones.map((variacion) => Number(variacion.tallaId)),
    );
    return tallaOptions.filter((talla) => !usedIds.has(Number(talla.value)));
  }, [selectedColorEntry, tallaOptions]);

  const resetForm = () => {
    colorEntries.forEach((entry) => {
      entry.images.forEach((image) => {
        if (image.preview) {
          URL.revokeObjectURL(image.preview);
        }
      });
    });
    setNombre("");
    setDescripcion("");
    setSelectedCategoria(null);
    setColorEntries([]);
    setSelectedColorId(null);
    setSelectedTallaId(null);
    setShowAddColorModal(false);
    setPendingColorId("");
    setShowAddTallaModal(false);
    setPendingTallaId("");
    setUseSamePricesForAllSizes(false);
    setUseSameSizesForAllColors(false);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const formatColorOption = ({ label, color }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          backgroundColor: color || "#fff",
        }}
      />
      <span>{label}</span>
    </div>
  );

  const handleOpenAddColor = () => {
    if (availableColorOptions.length === 0) {
      mostrarError("No hay mas colores disponibles para agregar.");
      return;
    }
    setPendingColorId(String(availableColorOptions[0].value));
    setShowAddColorModal(true);
  };

  const handleConfirmAddColor = () => {
    const color = availableColorOptions.find(
      (item) => Number(item.value) === Number(pendingColorId),
    );

    if (!color) {
      mostrarError("Debes seleccionar un color.");
      return;
    }

    const nextEntry = {
      colorId: color.value,
      colorOption: color,
      images: [],
      variaciones:
        useSameSizesForAllColors && selectedColorEntry?.variaciones?.length
          ? selectedColorEntry.variaciones.map((variacion) => ({
              ...variacion,
            }))
          : [],
    };

    setColorEntries((prev) => [...prev, nextEntry]);
    setSelectedColorId(color.value);
    setSelectedTallaId(null);
    setShowAddColorModal(false);
    setPendingColorId("");
  };

  const handleRemoveColor = (colorId) => {
    setColorEntries((prev) =>
      prev.reduce((acc, entry) => {
        if (Number(entry.colorId) === Number(colorId)) {
          entry.images.forEach((image) => {
            if (image.preview) {
              URL.revokeObjectURL(image.preview);
            }
          });
          return acc;
        }
        return [...acc, entry];
      }, []),
    );

    if (Number(selectedColorId) === Number(colorId)) {
      const nextColor = colorEntries.find(
        (entry) => Number(entry.colorId) !== Number(colorId),
      );
      setSelectedColorId(nextColor?.colorId || null);
      setSelectedTallaId(nextColor?.variaciones?.[0]?.tallaId || null);
    }
  };

  const handleAddImages = (colorId, files) => {
    if (!files?.length) return;

    const filesArray = Array.from(files);
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (Number(entry.colorId) !== Number(colorId)) return entry;

        const newImages = filesArray.map((file, index) => ({
          id: `${colorId}-${Date.now()}-${index}`,
          file,
          preview: URL.createObjectURL(file),
          isPrincipal: false,
        }));

        return {
          ...entry,
          images: ensurePrincipalImage([...entry.images, ...newImages]),
        };
      }),
    );
  };

  const handleRemoveImage = (colorId, imageId) => {
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (Number(entry.colorId) !== Number(colorId)) return entry;

        const nextImages = entry.images
          .filter((image) => {
            const keep = image.id !== imageId;
            if (!keep && image.preview) {
              URL.revokeObjectURL(image.preview);
            }
            return keep;
          })
          .map((image) => ({ ...image }));

        return {
          ...entry,
          images: ensurePrincipalImage(nextImages),
        };
      }),
    );
  };

  const handleSetPrincipalImage = (colorId, imageId) => {
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (Number(entry.colorId) !== Number(colorId)) return entry;
        return {
          ...entry,
          images: entry.images.map((image) => ({
            ...image,
            isPrincipal: image.id === imageId,
          })),
        };
      }),
    );
  };

  const handleOpenAddTalla = () => {
    if (!selectedColorEntry) {
      mostrarError("Selecciona primero un color.");
      return;
    }
    if (availableTallaOptions.length === 0) {
      mostrarError("Ese color ya tiene todas las tallas disponibles.");
      return;
    }
    setPendingTallaId(String(availableTallaOptions[0].value));
    setShowAddTallaModal(true);
  };

  const handleConfirmAddTalla = () => {
    if (!selectedColorEntry) return;

    const talla = availableTallaOptions.find(
      (item) => Number(item.value) === Number(pendingTallaId),
    );

    if (!talla) {
      mostrarError("Debes seleccionar una talla.");
      return;
    }

    const nextVariation = buildVariation(talla);

    setColorEntries((prev) =>
      prev.map((entry) => {
        const shouldReplicate = useSameSizesForAllColors;
        const isSelectedColor =
          Number(entry.colorId) === Number(selectedColorEntry.colorId);

        if (!shouldReplicate && !isSelectedColor) {
          return entry;
        }

        const alreadyExists = entry.variaciones.some(
          (variacion) => Number(variacion.tallaId) === Number(talla.value),
        );

        if (alreadyExists) {
          return entry;
        }

        return {
          ...entry,
          variaciones: [...entry.variaciones, { ...nextVariation }],
        };
      }),
    );

    setSelectedTallaId(talla.value);
    setShowAddTallaModal(false);
    setPendingTallaId("");
  };

  const handleAddAllTallas = () => {
    if (!selectedColorEntry) return;
    if (availableTallaOptions.length === 0) {
      mostrarError("Ese color ya tiene todas las tallas disponibles.");
      return;
    }

    const basePrecio = selectedVariation?.precio || "";
    const basePrecioMayorista = selectedVariation?.precioMayorista || "";
    const baseStock = selectedVariation?.stock || "10";

    const newVariations = availableTallaOptions.map((talla) => ({
      ...buildVariation(talla),
      precio: useSamePricesForAllSizes ? basePrecio : "",
      precioMayorista: useSamePricesForAllSizes ? basePrecioMayorista : "",
      stock: baseStock,
    }));

    setColorEntries((prev) =>
      prev.map((entry) => {
        const shouldReplicate = useSameSizesForAllColors;
        const isSelectedColor =
          Number(entry.colorId) === Number(selectedColorEntry.colorId);

        if (!shouldReplicate && !isSelectedColor) {
          return entry;
        }

        const existingIds = new Set(
          entry.variaciones.map((variacion) => Number(variacion.tallaId)),
        );

        return {
          ...entry,
          variaciones: [
            ...entry.variaciones,
            ...newVariations
              .filter((variacion) => !existingIds.has(Number(variacion.tallaId)))
              .map((variacion) => ({ ...variacion })),
          ],
        };
      }),
    );

    setSelectedTallaId(newVariations[0]?.tallaId || selectedTallaId);
    setShowAddTallaModal(false);
    setPendingTallaId("");
  };

  const handleRemoveTalla = (tallaId) => {
    if (!selectedColorEntry) return;

    setColorEntries((prev) =>
      prev.map((entry) => {
        const shouldReplicate = useSameSizesForAllColors;
        const isSelectedColor =
          Number(entry.colorId) === Number(selectedColorEntry.colorId);

        if (!shouldReplicate && !isSelectedColor) {
          return entry;
        }

        return {
          ...entry,
          variaciones: entry.variaciones.filter(
            (variacion) => Number(variacion.tallaId) !== Number(tallaId),
          ),
        };
      }),
    );

    if (Number(selectedTallaId) === Number(tallaId)) {
      const nextVariation = selectedColorEntry.variaciones.find(
        (variacion) => Number(variacion.tallaId) !== Number(tallaId),
      );
      setSelectedTallaId(nextVariation?.tallaId || null);
    }
  };

  const handleVariationFieldChange = (tallaId, field, value) => {
    if (!selectedColorEntry) return;

    setColorEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        variaciones: entry.variaciones.map((variacion) => {
          const shouldUpdateCurrent =
            Number(entry.colorId) === Number(selectedColorEntry.colorId) &&
            Number(variacion.tallaId) === Number(tallaId);
          const shouldReplicate =
            useSamePricesForAllSizes &&
            (field === "precio" || field === "precioMayorista");

          if (!shouldUpdateCurrent && !shouldReplicate) {
            return variacion;
          }

          return {
            ...variacion,
            [field]:
              shouldUpdateCurrent ||
              (shouldReplicate && (field === "precio" || field === "precioMayorista"))
                ? value
                : variacion[field],
          };
        }),
      })),
    );
  };

  const handleToggleSamePrices = (checked) => {
    setUseSamePricesForAllSizes(checked);

    if (!checked || !selectedVariation) {
      return;
    }

    setColorEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        variaciones: entry.variaciones.map((variacion) => ({
          ...variacion,
          precio: selectedVariation.precio,
          precioMayorista: selectedVariation.precioMayorista,
        })),
      })),
    );
  };

  const handleToggleSameSizes = (checked) => {
    setUseSameSizesForAllColors(checked);

    if (!checked || !selectedColorEntry?.variaciones?.length) {
      return;
    }

    setColorEntries((prev) =>
      prev.map((entry) => ({
        ...entry,
        variaciones: selectedColorEntry.variaciones.map((variacion) => ({
          ...variacion,
        })),
      })),
    );
  };

  const validateForm = () => {
    if (!nombre.trim()) {
      mostrarError("El nombre del producto es obligatorio.");
      return false;
    }

    if (!descripcion.trim()) {
      mostrarError("La descripcion del producto es obligatoria.");
      return false;
    }

    if (!selectedCategoria) {
      mostrarError("Debes seleccionar una categoria.");
      return false;
    }

    if (!colorEntries.length) {
      mostrarError("Debes agregar al menos un color.");
      return false;
    }

    for (const colorEntry of colorEntries) {
      if (!colorEntry.variaciones.length) {
        mostrarError(
          `El color ${colorEntry.colorOption.label} debe tener al menos una talla.`,
        );
        return false;
      }

      for (const variacion of colorEntry.variaciones) {
        if (!Number.isInteger(Number(variacion.precio)) || Number(variacion.precio) <= 0) {
          mostrarError("Cada talla debe tener un precio al detal entero mayor que cero.");
          return false;
        }

        if (
          !Number.isInteger(Number(variacion.precioMayorista)) ||
          Number(variacion.precioMayorista) <= 0
        ) {
          mostrarError("Cada talla debe tener un precio mayorista entero mayor que cero.");
          return false;
        }

        if (!Number.isInteger(Number(variacion.stock)) || Number(variacion.stock) < 0) {
          mostrarError("Cada talla debe tener stock entero mayor o igual a cero.");
          return false;
        }
      }
    }

    const missingImagesColors = colorEntries.filter((entry) => entry.images.length === 0);
    if (missingImagesColors.length > 0) {
      const colorNames = missingImagesColors
        .map((entry) => entry.colorOption.label)
        .join(", ");
      const shouldContinue = window.confirm(
        `El color ${colorNames} aun no tiene imagenes, desea continuar?`,
      );
      if (!shouldContinue) {
        return false;
      }
    }

    return true;
  };

  const buildInput = () => ({
    nombre: nombre.trim(),
    descripcion: descripcion.trim(),
    categoriaId: selectedCategoria.value,
    colores: colorEntries.map((entry) => ({
      colorId: entry.colorId,
      imagenes: entry.images.map((image) => ({
        archivo: image.file,
        isPrincipal: Boolean(image.isPrincipal),
      })),
      variaciones: entry.variaciones.map((variacion) => ({
        tallaId: variacion.tallaId,
        precio: Number(variacion.precio),
        precioMayorista: Number(variacion.precioMayorista),
        stock: Number(variacion.stock),
      })),
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await createProducto({
        variables: { input: buildInput() },
      });

      const createdId = response?.data?.createProducto?.id;
      mostrarExito("Producto creado con exito");
      resetForm();
      handleClose();
      onCreated?.(createdId);
    } catch (error) {
      console.error("Error al crear el producto:", error);
      mostrarError("Error al crear el producto", error.message);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Crear producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              <Col md={1} className="d-flex flex-md-column gap-2">
                {selectedColorImages.map((image) => (
                  <img
                    key={image.id}
                    src={image.preview}
                    alt={selectedColorEntry?.colorOption?.label || "color"}
                    className="img-fluid detail-thumbnail"
                    style={{
                      cursor: "pointer",
                      border:
                        selectedMainImage?.id === image.id
                          ? "2px solid black"
                          : "2px solid #eee",
                      width: "80px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                ))}
              </Col>

              <Col md={5}>
                {selectedMainImage ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={selectedMainImage.preview}
                      alt={`Imagen ${nombre || "producto"}`}
                      className="img-fluid detail-main-image"
                    />
                    {selectedColorEntry ? (
                      <Button
                        as="label"
                        variant="light"
                        size="sm"
                        style={{ position: "absolute", top: 16, right: 16 }}
                      >
                        Añadir imagen
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          hidden
                          onChange={(event) => {
                            handleAddImages(selectedColorEntry.colorId, event.target.files);
                            event.target.value = "";
                          }}
                        />
                      </Button>
                    ) : null}
                  </div>
                ) : (
                  <div
                    className="d-flex flex-column justify-content-center align-items-center gap-3"
                    style={placeholderBoxStyle}
                  >
                    <div className="text-muted" style={{ fontSize: 22, fontWeight: 600 }}>
                      Imagen
                    </div>
                    {selectedColorEntry ? (
                      <Button as="label" variant="dark">
                        Añadir imagen
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          hidden
                          onChange={(event) => {
                            handleAddImages(selectedColorEntry.colorId, event.target.files);
                            event.target.value = "";
                          }}
                        />
                      </Button>
                    ) : (
                      <span className="text-muted">Agrega un color para cargar imagenes</span>
                    )}
                  </div>
                )}

                {selectedColorEntry?.images?.length ? (
                  <div className="d-flex gap-2 flex-wrap mt-3">
                    {selectedColorEntry.images.map((image) => (
                      <div
                        key={image.id}
                        style={{ border: "1px solid #ddd", padding: 8, borderRadius: 6 }}
                      >
                        <Image
                          src={image.preview}
                          alt={selectedColorEntry.colorOption.label}
                          thumbnail
                          style={{ width: 110, height: 120, objectFit: "cover" }}
                        />
                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <Form.Check
                            type="radio"
                            label="Principal"
                            name={`principal-${selectedColorEntry.colorId}`}
                            checked={Boolean(image.isPrincipal)}
                            onChange={() =>
                              handleSetPrincipalImage(selectedColorEntry.colorId, image.id)
                            }
                          />
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleRemoveImage(selectedColorEntry.colorId, image.id)
                            }
                          >
                            Quitar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </Col>

              <Col md={6}>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex flex-column gap-2">
                    <label>Titulo</label>
                    <Input
                      value={nombre}
                      placeholder="Ingresa el titulo del producto"
                      onChange={(event) => setNombre(event.target.value)}
                    />
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <label>Descripcion</label>
                    <TextArea
                      rows={4}
                      value={descripcion}
                      placeholder="Ingresa la descripcion"
                      onChange={(event) => setDescripcion(event.target.value)}
                    />
                  </div>

                  <div className="d-flex flex-column gap-2">
                    <label>Categoria</label>
                    <Select
                      options={categoriaOptions}
                      value={selectedCategoria}
                      onChange={setSelectedCategoria}
                      isLoading={categoriasLoading}
                      placeholder="Selecciona una categoria"
                      isDisabled={categoriasLoading || !!categoriasError}
                    />
                  </div>

                  <hr />

                  <div className="mb-2">
                    <p>
                      <strong>Colores:</strong>{" "}
                      {selectedColorEntry?.colorOption?.label || "No disponible"}
                    </p>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                      {colorEntries.length > 0 ? (
                        colorEntries.map((entry) => (
                          <div
                            key={entry.colorId}
                            style={{ position: "relative", width: 24, height: 24 }}
                          >
                            <BsCircleFill
                              className="color-swatch"
                              style={{
                                color: entry.colorOption.color || "#000",
                                cursor: "pointer",
                                outline:
                                  Number(selectedColorEntry?.colorId) === Number(entry.colorId)
                                    ? "2px solid black"
                                    : `1px solid ${
                                        (entry.colorOption.color || "").toUpperCase() ===
                                        "#FFFFFF"
                                          ? "#ccc"
                                          : "transparent"
                                      }`,
                                outlineOffset: "2px",
                              }}
                              onClick={() => {
                                setSelectedColorId(entry.colorId);
                                setSelectedTallaId(entry.variaciones[0]?.tallaId || null);
                              }}
                              title={entry.colorOption.label}
                            />
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
                              onClick={() => handleRemoveColor(entry.colorId)}
                            />
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">Sin colores disponibles</span>
                      )}

                      <Button variant="outline-primary" size="sm" onClick={handleOpenAddColor}>
                        <IoMdAdd size={18} /> Añadir color
                      </Button>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-2">
                    <p>
                      <strong>Tallas disponibles:</strong>
                    </p>
                    <div className="mb-3">
                      <Form.Check
                        type="switch"
                        id="same-sizes-switch"
                        label="Usar estas tallas en todos los colores disponibles"
                        checked={useSameSizesForAllColors}
                        onChange={(event) => handleToggleSameSizes(event.target.checked)}
                      />
                    </div>
                    <div className="d-flex gap-2 flex-wrap align-items-center">
                      {(selectedColorEntry?.variaciones || []).length > 0 ? (
                        selectedColorEntry.variaciones.map((variacion) => (
                          <div key={variacion.tallaId} style={{ position: "relative" }}>
                            <span
                              className="talla-badge"
                              style={{
                                padding: "0.5rem 1rem",
                                border:
                                  Number(selectedVariation?.tallaId) ===
                                  Number(variacion.tallaId)
                                    ? "2px solid black"
                                    : "1px solid #eee",
                                borderRadius: "4px",
                                cursor: "pointer",
                              }}
                              onClick={() => setSelectedTallaId(variacion.tallaId)}
                            >
                              {variacion.tallaNombre}
                            </span>
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
                              onClick={() => handleRemoveTalla(variacion.tallaId)}
                            />
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">Sin tallas en este color.</span>
                      )}

                      <Button variant="outline-primary" size="sm" onClick={handleOpenAddTalla}>
                        <IoMdAdd size={18} /> Añadir talla
                      </Button>
                    </div>
                  </div>

                  <hr />

                  {selectedVariation ? (
                    <div className="d-flex flex-column gap-3">
                      <div className="text-muted" style={{ fontWeight: 600 }}>
                        Configuracion para talla {selectedVariation.tallaNombre}
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <Form.Check
                          type="switch"
                          id="same-prices-switch"
                          label="Usar mismo precio para todas las tallas"
                          checked={useSamePricesForAllSizes}
                          onChange={(event) => handleToggleSamePrices(event.target.checked)}
                        />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <label>Precio al detal</label>
                        <Input
                          type="number"
                          min="1"
                          value={selectedVariation.precio}
                          placeholder="Ingresa el precio al detal"
                          onChange={(event) =>
                            handleVariationFieldChange(
                              selectedVariation.tallaId,
                              "precio",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <label>Precio mayorista</label>
                        <Input
                          type="number"
                          min="1"
                          value={selectedVariation.precioMayorista}
                          placeholder="Ingresa el precio mayorista"
                          onChange={(event) =>
                            handleVariationFieldChange(
                              selectedVariation.tallaId,
                              "precioMayorista",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                      <div className="d-flex flex-column gap-2">
                        <label>Stock</label>
                        <Input
                          type="number"
                          min="0"
                          value={selectedVariation.stock}
                          placeholder="Ingresa el stock"
                          onChange={(event) =>
                            handleVariationFieldChange(
                              selectedVariation.tallaId,
                              "stock",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted">
                      Selecciona un color y agrega una talla para configurar precios.
                    </span>
                  )}
                </div>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={creando || loading}>
                {creando || loading ? <SpinnerComponet /> : "Guardar"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddColorModal} onHide={() => setShowAddColorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir color</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Color</Form.Label>
            <Form.Select
              value={pendingColorId}
              onChange={(event) => setPendingColorId(event.target.value)}
              disabled={coloresLoading || !!coloresError}
            >
              {availableColorOptions.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Form.Select>
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
          <Modal.Title>Añadir talla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Talla</Form.Label>
            <Form.Select
              value={pendingTallaId}
              onChange={(event) => setPendingTallaId(event.target.value)}
              disabled={tallasLoading || !!tallasError}
            >
              {availableTallaOptions.map((talla) => (
                <option key={talla.value} value={talla.value}>
                  {talla.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-primary" onClick={handleAddAllTallas}>
            Todas las tallas
          </Button>
          <Button variant="secondary" onClick={() => setShowAddTallaModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAddTalla}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalCrear;
