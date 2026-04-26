import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaImage, FaSave, FaTrash } from "react-icons/fa";
import { mostrarError, mostrarExito } from "../../utils/hookMensajes";
import { DEFAULT_BANNERS } from "../../utils/bannerConfig";
import {
  GET_BANNERS,
  GET_BANNERS_ACTIVOS,
} from "../../graphql/queries/productQueries";
import {
  DELETE_BANNERS,
  PUBLICAR_BANNERS,
  SUBIR_BANNERS,
} from "../../graphql/mutations/productMutatios";
import SpinnerComponet from "../../layouts/spinnerComponent";
import AlertComponent from "../../layouts/alertComponent";

const MAX_SELECTION = 3;

const Banners = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmAction, setConfirmAction] = useState(null);
  const [publishMode, setPublishMode] = useState("replace");

  const { data, loading, error, refetch } = useQuery(GET_BANNERS, {
    fetchPolicy: "cache-and-network",
  });
  const { data: activeData } = useQuery(GET_BANNERS_ACTIVOS, {
    fetchPolicy: "cache-and-network",
  });

  const [subirBanners, { loading: isUploading }] = useMutation(SUBIR_BANNERS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_BANNERS }],
  });
  const [publicarBanners] = useMutation(PUBLICAR_BANNERS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_BANNERS }, { query: GET_BANNERS_ACTIVOS }],
  });
  const [deleteBanners] = useMutation(DELETE_BANNERS, {
    awaitRefetchQueries: true,
    refetchQueries: [{ query: GET_BANNERS }, { query: GET_BANNERS_ACTIVOS }],
  });

  const availableBanners = data?.banners || [];
  const activeBanners = activeData?.bannersActivos?.length
    ? activeData.bannersActivos
    : DEFAULT_BANNERS;

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
      await subirBanners({
        variables: {
          archivos: files,
        },
      });
      mostrarExito("Imágenes agregadas correctamente.");
    } catch (error) {
      console.error("Error al subir imágenes del banner", error);
      mostrarError(error.message || "No fue posible cargar las imágenes.");
    }
  };

  const handleToggleSelected = (bannerId) => {
    setSelectedIds((currentSelected) => {
      if (currentSelected.includes(bannerId)) {
        return currentSelected.filter((id) => id !== bannerId);
      }

      if (currentSelected.length >= MAX_SELECTION) {
        mostrarError("Solo puedes seleccionar hasta tres imágenes al tiempo.");
        return currentSelected;
      }

      return [...currentSelected, bannerId];
    });
  };

  const openPublishConfirmation = () => {
    if (selectedIds.length === 0) {
      mostrarError("Selecciona mínimo una imagen para publicar.");
      return;
    }

    setPublishMode("replace");
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
      await publicarBanners({
        variables: {
          ids: selectedIds,
          modo: publishMode === "append" ? "AGREGAR" : "REEMPLAZAR",
        },
      });
      setSelectedIds([]);
      setConfirmAction(null);
      mostrarExito("Banner publicado correctamente.");
    } catch (error) {
      console.error("Error al publicar banners", error);
      mostrarError(error.message || "No fue posible publicar los banners.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBanners({
        variables: {
          ids: selectedIds,
        },
      });
      setSelectedIds([]);
      setConfirmAction(null);
      mostrarExito("Imágenes borradas correctamente.");
    } catch (error) {
      console.error("Error al borrar banners", error);
      mostrarError(error.message || "No fue posible borrar los banners.");
    }
  };

  if (loading) return <SpinnerComponet />;
  if (error) {
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar banners"
        actions={<Button onClick={() => refetch()}>Reintentar</Button>}
      >
        {error.message}
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
          <h1 className="mb-0">Banner de inicio</h1>
        </div>
      </div>

      <Card className="banner-config-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
            <div>
              <h2>Subir imágenes</h2>
            <p className="banner-config-help">
              Tamaño recomendado: 1600 x 1067 px o una proporción cercana a 3:2.
            </p>
            </div>
            <Form.Group controlId="bannerUpload">
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
          {activeBanners.map((banner) => (
            <Col key={banner.id} sm={12} md={6} lg={4}>
              <div className="banner-thumb banner-thumb-current">
                <img src={banner.url} alt={banner.nombre} />
              </div>
            </Col>
          ))}
        </Row>
      </section>

      <section className="banner-config-section">
        <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-3">
          <div>
            <h2>Imágenes disponibles</h2>
            <p className="banner-config-help">
              Selecciona mínimo una imagen y máximo tres por acción.
            </p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
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
          {availableBanners.map((banner) => {
            const isSelected = selectedIds.includes(banner.id);

            return (
              <Col key={banner.id} sm={12} md={6} lg={4}>
                <button
                  type="button"
                  className={`banner-thumb banner-thumb-button ${isSelected ? "is-selected" : ""}`}
                  onClick={() => handleToggleSelected(banner.id)}
                  aria-pressed={isSelected}
                >
                  <img src={banner.url} alt={banner.nombre} />
                </button>
              </Col>
            );
          })}
        </Row>
        {availableBanners.length === 0 && (
          <div className="empty-catalog-state mt-3">
            <h3>No hay banners cargados</h3>
            <p>Sube una o varias imágenes para publicarlas en el carrusel.</p>
          </div>
        )}
      </section>

      <Modal show={confirmAction === "delete"} onHide={() => setConfirmAction(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar borrado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que deseas borrar las imágenes seleccionadas? Si están publicadas, también se quitarán del carrusel.
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
          <p>Elige cómo quieres publicar las imágenes seleccionadas.</p>
          <Form.Check
            type="radio"
            id="replaceBanners"
            name="publishMode"
            label="Reemplazar las imágenes actuales"
            checked={publishMode === "replace"}
            onChange={() => setPublishMode("replace")}
          />
          <Form.Check
            type="radio"
            id="appendBanners"
            name="publishMode"
            label="Añadirlas al carrusel actual"
            checked={publishMode === "append"}
            onChange={() => setPublishMode("append")}
          />
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

export default Banners;
