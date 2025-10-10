import { useState } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { CREATE_TALLAS, DELETE_TALLAS } from "../graphql/mutations/productMutatios";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useMainStore } from "../store/useMainStore";
import { useTallasStore } from "../utils/useTallasStore";
import { Link } from "react-router-dom";


const Tallas = () => {
  const [nombre, setNombre_] = useState("");
  const [showForm, setShowForm] = useState(false);
  const addTallas = useMainStore((state) => state.addTalla);
  const delTalla = useMainStore((state) => state.delTalla);
  const tallas = useMainStore((state) => state.tallas);
  
  const { loading, error  }= useTallasStore();

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const [createTalla] = useMutation(CREATE_TALLAS, {
    onCompleted: (data) => {
      if (data.createTalla) {
        addTallas(data.createTalla);
        mostrarExito("Talla agregado correctamente");
        setNombre_("");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
    },
  });

  const [deleteTalla] = useMutation(DELETE_TALLAS, {
    onCompleted: (data) => {
      if (data.deleteTalla) {
        mostrarExito("Talla eliminado correctamente");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
    },
  });

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
        setShowForm(false);
    } catch (error) {
      mostrarError("Error al agregar el talla: " + error.message);
      throw new Error("Error al crear la talla: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTalla({
        variables: { id },
      });
      delTalla(id);
    } catch (error) {
      mostrarError("Error al eliminar la talla: " + error.message);
    }
  }

  if (loading) return <p>Cargando tallas...</p>;
  if (error) return <p>Error al cargar tallas: {error.message}</p>;

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
                    variant="danger" size="sm"
                    onClick={() => handleDelete(talla.id)}>
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