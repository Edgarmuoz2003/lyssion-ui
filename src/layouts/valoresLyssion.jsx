import { Container, Row, Col } from "react-bootstrap";
import { ShieldCheck, Truck, Award, Star } from 'react-bootstrap-icons';

const ValoresLyssion = () => {
  return (
    <section className="section-valor-home py-5 bg-light">
      <Container>
        <Row className="text-center">
          <Col md={4} className="mb-3">
            <Truck size={40} className="mb-2 text-primary" />
            <h4>Envíos a todo el país</h4>
            <p className="text-muted">Recibe tus productos en la puerta de tu casa, sin importar dónde estés.</p>
          </Col>
          <Col md={4} className="mb-3">
            <ShieldCheck size={40} className="mb-2 text-primary" />
            <h4>Pago Contraentrega</h4>
            <p className="text-muted">Tus pedidos los pagas al recibirlos en tu casa.</p>
          </Col>
          <Col md={4} className="mb-3">
            <Award size={40} className="mb-2 text-primary" />
            <h4>Calidad Garantizada</h4>
            <p className="text-muted">Prendas confeccionadas con los mejores materiales y atención al detalle.</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ValoresLyssion;