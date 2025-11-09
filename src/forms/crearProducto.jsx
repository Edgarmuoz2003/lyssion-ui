import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Modal, Form, Image } from "react-bootstrap";
import Select from "react-select";
import {
  GET_COLORS,
  GET_TALLAS,
  GET_CATEGORIAS,
  GET_PRODUCTOS,
} from "../graphql/queries/productQueries";
import { IoMdAdd } from "react-icons/io";
import { CREATE_PRODUCTS } from "../graphql/mutations/productMutatios";
import { useMainStore } from "../store/useMainStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import SpinnerComponet from "@/layouts/spinnerComponent";

const INITIAL_VARIATION_DRAFT = { talla: null, precio: "", stock: "" };

const ModalCrear = ({ handleClose, show }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedColorOption, setSelectedColorOption] = useState(null);
  const [colorEntries, setColorEntries] = useState([]);
  const [variationDrafts, setVariationDrafts] = useState({});

  const formateador = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const resetForm = () => {
    setColorEntries((prev) => {
      prev.forEach((entry) => {
        entry.images.forEach((image) => URL.revokeObjectURL(image.preview));
      });
      return [];
    });
    setVariationDrafts({});
    setSelectedColorOption(null);
    setNombre("");
    setDescripcion("");
    setSelectedCategoria(null);
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

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

  // const setProductos = useMainStore((state) => state.setProductos);

  // const [refrescarProductos, { loading: cargandoProductos }] = useLazyQuery(
  //   GET_PRODUCTOS,
  //   {
  //     fetchPolicy: "network-only",
  //     onCompleted: (data) => {
  //       setProductos(data.productos);
  //       mostrarExito("Producto creado y lista actualizada.");
  //       handleModalClose();
  //     },
  //     onError: (error) => {
  //       mostrarError(
  //         "Producto creado, pero falló al refrescar la lista.",
  //         error.message
  //       );
  //       handleModalClose();
  //     },
  //   }
  // );

  // const [createProducto, { loading: creandoProducto }] = useMutation(
  //   CREATE_PRODUCTS,
  //   {
  //     onCompleted: () => {
  //       refrescarProductos();
  //     },
  //     onError: (error) => {
  //       mostrarError("Error al crear el producto", error.message);
  //     },
  //   }
  // );

  const {createProducto, creando, loading } = useProductosStore();

  const coloresOptions =
    coloresData?.colores.map((color) => ({
      value: color.id,
      label: color.nombre,
      color: color.codigo_hex,
    })) || [];

  const tallasOptions =
    tallasData?.tallas.map((talla) => ({
      value: talla.id,
      label: talla.nombre,
    })) || [];

  const categoriasOptions =
    categoriasData?.categorias.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })) || [];

  const formatOptionLabel = ({ label, color }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: color,
          borderRadius: "3px",
          marginRight: "8px",
          border: "1px solid #ccc",
        }}
      />
      <span>{label}</span>
    </div>
  );

  const handleCategoria = (option) => {
    setSelectedCategoria(option);
  };

  const handleAddColor = () => {
    if (!selectedColorOption) {
      return mostrarError("Debe seleccionar un color para añadirlo.");
    }
    if (colorEntries.some((entry) => entry.colorId === selectedColorOption.value)) {
      return mostrarError("Ese color ya fue añadido al producto.");
    }

    setColorEntries((prev) => [
      ...prev,
      {
        colorId: selectedColorOption.value,
        colorOption: selectedColorOption,
        images: [],
        variations: [],
      },
    ]);
    setVariationDrafts((prev) => ({
      ...prev,
      [selectedColorOption.value]: { ...INITIAL_VARIATION_DRAFT },
    }));
    setSelectedColorOption(null);
  };

  const handleRemoveColor = (colorId) => {
    setColorEntries((prev) =>
      prev.reduce((acc, entry) => {
        if (entry.colorId === colorId) {
          entry.images.forEach((image) => URL.revokeObjectURL(image.preview));
          return acc;
        }
        return [...acc, entry];
      }, [])
    );
    setVariationDrafts((prev) => {
      const { [colorId]: _omit, ...rest } = prev;
      return rest;
    });
  };

  const handleAddImages = (colorId, files) => {
    if (!files || files.length === 0) {
      return;
    }

    const filesArray = Array.from(files);

    setColorEntries((prev) =>
      prev.map((entry) => {
        if (entry.colorId !== colorId) {
          return entry;
        }

        const newImages = filesArray.map((file, index) => ({
          id: `${colorId}-${Date.now()}-${index}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          isPrincipal: false,
        }));

        const hasPrincipal = entry.images.some((image) => image.isPrincipal);
        if (!hasPrincipal && newImages.length > 0) {
          newImages[0].isPrincipal = true;
        }

        return {
          ...entry,
          images: [...entry.images, ...newImages],
        };
      })
    );
  };

  const handleRemoveImage = (colorId, imageId) => {
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (entry.colorId !== colorId) {
          return entry;
        }

        const updatedImages = entry.images
          .filter((image) => {
            if (image.id === imageId) {
              URL.revokeObjectURL(image.preview);
              return false;
            }
            return true;
          })
          .map((image) => ({ ...image }));

        if (
          updatedImages.length > 0 &&
          !updatedImages.some((image) => image.isPrincipal)
        ) {
          updatedImages[0].isPrincipal = true;
        }

        return {
          ...entry,
          images: updatedImages,
        };
      })
    );
  };

  const handleSetPrincipalImage = (colorId, imageId) => {
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (entry.colorId !== colorId) {
          return entry;
        }

        return {
          ...entry,
          images: entry.images.map((image) => ({
            ...image,
            isPrincipal: image.id === imageId,
          })),
        };
      })
    );
  };

  const handleDraftVariationChange = (colorId, field, value) => {
    setVariationDrafts((prev) => ({
      ...prev,
      [colorId]: {
        ...prev[colorId],
        [field]: value,
      },
    }));
  };

  const handleAddVariation = (colorId) => {
    const draft = variationDrafts[colorId] || INITIAL_VARIATION_DRAFT;
    const { talla, precio, stock } = draft;

    if (!talla) {
      return mostrarError("Debe seleccionar una talla para la variación.");
    }

    const precioValue = Number(precio);
    const stockValue = Number(stock);

    if (!Number.isInteger(precioValue) || precioValue <= 0) {
      return mostrarError("El precio de la variación debe ser un número entero mayor que cero.");
    }

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      return mostrarError("El stock debe ser un número entero mayor o igual a cero.");
    }

    setColorEntries((prev) =>
      prev.map((entry) => {
        if (entry.colorId !== colorId) {
          return entry;
        }

        if (entry.variations.some((variation) => variation.tallaId === talla.value)) {
          mostrarError("Esa talla ya existe para el color seleccionado.");
          return entry;
        }

        return {
          ...entry,
          variations: [
            ...entry.variations,
            {
              id: `${colorId}-${talla.value}`,
              tallaId: talla.value,
              tallaNombre: talla.label,
              precio: precioValue,
              stock: stockValue,
            },
          ],
        };
      })
    );

    setVariationDrafts((prev) => ({
      ...prev,
      [colorId]: { ...INITIAL_VARIATION_DRAFT },
    }));
  };

  const handleRemoveVariation = (colorId, variationId) => {
    setColorEntries((prev) =>
      prev.map((entry) => {
        if (entry.colorId !== colorId) {
          return entry;
        }
        return {
          ...entry,
          variations: entry.variations.filter(
            (variation) => variation.id !== variationId
          ),
        };
      })
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (colorEntries.length === 0) {
      return mostrarError("Debe agregar al menos un color con imágenes.");
    }

    for (const entry of colorEntries) {
      if (entry.images.length === 0) {
        return mostrarError(
          `El color ${entry.colorOption.label} necesita al menos una imagen.`
        );
      }
      if (entry.variations.length === 0) {
        return mostrarError(
          `El color ${entry.colorOption.label} necesita al menos una variación.`
        );
      }
    }

    if (!nombre.trim()) {
      return mostrarError("El nombre del producto es obligatorio.");
    }

    if (!descripcion.trim()) {
      return mostrarError("La descripción del producto es obligatoria.");
    }

    if (!selectedCategoria) {
      return mostrarError("Debe seleccionar una categoría.");
    }

    const colores = colorEntries.map((entry) => {
      const normalizedImages = entry.images.map((image) => ({ ...image }));

      if (
        normalizedImages.length > 0 &&
        !normalizedImages.some((image) => image.isPrincipal)
      ) {
        normalizedImages[0].isPrincipal = true;
      }

      return {
        colorId: entry.colorId,
        imagenes: normalizedImages.map((image) => ({
          archivo: image.file,
          isPrincipal: image.isPrincipal,
        })),
        variaciones: entry.variations.map((variation) => ({
          tallaId: variation.tallaId,
          precio: variation.precio,
          stock: variation.stock,
        })),
      };
    });

    const input = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      categoriaId: selectedCategoria ? selectedCategoria.value : null,
      colores,
    };

    try {
      await createProducto({
      variables: { input },
    });
    mostrarExito('Producto creado con éxito')
    handleModalClose()
    } catch (error) {
      console.error('Error al crear el producto:', error);
      mostrarError('Error al crear el producto', error.message);
      handleModalClose()
    }
   
  };


  return (
    <>
      <Modal show={show} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="colorDisponible" className="mb-4">
              <Form.Label>Colores e imágenes</Form.Label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <Select
                    options={coloresOptions}
                    value={selectedColorOption}
                    onChange={setSelectedColorOption}
                    isLoading={coloresLoading}
                    placeholder={
                      coloresLoading
                        ? "Cargando colores..."
                        : "Seleccione un color para añadir"
                    }
                    isDisabled={coloresLoading || !!coloresError}
                    formatOptionLabel={formatOptionLabel}
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={handleAddColor}
                  disabled={!selectedColorOption}
                >
                  <IoMdAdd size={20} />
                </Button>
              </div>
              {coloresError && (
                <div style={{ color: "red", marginTop: 5 }}>
                  Error al cargar los colores
                </div>
              )}
            </Form.Group>

            {colorEntries.map((entry) => {
              const draft = variationDrafts[entry.colorId] || INITIAL_VARIATION_DRAFT;

              return (
                <div
                  key={entry.colorId}
                  style={{
                    border: "1px solid #ebebeb",
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                          backgroundColor: entry.colorOption.color,
                        }}
                      />
                      <strong>{entry.colorOption.label}</strong>
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRemoveColor(entry.colorId)}
                    >
                      Eliminar color
                    </Button>
                  </div>

                  <Form.Group className="mb-3">
                    <Form.Label>Imágenes del color</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(event) => {
                        handleAddImages(entry.colorId, event.target.files);
                        event.target.value = "";
                      }}
                    />
                    {entry.images.length > 0 && (
                      <div className="form_image-preview" style={{ marginTop: "12px" }}>
                        {entry.images.map((image) => (
                          <div key={image.id} className="form_image-item">
                            <Image
                              src={image.preview}
                              alt={entry.colorOption.label}
                              thumbnail
                            />
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "8px",
                              }}
                            >
                              <Form.Check
                                type="radio"
                                label="Principal"
                                name={`principal-${entry.colorId}`}
                                checked={image.isPrincipal}
                                onChange={() =>
                                  handleSetPrincipalImage(entry.colorId, image.id)
                                }
                              />
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleRemoveImage(entry.colorId, image.id)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Variaciones (SKU)</Form.Label>
                    <div
                      style={{
                        display: "grid",
                        gap: "12px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        alignItems: "end",
                      }}
                    >
                      <Select
                        options={tallasOptions}
                        value={draft.talla}
                        onChange={(option) =>
                          handleDraftVariationChange(entry.colorId, "talla", option)
                        }
                        isLoading={tallasLoading}
                        placeholder={
                          tallasLoading
                            ? "Cargando tallas..."
                            : "Seleccione una talla"
                        }
                        isDisabled={tallasLoading || !!tallasError}
                      />
                      <Form.Control
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Precio"
                        value={draft.precio}
                        onChange={(event) =>
                          handleDraftVariationChange(
                            entry.colorId,
                            "precio",
                            event.target.value
                          )
                        }
                      />
                      <Form.Control
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Stock"
                        value={draft.stock}
                        onChange={(event) =>
                          handleDraftVariationChange(
                            entry.colorId,
                            "stock",
                            event.target.value
                          )
                        }
                      />
                      <Button
                        variant="secondary"
                        onClick={() => handleAddVariation(entry.colorId)}
                      >
                        Agregar variación
                      </Button>
                    </div>
                    {tallasError && (
                      <div style={{ color: "red", marginTop: 5 }}>
                        Error al cargar las tallas
                      </div>
                    )}
                  </Form.Group>

                  {entry.variations.length > 0 && (
                    <div>
                      <strong>Variaciones agregadas</strong>
                      <div style={{ marginTop: "8px", display: "grid", gap: "8px" }}>
                        {entry.variations.map((variation) => (
                          <div
                            key={variation.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 12px",
                              border: "1px solid #f0f0f0",
                              borderRadius: "6px",
                            }}
                          >
                            <div>
                              <div>
                                <strong>Talla:</strong> {variation.tallaNombre}
                              </div>
                              <div>
                                <strong>Precio:</strong>{" "}
                                {formateador.format(variation.precio)}
                              </div>
                              <div>
                                <strong>Stock:</strong> {variation.stock}
                              </div>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleRemoveVariation(entry.colorId, variation.id)
                              }
                            >
                              Quitar
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del producto"
                value={nombre}
                onChange={(event) => setNombre(event.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Descripción del producto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese la descripción del producto"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="categoriasDisponible" className="mb-4">
              <Form.Label>Categoría</Form.Label>
              <Select
                options={categoriasOptions}
                value={selectedCategoria}
                onChange={handleCategoria}
                isLoading={categoriasLoading}
                placeholder={
                  categoriasLoading
                    ? "Cargando categorías..."
                    : "Seleccione una categoría"
                }
                isDisabled={categoriasLoading || !!categoriasError}
              />
              {categoriasError && (
                <div style={{ color: "red", marginTop: 5 }}>
                  Error al cargar las categorías
                </div>
              )}
            </Form.Group>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={creando || loading}
              >
                {creando || loading ? <SpinnerComponet/> : "Guardar"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCrear;

