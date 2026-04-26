import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaImage, FaSave, FaTrash } from "react-icons/fa";
import { mostrarError, mostrarExito } from "../../utils/hookMensajes";
import {
  GET_CATEGORIAS,
  GET_CATEGORIA_MENU_IMAGENES,
  GET_CATEGORIA_MENU_IMAGENES_ACTIVAS,
} from "../../graphql/queries/productQueries";
import {
  DELETE_CATEGORIA_MENU_IMAGENES,
  PUBLICAR_CATEGORIA_MENU_IMAGEN,
  SUBIR_CATEGORIA_MENU_IMAGENES,
} from "../../graphql/mutations/productMutatios";
import SpinnerComponet from "../../layouts/spinnerComponent";
import AlertComponent from "../../layouts/alertComponent";
import { getDefaultCategoryMenuImage } from "../../utils/categoryMenuConfig";

const ImagenesCategorias = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  const {
    data: categoriesData,
    loading: loadingCategories,
    error: categoriesError,
    refetch: refetchCategories,
  } = useQuery(GET_CATEGORIAS, {
    fetchPolicy: "cache-and-network",
  });
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(GET_CATEGORIA_MENU_IMAGENES, {
    fetchPolicy: "cache-and-network",
  });
  const { data: activeData } = useQuery(GET_CATEGORIA_MENU_IMAGENES_ACTIVAS, {
    fetchPolicy: "cache-and-network",
  });

  const [subirImagenes, { loading: isUploading }] = useMutation(
    SUBIR_CATEGORIA_MENU_IMAGENES,
    {
      awaitRefetchQueries: true,
      refetchQueries: [{ query: GET_CATEGORIA_MENU_IMAGENES }],
    }
  );
  const [publicarImagen] = useMutation(PUBLICAR_CATEGORIA_MENU_IMAGEN, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_CATEGORIA_MENU_IMAGENES },
      { query: GET_CATEGORIA_MENU_IMAGENES_ACTIVAS },
    ],
  });
  const [deleteImagenes] = useMutation(DELETE_CATEGORIA_MENU_IMAGENES, {
    awaitRefetchQueries: true,
    refetchQueries: [
      { query: GET_CATEGORIA_MENU_IMAGENES },
      { query: GET_CATEGORIA_MENU_IMAGENES_ACTIVAS },
    ],
  });

  const categories = categoriesData?.categorias || [];
  const availableImages = data?.categoriaMenuImagenes || [];
  const activeImagesByCategoryId = new Map(
    (activeData?.categoriaMenuImagenesActivas || []).map((image) => [
      String(image.categoriaId),
      image,
    ])
  );

  const handleFilesChange = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      mostrarError("Solo se pueden subir archivos de imagen.");
      return;
    }

    try {
      await subirImagenes({
        variables: {
          archivos: files,
        },
      });
      mostrarExito("Imágenes agregadas correctamente.");
    } catch (error) {
      console.error("Error al subir imágenes de categorías", error);
      mostrarError(error.message || "No fue posible cargar las imágenes.");
    }
  };

  const handleToggleSelected = (imageId) => {
    setSelectedIds((currentSelected) => {
      if (currentSelected.includes(imageId)) {
        return currentSelected.filter((id) => id !== imageId);
      }

      return [...currentSelected, imageId];
    });
  };

  const openPublishConfirmation = () => {
    if (!selectedCategoryId) {
      mostrarError("Selecciona la categoría que vas a actualizar.");
      return;
    }

    if (selectedIds.length !== 1) {
      mostrarError("Selecciona una sola imagen para publicar en la categoría.");
      return;
    }

    setConfirmAction("publish");
  };

  const openDeleteConfirmation = () => {
    if (selectedIds.length === 0) {
      mostrarError("Selecciona mínimo una imagen para borrar.");
      return;
    }

    setConfirmAction("delete");
  };

  const handleConfirmPublish = async () => {
    try {
      await publicarImagen({
        variables: {
          categoriaId: selectedCategoryId,
          imagenId: selectedIds[0],
        },
      });
      setSelectedIds([]);
      setConfirmAction(null);
      mostrarExito("Imagen publicada correctamente.");
    } catch (error) {
      console.error("Error al publicar imagen de categoría", error);
      mostrarError(error.message || "No fue posible publicar la imagen.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteImagenes({
        variables: {
          ids: selectedIds,
        },
      });
      setSelectedIds([]);
      setConfirmAction(null);
      mostrarExito("Imágenes borradas correctamente.");
    } catch (error) {
      console.error("Error al borrar imágenes de categorías", error);
      mostrarError(error.message || "No fue posible borrar las imágenes.");
    }
  };

  if (loading || loadingCategories) return <SpinnerComponet />;

  if (error || categoriesError) {
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar imágenes de categorías"
        actions={
          <Button
            onClick={() => {
              refetch();
              refetchCategories();
            }}
          >
            Reintentar
          </Button>
        }
      >
        {error?.message || categoriesError?.message}
      </AlertComponent>
    );
  }

  return (
    <Container className="banner-config-page">
      <div className="d-flex justify-content-between align-items-center mt-5 mb-4 gap-3 flex-wrap">
        <div className="d-flex align-items-center">
          <Link to="/Configuraciones" className="btn btn-light border me-3">
            <FaArrowLeft />
          </Link>
          <h1 className="mb-0">Imágenes de categorías</h1>
        </div>
      </div>

      <Card className="banner-config-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div>
              <h2>Subir imágenes</h2>
              <p className="banner-config-help">
                Tamaño recomendado: 1000 x 1333 px o una proporción cercana a 3:4.
              </p>
            </div>
            <Form.Group controlId="categoryMenuUpload">
              <Form.Label className="btn btn-primary mb-0">
                <FaImage className="me-2" />
                {isUploading ? "Cargando..." : "Subir imágenes"}
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                className="d-none"
                onChange={handleFilesChange}
                disabled={isUploading}
              />
            </Form.Group>
          </div>
        </Card.Body>
      </Card>

      <section className="banner-config-section">
        <h2>Actual</h2>
        <Row className="g-3">
          {categories.map((category) => {
            const activeImage = activeImagesByCategoryId.get(String(category.id));
            const defaultImage = getDefaultCategoryMenuImage(category.nombre);
            const imageUrl = activeImage?.url || defaultImage;

            return (
              <Col key={category.id} sm={12} md={6} lg={4}>
                <div className="category-menu-current">
                  <div className="category-menu-thumb banner-thumb-current">
                    {imageUrl ? (
                      <img src={imageUrl} alt={category.nombre} />
                    ) : (
                      <span>Sin imagen</span>
                    )}
                  </div>
                  <h3>{category.nombre}</h3>
                </div>
              </Col>
            );
          })}
        </Row>
      </section>

      <section className="banner-config-section">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div>
            <h2>Imágenes disponibles</h2>
            <p className="banner-config-help">
              Selecciona una imagen, elige la categoría y publícala.
            </p>
          </div>
          <div className="category-publish-controls">
            <Form.Select
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
              aria-label="Seleccionar categoría"
            >
              <option value="">Selecciona categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nombre}
                </option>
              ))}
            </Form.Select>
            <Button variant="primary" onClick={openPublishConfirmation}>
              <FaSave className="me-2" />
              Publicar
            </Button>
            <Button variant="danger" onClick={openDeleteConfirmation}>
              <FaTrash className="me-2" />
              Borrar
            </Button>
          </div>
        </div>

        <Row className="g-3">
          {availableImages.map((image) => {
            const isSelected = selectedIds.includes(image.id);

            return (
              <Col key={image.id} sm={12} md={6} lg={3}>
                <button
                  type="button"
                  className={`category-menu-thumb category-menu-thumb-button ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleToggleSelected(image.id)}
                  aria-pressed={isSelected}
                >
                  <img src={image.url} alt={image.nombre} />
                </button>
              </Col>
            );
          })}
        </Row>
        {availableImages.length === 0 && (
          <div className="empty-catalog-state mt-3">
            <h3>No hay imágenes cargadas</h3>
            <p>Sube una o varias imágenes para asignarlas al menú de categorías.</p>
          </div>
        )}
      </section>

      <Modal show={confirmAction === "delete"} onHide={() => setConfirmAction(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas borrar las imágenes seleccionadas? Si alguna está publicada,
          la categoría volverá a usar su imagen base.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmAction(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Borrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={confirmAction === "publish"} onHide={() => setConfirmAction(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar publicación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          La imagen seleccionada reemplazará la imagen actual de la categoría elegida.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmAction(null)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmPublish}>
            Publicar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ImagenesCategorias;
