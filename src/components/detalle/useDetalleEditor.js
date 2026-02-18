import { useEffect, useMemo, useState } from "react";
import { mostrarError, mostrarExito } from "@/utils/hookMensajes";
import {
  buildEditDraft,
  cleanupDraftObjectUrls,
  ensurePrincipalImage,
  getPrincipalImage,
} from "@/components/detalle.helpers";

export const useDetalleEditor = ({
  producto,
  coloresData,
  tallasData,
  setMainImage,
  updateProducto,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const [editSelectedColorId, setEditSelectedColorId] = useState(null);
  const [hoveredColorId, setHoveredColorId] = useState(null);
  const [hoveredTallaId, setHoveredTallaId] = useState(null);

  const [showAddColorModal, setShowAddColorModal] = useState(false);
  const [newColorId, setNewColorId] = useState("");
  const [newColorFiles, setNewColorFiles] = useState([]);

  const [showAddTallaModal, setShowAddTallaModal] = useState(false);
  const [newTallaId, setNewTallaId] = useState("");
  const [newTallaPrice, setNewTallaPrice] = useState("");
  const [newTallaStock, setNewTallaStock] = useState("10");

  useEffect(() => {
    return () => {
      cleanupDraftObjectUrls(editDraft);
    };
  }, [editDraft]);

  const editColorEntries = editDraft?.colores || [];
  const editSelectedColor =
    editColorEntries.find(
      (entry) => Number(entry.colorId) === Number(editSelectedColorId),
    ) || editColorEntries[0] || null;

  const availableColorOptions = useMemo(() => {
    const used = new Set(
      (editDraft?.colores || []).map((entry) => Number(entry.colorId)),
    );
    return (coloresData?.colores || []).filter(
      (color) => !used.has(Number(color.id)),
    );
  }, [coloresData, editDraft]);

  const availableTallaOptionsForSelectedColor = useMemo(() => {
    const current = new Set(
      (editSelectedColor?.variaciones || []).map((variacion) =>
        Number(variacion.tallaId),
      ),
    );
    return (tallasData?.tallas || []).filter(
      (talla) => !current.has(Number(talla.id)),
    );
  }, [tallasData, editSelectedColor]);

  const handleEdit = () => {
    cleanupDraftObjectUrls(editDraft);
    const nextDraft = buildEditDraft(producto);
    setEditDraft(nextDraft);
    setEditSelectedColorId(nextDraft?.colores?.[0]?.colorId || null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    cleanupDraftObjectUrls(editDraft);
    setEditDraft(null);
    setEditSelectedColorId(null);
    setShowAddColorModal(false);
    setShowAddTallaModal(false);
    setNewColorId("");
    setNewColorFiles([]);
    setNewTallaId("");
    setNewTallaPrice("");
    setNewTallaStock("10");
    setIsEditing(false);
  };

  const handleDraftFieldChange = (field, value) => {
    setEditDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveColor = (colorId) => {
    setEditDraft((prev) => {
      if (!prev) return prev;

      const nextColors = prev.colores.filter((entry) => {
        const keep = Number(entry.colorId) !== Number(colorId);
        if (!keep) {
          (entry.imagenes || []).forEach((img) => {
            if (img.isNew && img.url) {
              URL.revokeObjectURL(img.url);
            }
          });
        }
        return keep;
      });

      return {
        ...prev,
        colores: nextColors,
      };
    });

    if (Number(editSelectedColorId) === Number(colorId)) {
      const nextColor = editColorEntries.find(
        (entry) => Number(entry.colorId) !== Number(colorId),
      );
      setEditSelectedColorId(nextColor?.colorId || null);
      setMainImage(getPrincipalImage(nextColor) || null);
    }
  };

  const handleAddImagesToColor = (colorId, files) => {
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(colorId)) return entry;

          const newImages = filesArray.map((file, idx) => ({
            id: `new-${colorId}-${Date.now()}-${idx}`,
            url: URL.createObjectURL(file),
            isPrincipal: false,
            isNew: true,
            file,
          }));

          const merged = [...entry.imagenes, ...newImages];

          return {
            ...entry,
            imagenes: ensurePrincipalImage(merged),
          };
        }),
      };
    });
  };

  const handleRemoveImage = (colorId, imageId) => {
    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(colorId)) return entry;

          const nextImages = entry.imagenes
            .filter((img) => {
              const keep = String(img.id) !== String(imageId);
              if (!keep && img.isNew && img.url) {
                URL.revokeObjectURL(img.url);
              }
              return keep;
            })
            .map((img) => ({ ...img }));

          return {
            ...entry,
            imagenes: ensurePrincipalImage(nextImages),
          };
        }),
      };
    });
  };

  const handleSetPrincipalImage = (colorId, imageId) => {
    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(colorId)) return entry;
          return {
            ...entry,
            imagenes: entry.imagenes.map((img) => ({
              ...img,
              isPrincipal: String(img.id) === String(imageId),
            })),
          };
        }),
      };
    });
  };

  const handleOpenAddColorModal = () => {
    if (availableColorOptions.length === 0) {
      mostrarError("No hay mas colores disponibles para agregar.");
      return;
    }

    setNewColorId(String(availableColorOptions[0]?.id || ""));
    setNewColorFiles([]);
    setShowAddColorModal(true);
  };

  const handleConfirmAddColor = () => {
    const color = availableColorOptions.find(
      (item) => Number(item.id) === Number(newColorId),
    );

    if (!color) {
      mostrarError("Debes seleccionar un color.");
      return;
    }

    if (!newColorFiles || newColorFiles.length === 0) {
      mostrarError("Debes subir al menos una imagen para el color.");
      return;
    }

    const images = newColorFiles.map((file, idx) => ({
      id: `new-${color.id}-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      isPrincipal: idx === 0,
      isNew: true,
      file,
    }));

    setEditDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        colores: [
          ...prev.colores,
          {
            id: null,
            colorId: color.id,
            color: {
              id: color.id,
              nombre: color.nombre,
              codigo_hex: color.codigo_hex,
            },
            imagenes: ensurePrincipalImage(images),
            variaciones: [],
          },
        ],
      };
    });

    setEditSelectedColorId(color.id);
    setShowAddColorModal(false);
    setNewColorId("");
    setNewColorFiles([]);
  };

  const handleOpenAddTallaModal = () => {
    if (!editSelectedColor) {
      mostrarError("Selecciona primero un color para agregar tallas.");
      return;
    }

    if (availableTallaOptionsForSelectedColor.length === 0) {
      mostrarError("Ese color ya tiene todas las tallas disponibles.");
      return;
    }

    const basePrice = editSelectedColor.variaciones?.[0]?.precio || 0;
    const baseStock = editSelectedColor.variaciones?.[0]?.stock || 10;

    setNewTallaId(String(availableTallaOptionsForSelectedColor[0]?.id || ""));
    setNewTallaPrice(String(basePrice));
    setNewTallaStock(String(baseStock));
    setShowAddTallaModal(true);
  };

  const handleConfirmAddTalla = () => {
    if (!editSelectedColor) return;

    const talla = availableTallaOptionsForSelectedColor.find(
      (item) => Number(item.id) === Number(newTallaId),
    );

    if (!talla) {
      mostrarError("Debes seleccionar una talla.");
      return;
    }

    const precio = Number(newTallaPrice);
    const stock = Number(newTallaStock);

    if (!Number.isInteger(precio) || precio <= 0) {
      mostrarError("El precio debe ser un entero mayor que cero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      mostrarError("El stock debe ser un entero mayor o igual a cero.");
      return;
    }

    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(editSelectedColor.colorId)) {
            return entry;
          }

          return {
            ...entry,
            variaciones: [
              ...entry.variaciones,
              {
                id: null,
                tallaId: talla.id,
                tallaNombre: talla.nombre,
                precio,
                stock,
              },
            ],
          };
        }),
      };
    });

    setShowAddTallaModal(false);
    setNewTallaId("");
    setNewTallaPrice("");
    setNewTallaStock("10");
  };

  const handleRemoveTalla = (colorId, tallaId) => {
    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(colorId)) return entry;
          return {
            ...entry,
            variaciones: entry.variaciones.filter(
              (variacion) => Number(variacion.tallaId) !== Number(tallaId),
            ),
          };
        }),
      };
    });
  };

  const handleVariationFieldChange = (colorId, tallaId, field, value) => {
    const numericValue = Number(value);

    setEditDraft((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        colores: prev.colores.map((entry) => {
          if (Number(entry.colorId) !== Number(colorId)) return entry;
          return {
            ...entry,
            variaciones: entry.variaciones.map((variacion) => {
              if (Number(variacion.tallaId) !== Number(tallaId)) {
                return variacion;
              }

              return {
                ...variacion,
                [field]: Number.isFinite(numericValue) ? numericValue : 0,
              };
            }),
          };
        }),
      };
    });
  };

  const validateDraft = () => {
    if (!editDraft?.nombre?.trim()) {
      mostrarError("El nombre del producto es obligatorio.");
      return false;
    }

    if (!editDraft?.descripcion?.trim()) {
      mostrarError("La descripcion del producto es obligatoria.");
      return false;
    }

    if (!editDraft?.categoriaId) {
      mostrarError("Debes seleccionar una categoria.");
      return false;
    }

    if (!editDraft?.colores?.length) {
      mostrarError("Debes dejar al menos un color en el producto.");
      return false;
    }

    for (const color of editDraft.colores) {
      if (!color.imagenes?.length) {
        mostrarError(`El color ${color.color?.nombre || ""} no tiene imagenes.`);
        return false;
      }

      if (!color.variaciones?.length) {
        mostrarError(`El color ${color.color?.nombre || ""} no tiene tallas.`);
        return false;
      }

      for (const variacion of color.variaciones) {
        if (
          !Number.isInteger(Number(variacion.precio)) ||
          Number(variacion.precio) <= 0
        ) {
          mostrarError("Cada talla debe tener un precio entero mayor que cero.");
          return false;
        }

        if (
          !Number.isInteger(Number(variacion.stock)) ||
          Number(variacion.stock) < 0
        ) {
          mostrarError("Cada talla debe tener stock entero mayor o igual a cero.");
          return false;
        }
      }
    }

    return true;
  };

  const buildUpdateInput = () => {
    return {
      nombre: editDraft.nombre.trim(),
      descripcion: editDraft.descripcion.trim(),
      categoriaId: editDraft.categoriaId,
      colores: editDraft.colores.map((color) => {
        const normalizedImages = ensurePrincipalImage(color.imagenes || []);

        return {
          id: color.id || undefined,
          colorId: color.colorId,
          imagenes: normalizedImages.map((img) =>
            img.isNew
              ? {
                  archivo: img.file,
                  isPrincipal: Boolean(img.isPrincipal),
                }
              : {
                  id: img.id,
                  isPrincipal: Boolean(img.isPrincipal),
                },
          ),
          variaciones: color.variaciones.map((variacion) => ({
            id: variacion.id || undefined,
            tallaId: variacion.tallaId,
            precio: Number(variacion.precio),
            stock: Number(variacion.stock),
          })),
        };
      }),
    };
  };

  const handleSaveEdit = async () => {
    if (!validateDraft() || !producto?.id) return;

    try {
      const input = buildUpdateInput();
      await updateProducto({
        variables: {
          id: producto.id,
          input,
        },
      });

      mostrarExito("Producto actualizado con exito.");
      handleCancelEdit();
    } catch (err) {
      console.error("Error al actualizar producto:", err);
      mostrarError("No se pudo actualizar el producto.");
    }
  };

  return {
    isEditing,
    editDraft,
    editColorEntries,
    editSelectedColor,
    hoveredColorId,
    hoveredTallaId,
    showAddColorModal,
    showAddTallaModal,
    newColorId,
    newColorFiles,
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
  };
};
