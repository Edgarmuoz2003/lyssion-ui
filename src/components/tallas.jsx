import { useState } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useTallasStore } from "../utils/hooks/useTallasStore";
import { Link } from "react-router-dom";
import SpinnerComponet from "../layouts/spinnerComponent";
import AlertComponent from "../layouts/alertComponent"

const Tallas = () => {
  const [nombre, setNombre_] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { tallas, loading, error, refetch, createTalla, deleteTalla } =
    useTallasStore();

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos:", { nombre });
    if (!nombre) {
      mostrarError("Por favor, complete todos los campos.");
      return;
    }
    try {
      await createTalla({
        variables: {
          nombre,
        },
      });
      mostrarExito("Talla agregada correctamente");
      setNombre_("");
      setShowForm(false);
    } catch (error) {
      console.error("Error al agregar talla" + error);
      mostrarError("A ocurrido un error al agregar la talla");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTalla({
        variables: { id },
      });
      mostrarExito("Se a eliminado la talla")
    } catch (error) {
      console.error("A ocurrido un error al eliminar la talla" + error)
      mostrarError("A ocurrido un error al eliminar la talla");
    }
  };

  if (loading) return <SpinnerComponet />;
  if (error) return <AlertComponent
    variant="danger"
    heading="Error al cargar tallas"
    actions={<Button onClick={() => refetch()}>Reintentar</Button>}
  >
    {error.message}           
  </AlertComponent>;

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <div className="d-flex align-items-center">
            <Link to="/Configuraciones" className="btn btn-light border me-3">
              <FaArrowLeft />
            </Link>
            <h1 className="mb-0">Gestión de Tallas</h1>
          </div>
          <Button onClick={handleShowForm}>
            <IoMdAdd size={20} /> Agregar
          </Button>
        </div>
        {showForm && (
          <div className="form-tallas">
            <Card className="mb-3">
              <Card.Title className="text-center">
                Agregar nueva talla
              </Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formTallas">
                    <Form.Label>talla</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la talla"
                      value={nombre}
                      onChange={(e) => setNombre_(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    <FaSave /> Guardar Talla
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
        <div className="tallas-list">
          <h2 className="text-center">Lista de Tallas</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {tallas.map((talla) => (
                <tr key={talla.id}>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(talla.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                  <td>{talla.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default Tallas;
