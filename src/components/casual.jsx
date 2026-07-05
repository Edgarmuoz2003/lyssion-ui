import { useQuery } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "../layouts/poducto";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";
import PriceModeBanner from "../layouts/priceModeBanner";

const Casual = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: {
      where: {
        categoria: {
          nombre: "Casual",
        },
      },
    },
  });

  const prendasCasual = data?.productos || [];

  if (loading) return <p className="catalog-feedback">Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="catalog-section">
      <h1 className="titulo-home-inicio">Casual</h1>
      <Container className="productos_container">
        <PriceModeBanner />
        <Row className="g-4 pb-5">
          {prendasCasual.length > 0 ? (
            prendasCasual.map((producto) => (
              <Col
                key={producto.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="d-flex align-items-stretch"
              >
                <ProductCard producto={producto} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="empty-catalog-state">
                <h3>Aun no hay prendas casual disponibles</h3>
                <p>Muy pronto tendrás nuevas referencias para esta línea.</p>
                <Link to="/" className="primary-outline-link">
                  Volver al inicio
                </Link>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Casual;
