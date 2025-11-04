import { Card, Col, Container, Row } from "react-bootstrap";
import { Star } from 'react-bootstrap-icons';

const Testimonios = () => {
  return (
    <>
      <section className="section-testimonios-home py-5">
        <h1 className="titulo-home-inicio">Lo que dicen nuestros clientes</h1>
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" />
                  </div>
                  <Card.Text>
                    "¡La calidad de las pijamas es increíble! Súper cómodas y
                    los diseños son hermosos. ¡Totalmente recomendada!"
                  </Card.Text>
                  <Card.Footer className="bg-white border-0">
                    - Ana Pérez
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" />
                  </div>
                  <Card.Text>
                    "El envío fue rapidísimo y la atención al cliente de
                    primera. La ropa casual es perfecta para el día a día."
                  </Card.Text>
                  <Card.Footer className="bg-white border-0">
                    - María Rodríguez
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" /> <Star fill="gold" />{" "}
                    <Star fill="gold" />
                  </div>
                  <Card.Text>
                    "Compré un conjunto deportivo y superó mis expectativas. La
                    tela es de excelente calidad y muy cómoda para entrenar."
                  </Card.Text>
                  <Card.Footer className="bg-white border-0">
                    - Laura Gómez
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Testimonios;
