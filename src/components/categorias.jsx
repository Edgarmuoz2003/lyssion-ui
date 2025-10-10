import { useState } from "react";
import { useMainStore } from "../store/useMainStore";
import { useCategoriasStore } from "../utils/useCategoriasStore";
import { useMutation } from "@apollo/client";
import {
  CREATE_CATEGORIAS,
  DELETE_CATEGORIAS,
} from "../graphql/mutations/productMutatios";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { Button, Card, Container, Form } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaSave, FaTrash } from "react-icons/fa";

const Categorias = () => {
  const [nombre, setNombre] = useState("");
  const [showForm, setShowForm] = useState(false);
  const addCategoria = useMainStore((state) => state.addCategoria);
  const delCategoria = useMainStore((state) => state.delCategoria);
  const categorias = useMainStore((state) => state.categorias);
  console.log("esto lelga en categorias", categorias)

  const { loading, error } = useCategoriasStore();

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const [createCategoria] = useMutation(CREATE_CATEGORIAS, {
    onCompleted: (data) => {
      if (data.createCategoria) {
        addCategoria(data.createCategoria);
        mostrarExito("categoria agregada correctamente");
        setNombre("");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
    },
  });

  const [deleteCategoria] = useMutation(DELETE_CATEGORIAS, {
    onCompleted: (data) => {
      if (data.deleteCategoria) {
        mostrarExito("Categoria eliminado correctamente");
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
      await createCategoria({
        variables: {
          nombre,
        },
      });
      setShowForm(false);
    } catch (error) {
      mostrarError("Error al agregar el categoria: " + error.message);
      throw new Error("Error al crear la categoria: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategoria({
        variables: { id },
      });
      delCategoria(id);
    } catch (error) {
      mostrarError("Error al eliminar la categoria: " + error.message);
    }
  };

  if (loading) return <p>Cargando categeorias...</p>;
  if (error) return <p>Error al cargar categorias: {error.message}</p>;
  return (
    <>
      <Container>
        <h1 className="text-center m-5">Gestión de categorias</h1>
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
