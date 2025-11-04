import { Button, Card, Container, Form, InputGroup } from "react-bootstrap";
import { useMainStore } from "../store/useMainStore";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useMutation } from "@apollo/client";
import { MAKE_LOGIN } from "../graphql/mutations/productMutatios";
import { useNavigate } from "react-router-dom";
import { useLogindata } from "../utils/hooks/useLoginData";

const Login = () => {
  const ImagenFondo = useMainStore((state) => state.ImagenFondo);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const url = ImagenFondo || "/fondo2.jpg";
  const setLoginData = useMainStore((state) => state.setLoginData);
  const navigate = useNavigate();

  const [login] = useMutation(MAKE_LOGIN, {
    onCompleted: (data) => {
      if (data.login) {
        setLoginData(data.login);
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("user", JSON.stringify(data.login.user));
        mostrarExito("Se ha loguedo con exito");
        setEmail("");
        setPassword("");
      }
    },
    onError: (error) => {
      mostrarError(error.message);
      setLoginData(null);
    },
  });

  const { token } = useLogindata(); // accedemos al token de manera reactiva

  useEffect(() => {
    if (token) {
      navigate("/Configuraciones");
    }
  }, [token, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email) {
      mostrarError("Debes ingresar el Email");
      return;
    }

    if (!password) {
      mostrarError("Debes ingresar el Password");
      return;
    }

    const data = { email, password };

    try {
      await login({ variables: { data } });
    } catch (error) {
      throw new Error(" A ocurrido un error en el login ", error.message);
    }
  };
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container className="container-login">
          <div className="form-login">
            <h1 className="text-center">Login</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-5" controlId="loginName">
                <Form.Label>
                  <MdEmail size={20} /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese el email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-5" controlId="formPassword">
                <Form.Label>
                  <RiLockPasswordLine size={20} /> Contraseña
                </Form.Label>
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
                    {showPassword ? (
                      <FaEyeSlash style={{ color: "white" }} />
                    ) : (
                      <FaEye style={{ color: "white" }} />
                    )}
                  </Button>
                </InputGroup>
              </Form.Group>
              <div className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="login-button"
                >
                  Entrar
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Login;
