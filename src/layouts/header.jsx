import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useLogindata } from "../utils/hooks/useLoginData";
import { useMainStore } from "../store/useMainStore";
import { NavLink, useNavigate } from "react-router-dom";
import { FiLogIn, FiLogOut } from "react-icons/fi";


const Header = () => {
  const { isAuthenticated, user } = useLogindata();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useMainStore.getState().setLoginData({ user: null, token: null });
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <Navbar className="main-navbar" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand as={NavLink} to="/" className="main-brand">
            <img
              alt="Logo"
              src="/logo.png"
              width="160"
              height="50"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto main-nav-links">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/Pijamas">
                Pijamas
              </Nav.Link>
              <Nav.Link as={NavLink} to="/Casual">
                Casual
              </Nav.Link>
              <Nav.Link as={NavLink} to="/Deportiva">
                Deportiva
              </Nav.Link>
              <Nav.Link as={NavLink} to="/Nosotros">
                Nosotros
              </Nav.Link>
              {isAuthenticated && (
                <Nav.Link as={NavLink} to="/Configuraciones">
                  Configuraciones
                </Nav.Link>
              )}
            </Nav>
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-2 nav-login">
                <p className="mb-0 nav-user-name">{user?.nombre}</p>
                <Button className="login-button-nav" onClick={handleLogout}>
                  <FiLogOut size={24} className="me-3" /> Logout
                </Button>
              </div>
            ) : (
              <div className="nav-login">
                <Button className="login-button-nav" onClick={handleLogin}>
                  <FiLogIn size={24} className="me-3" /> Login
                </Button>
              </div>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
