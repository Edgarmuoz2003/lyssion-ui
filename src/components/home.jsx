import InitialBaner from "../layouts/baneerInicio";
import { Container, Card, Row, Col, Button, Form } from "react-bootstrap";
import catPijamas from "../assets/catPijamas.jpg";
import catCasual from "../assets/catCasual.jpg";
import catDeportiva from "../assets/catDeportiva.jpg";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { GET_ULTIMOS_PRODUCTOS } from "../graphql/queries/productQueries";
import { useQuery } from "@apollo/client";
import ProductCard from "../layouts/poducto";
import { ShieldCheck, Truck, Award, Star } from 'react-bootstrap-icons';

const Home = () => {
  const { data, loading, error } = useQuery(GET_ULTIMOS_PRODUCTOS);

  if (loading) return <p>Cargando...</p>;
  if (error) {
    console.error("Error al cargar los últimos productos:", error);
    return <p>Error al cargar productos. Por favor, intenta de nuevo más tarde.</p>;
  }

  return (
    <>
      <section className="baner-home-inicio">
        <InitialBaner />
      </section>

      {/* SECCIÓN 1: PROPUESTA DE VALOR */}
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
              <h4>Pagos Seguros</h4>
              <p className="text-muted">Utilizamos las mejores plataformas para proteger tu información.</p>
            </Col>
            <Col md={4} className="mb-3">
              <Award size={40} className="mb-2 text-primary" />
              <h4>Calidad Garantizada</h4>
              <p className="text-muted">Prendas confeccionadas con los mejores materiales y atención al detalle.</p>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section-categorias-home">
        <h1 className="titulo-home-inicio">Nuestras Categorias</h1>
        <Container>
          <div className="Categorias-container-home">
            <Card className="categoria-item">
              <Link to={"/Pijamas"}>
                <img src={catPijamas} alt="categoria pijamas" />
                <h2>Pijamas</h2>
              </Link>
            </Card>
            <Card className="categoria-item">
              <Link to={"/Casual"}>
                <img src={catCasual} alt="categoria casual" />
                <h2>Casual</h2>
              </Link>
            </Card>
            <Card className="categoria-item">
              <Link to={"/Deportiva"}>
                <img src={catDeportiva} alt="categoria pijamas" />
                <h2>Deportivo</h2>
              </Link>
            </Card>
          </div>
        </Container>
      </section>

      <section className="section-lo-ultimo-home bg-light">
        <h1 className="titulo-home-inicio">Lo último</h1>
        {data?.ultimosProductos && data.ultimosProductos.length > 0 ? (
          <Marquee>
            <div style={{ display: "flex", gap: "1rem" }}>
              {data.ultimosProductos.map((producto) => (
                <div key={producto.id} style={{ minWidth: 200 }}>
                  <ProductCard producto={producto} />
                </div>
              ))}
            </div>
          </Marquee>
        ) : (
          <p style={{ textAlign: "center" }}>No hay productos nuevos para mostrar.</p>
        )}
      </section>

      {/* SECCIÓN 2: TESTIMONIOS */}
      <section className="section-testimonios-home py-5">
        <Container>
          <h1 className="titulo-home-inicio">Lo que dicen nuestras clientas</h1>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" />
                  </div>
                  <Card.Text>"¡La calidad de las pijamas es increíble! Súper cómodas y los diseños son hermosos. ¡Totalmente recomendada!"</Card.Text>
                  <Card.Footer className="bg-white border-0">- Ana Pérez</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" />
                  </div>
                  <Card.Text>"El envío fue rapidísimo y la atención al cliente de primera. La ropa casual es perfecta para el día a día."</Card.Text>
                  <Card.Footer className="bg-white border-0">- María Rodríguez</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="text-center h-100">
                <Card.Body>
                  <div className="mb-2">
                    <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" /> <Star fill="gold" />
                  </div>
                  <Card.Text>"Compré un conjunto deportivo y superó mis expectativas. La tela es de excelente calidad y muy cómoda para entrenar."</Card.Text>
                  <Card.Footer className="bg-white border-0">- Laura Gómez</Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

    </>
  );
};

export default Home;
