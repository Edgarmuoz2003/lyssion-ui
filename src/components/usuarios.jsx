import { useState } from "react";
import { Container, Button, Form, Card, InputGroup } from "react-bootstrap";
import { useMutation } from "@apollo/client";
import { IoMdAdd } from "react-icons/io";
import { FaSearch, FaEye, FaEyeSlash } from "react-icons/fa";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useMainStore } from "../store/useMainStore";
import { useUsuariosStore } from "../utils/useUsuariosStore";
import { CREATE_USUARIO, DELETE_USUARIO } from "../graphql/mutations/productMutatios";

const Usuarios = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const addUsuario = useMainStore((state) => state.addUsuario);
  const delUsuario = useMainStore((state) => state.delUsuario);
  const usuarios = useMainStore((state) => state.usuarios);

  const { loading, error } = useUsuariosStore();

  const handleShowForm = () => setShowForm(!showForm);

  const [createUsuario] = useMutation(CREATE_USUARIO, {
    onCompleted: (data) => {
      if (data.createUsuario) {
        addUsuario(data.createUsuario);
        mostrarExito("Usuario creado correctamente");
        setNombre("");
        setEmail("");
        setPassword("");
      }
    },
    onError: (error) => mostrarError(error.message),
  });

  const [deleteUsuario] = useMutation(DELETE_USUARIO, {
    onCompleted: () => mostrarExito("Usuario eliminado correctamente"),
    onError: (error) => mostrarError(error.message),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !email || !password) {
      mostrarError("Todos los campos son obligatorios.");
      return;
    }

    const input = { nombre, email, password };

    try {
      await createUsuario({ variables: { input } });
      setShowForm(false);
    } catch (error) {
      mostrarError("Error al crear usuario: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUsuario({ variables: { id } });
      delUsuario(id);
    } catch (error) {
      mostrarError("Error al eliminar usuario: " + error.message);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios: {error.message}</p>;

  return (
    <>
      <Container>
        <div className="productos_header">
          <div className="input-icon">
            <FaSearch size={18} className="icono-buscar" />
            <input type="text" placeholder="Buscar..." />
          </div>
          <Button onClick={handleShowForm}>
            <IoMdAdd size={22} /> Crear
          </Button>
        </div>

        {showForm && (
          <div className="form-usuarios">
            <Card className="mb-3">
              <Card.Title className="text-center">Crear Usuario</Card.Title>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Ingrese el email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingrese la contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                  </Form.Group>

                  <Button variant="primary" type="submit">
                    Guardar Usuario
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </div>
        )}

        <div className="usuarios-list">
          <h2 className="text-center">Lista de Usuarios</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Nombre</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(usuario.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </>
  );
};

export default Usuarios;


