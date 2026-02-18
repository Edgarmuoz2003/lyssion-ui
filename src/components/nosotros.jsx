import { useState } from "react";
import { Container, Row, Col, Button, Modal, Image } from "react-bootstrap";
import gerenteImg from "../assets/gerente.jpg";
import subGerenteImg from "../assets/sub-gerente.jpg";

const Nosotros = () => {
  const [showGerente, setShowGerente] = useState(false);
  const [showSubGerente, setShowSubGerente] = useState(false);

  return (
    <>
      {/* 🏙️ Banner */}
      <section className="banner-nosotros">
        <div className="overlay">
          <h1 className="banner-title"></h1>
        </div>
      </section>

      {/* 💬 Quiénes Somos */}
      <Container className="py-5 text-center">
        <h2 className="mb-3">¿Quiénes Somos?</h2>
        <p className="text-muted mx-auto" style={{ maxWidth: "850px" }}>
          En <strong>Lyssion Style</strong> somos una empresa colombiana dedicada
          al diseño, confección y distribución de prendas que combinan estilo,
          comodidad y calidad. Nuestra esencia se basa en la autenticidad y en el
          amor por los detalles, ofreciendo moda accesible y moderna para todas
          las personas.  
          <br /><br />
          Desde Medellín, trabajamos con un enfoque artesanal y profesional,
          cuidando cada proceso de confección, desde la selección de materiales
          hasta el acabado final. Nos apasiona crear ropa que refleje
          personalidad, confianza y bienestar, contribuyendo al fortalecimiento
          de la industria nacional con compromiso y excelencia.
        </p>
      </Container>

      {/* 👩‍💼 CEOS */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Nuestros CEOS</h2>
        <Row className="justify-content-center text-center">
          <Col md={4}>
            <Image
              src={gerenteImg}
              roundedCircle
              className="ceo-img mb-3"
            />
            <h5 className="mb-1">Gerente General</h5>
            <h6 className="text-muted mb-3">Yuli Muñoz</h6>
            <Button variant="outline-dark" onClick={() => setShowGerente(true)}>
              Ver Biografía
            </Button>
          </Col>
          <Col md={4}>
            <Image
              src={subGerenteImg}
              roundedCircle
              className="ceo-img mb-3"
            />
            <h5 className="mb-1">Sub-Gerente</h5>
            <h6 className="text-muted mb-3">Leicy Bader</h6>
            <Button
              variant="outline-dark"
              onClick={() => setShowSubGerente(true)}
            >
              Ver Biografía
            </Button>
          </Col>
        </Row>
      </Container>

      {/* 🕰️ Línea de tiempo */}
      <Container className="timeline py-5">
        <h2 className="text-center mb-5">Nuestra Historia</h2>
        <div className="timeline-line">
          <div className="timeline-item left">
            <h4>Misión</h4>
            <p>
              Brindar prendas cómodas, modernas y de alta calidad que inspiren
              confianza y estilo en quienes las usan.  
              En Lyssion Style promovemos el talento local, el trabajo digno y
              los procesos sostenibles, buscando impactar positivamente en cada
              paso de nuestra cadena de valor.
            </p>
          </div>
          <div className="timeline-item right">
            <h4>Visión</h4>
            <p>
              Ser una marca líder en la industria nacional de la confección,
              reconocida por su innovación, responsabilidad social y compromiso
              con la excelencia.  
              Queremos expandir la esencia de Lyssion Style a nivel nacional e
              internacional, llevando nuestra identidad y calidad a nuevos
              horizontes.
            </p>
          </div>
          <div className="timeline-item left">
            <h4>Valores</h4>
            <p>
              Nos guiamos por la pasión, el compromiso, la honestidad y el amor
              por lo que hacemos.  
              Valoramos el trabajo en equipo, el respeto por nuestros clientes y
              la búsqueda constante de innovación para ofrecer experiencias de
              moda auténticas y significativas.
            </p>
          </div>
        </div>
      </Container>

      {/* 📜 Modal Gerente */}
      <Modal show={showGerente} onHide={() => setShowGerente(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yuli Muñoz — Gerente General</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Yuli Muñoz</strong> es psicóloga de profesión y empresaria por
            vocación. Fundadora y Gerente General de <strong>Lyssion Style</strong>,
            lidera la compañía con una visión centrada en el crecimiento humano,
            la excelencia organizacional y la innovación constante.  
          </p>
          <p>
            Desde la creación de la marca en 2024, ha impulsado el desarrollo de
            procesos que integran diseño, tecnología y sostenibilidad, formando
            un equipo comprometido con la calidad y la creatividad.  
          </p>
          <p>
            Bajo su liderazgo, Lyssion Style se ha consolidado como una empresa
            que no solo fabrica prendas, sino que construye identidad y
            confianza en cada cliente.
          </p>
        </Modal.Body>
      </Modal>

      {/* 📜 Modal Sub-Gerente */}
      <Modal show={showSubGerente} onHide={() => setShowSubGerente(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Leicy Bader — Sub-Gerente y Directora de Diseño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Leicy Bader</strong> es cofundadora de <strong>Lyssion Style</strong>
            y actual Sub-Gerente de la compañía. Diseñadora con amplia experiencia
            en confección y producción textil, ha sido pieza clave en el desarrollo
            de la identidad visual y creativa de la marca.
          </p>
          <p>
            Su trayectoria comenzó liderando <em>Leyed Confecciones</em>, una
            empresa que evolucionó hasta convertirse en Lyssion Style S.A.S, 
            manteniendo siempre el compromiso con la calidad y la innovación.  
          </p>
          <p>
            Desde su rol, coordina los procesos de diseño y producción, 
            garantizando que cada prenda transmita estilo, confort y 
            autenticidad —valores que representan el corazón de nuestra marca.
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Nosotros;

