import { useState } from "react";
import { useCategoriasStore } from "../utils/hooks/useCategoriasStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { Button, Card, Container, Form } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";
import SpinnerComponet from "../layouts/spinnerComponent";
import AlertComponent from "../layouts/alertComponent";
import { Link } from "react-router-dom";

const Categorias = () => {
  const [nombre, setNombre] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { categorias,loading, error, refetch, createCategoria, deleteCategoria} = useCategoriasStore();

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
      await createCategoria({
        variables: {
          nombre,
        },
      });
      mostrarExito("Categoria agregada correctamente");
      setNombre("");
      setShowForm(false);
    } catch (error) {
      console.error("Error al agregar la categoria:", error);
      mostrarError("A ocurrido un error al agregar el categoria");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoria({
        variables: { id },
      });
      mostrarExito("Categoria eliminada correctamente");
    } catch (error) {
      console.error("A ocurrido un error al eliminar la categoria: ", error);
      mostrarError("A ocurrido un error al eliminar la categoria");
    }
  };

  if (loading) return <SpinnerComponet />;
  if (error) return <AlertComponent
     variant="danger"
     heading="Error"
     actions={<Button onClick={() => refetch()}>Reintentar</Button>}
   >
     {error.message}
  </AlertComponent>
  
  return (
    
    <>
      <Container>
          <div className="d-flex align-items-center">
            <Link to="/Configuraciones" className="btn btn-light border me-3">
              <FaArrowLeft />
            </Link>
            <h1 className="mb-0">Gestión de categorias</h1>
          </div>
        <Button onClick={handleShowForm}>
          <IoMdAdd size={20} /> Agregar
        </Button>
        {showForm && (
          <div className="form-categorias">
            <Card className="mb-3">
              <Card.Title className="text-center">
                Agregar nueva categoria
              </Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formCategorias">
                    <Form.Label>categoria</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese la categoria"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    <FaSave /> Guardar Categoria
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
        <div className="categorias-list">
          <h2 className="text-center">Lista de Categorias</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                  <td>{categoria.nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default Categorias;
