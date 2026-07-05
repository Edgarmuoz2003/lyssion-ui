import { useQuery } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard from "../layouts/poducto";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";
import PriceModeBanner from "../layouts/priceModeBanner";

const Pijamas = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: {
      where: {
        categoria: {
          nombre: "Pijamas",
        },
      },
    },
  });

  const pijamas = data?.productos || [];

  if (loading) return <p className="catalog-feedback">Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <section className="catalog-section">
      <h1 className="titulo-home-inicio">Pijamas</h1>
      <Container className="productos_container">
        <PriceModeBanner />
        <Row className="g-4 pb-5">
          {pijamas.length > 0 ? (
            pijamas.map((producto) => (
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
                <h3>Aun no hay pijamas disponibles</h3>
                <p>Estamos preparando nuevos productos para esta categoría.</p>
                <Link to="/" className="primary-outline-link">
                  Ver categorías
                </Link>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </section>
  );
};

export default Pijamas;
