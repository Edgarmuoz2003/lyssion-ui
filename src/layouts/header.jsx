import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useLogindata } from "../utils/useLoginData";
import { useMainStore } from "../store/useMainStore";
import { useNavigate } from "react-router-dom";
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
  navigate("/login")
}
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt="Logo"
              src="logo.png"
              width="160"
              height="50"
              className="d-inline-block align-top"
            />{" "}
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#pricing">Pricing</Nav.Link>
            {isAuthenticated && (
              <Nav.Link href="/Productos">Configuraciones</Nav.Link>
            )}
          </Nav>
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2 nav-login">
              <p className="mb-0 text-white">{user?.nombre}</p>
              <Button className="login-button-nav" onClick={handleLogout}><FiLogOut size={24} className="me-3" /> Logout</Button>
            </div>
          ) : (
            <div className="nav-login">
              <Button className="login-button-nav" onClick={handleLogin}><FiLogIn size={24} className="me-3" /> Login</Button>
            </div>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
