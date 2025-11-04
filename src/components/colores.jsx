import { useState } from "react";
import { Container, Button, Form, Card } from "react-bootstrap";
import { IoMdAdd } from "react-icons/io";
import { FaSave, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { CREATE_COLORS, DELETE_COLORS } from "../graphql/mutations/productMutatios";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useColoresStore } from "../utils/useColoresStore";
import { Link } from "react-router-dom";


const Colores = () => {
  const [codigo_hex, setCodigo_hex_] = useState("#000000");
  const [nombre, setNombre_] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { colores, loading, error, refetch } = useColoresStore();


  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const [createColor] = useMutation(CREATE_COLORS, {
    onCompleted: (data) => {
      if (data.createColor) {
        mostrarExito("Color agregado correctamente");
        setCodigo_hex_("#000000");
        setNombre_("");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
    },
  });

  const [deleteColor] = useMutation(DELETE_COLORS, {
    onCompleted: (data) => {
      if (data.deleteColor) {
        mostrarExito("Color eliminado correctamente");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos:", { codigo_hex, nombre });
    if (!codigo_hex || !nombre) {
      mostrarError("Por favor, complete todos los campos.");
      return;
    }
    try {
      await createColor({
        variables: {
          nombre,
          codigo_hex,
        },
      });
      refetch();
        setShowForm(false);
    } catch (error) {
      console.error("Error al crear color:", error);
      mostrarError("A ocurrido un error al agregar el color" );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteColor({
        variables: { id },
      });
      refetch();
    } catch (error) {
      console.error("Error al eliminar el color:", error);
      mostrarError("A ocurrido un error al eliminar el color");
    }
  }

  if (loading) return <p>Cargando colores...</p>;
  if (error) return <p>Error al cargar colores: {error.message}</p>;

  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <div className="d-flex align-items-center">
            <Link to="/Configuraciones" className="btn btn-light border me-3">
              <FaArrowLeft />
            </Link>
            <h1 className="mb-0">Gestión de Colores</h1>
          </div>
          <Button onClick={handleShowForm}>
            <IoMdAdd size={20} /> Agregar
          </Button>
        </div>
        {showForm && (
          <div className="form-colores">
            <Card className="mb-3">
              <Card.Title className="text-center">
                Agregar nuevo color
              </Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formColores">
                    <Form.Label>Seleccione el color</Form.Label>
                    <Form.Control
                      type="color"
                      value={codigo_hex}
                      onChange={(e) => setCodigo_hex_(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre del color</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el nombre del color"
                      value={nombre}
                      onChange={(e) => setNombre_(e.target.value)}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    <FaSave /> Guardar Color
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}
        <div className="colores-list"> 
          <h2 className="text-center">Lista de Colores</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Color</th>
                <th>Nombre</th>
                <th>Código Hexadecimal</th>
              </tr>
            </thead>
            <tbody>
              {colores.map((color) => (
                <tr key={color.id}>
                  <td>
                    <Button 
                    variant="danger" size="sm"
                    onClick={() => handleDelete(color.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                  <td>
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: color.codigo_hex,
                        borderRadius: "50%",
                      }}
                    ></div>
                  </td>
                  <td>{color.nombre}</td>
                  <td >{ color.codigo_hex }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default Colores;
