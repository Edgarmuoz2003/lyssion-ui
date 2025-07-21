import { useQuery } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../layouts/poducto";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";

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

  const Pijamas = data?.productos || [];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1 className="titulo-home-inicio">Pijamas</h1>
      <Container className="productos_container">
        <Row>
          {Pijamas.length > 0 ? (
            Pijamas.map((producto) => (
              <Col
                key={producto.id}
                sm={12}
                md={6}
                lg={4}
                xl={3}
                className="mt-5"
              >
                <ProductCard producto={producto} />
              </Col>
            ))
          ) : (
            <p>No hay pijamas disponibles.</p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Pijamas;
