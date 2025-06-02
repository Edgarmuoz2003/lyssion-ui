import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h5 className="mb-3">Lyssion Style</h5>
            <p className="mb-0">Whatsapp: 323 562 04 64</p>
            <p className="mb-0">© 2025 Lyssion Style. Todos los derechos reservados.</p>
          </Col>
          <Col md={6} className="text-md-end mt-3 mt-md-0">
          <h5 className="mb-3">Siguenos en nuestras redes Sociales</h5>
            <a href="https://www.facebook.com/profile.php?id=61574125917799" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-4">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/lyssion_style/" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-4">
              <FaInstagram />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white me-3 fs-4">
              <FaYoutube />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
              <FaTiktok />
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
