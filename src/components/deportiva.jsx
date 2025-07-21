import { useQuery } from "@apollo/client";
import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "../layouts/poducto";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";

const Deportiva = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: {
      where: {
        categoria: {
          nombre: "Deportiva",
        },
      },
    },
  });

  const productosDeportivos = data?.productos || [];

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1 className="titulo-home-inicio">Deportiva</h1>
      <Container className="productos_container">
        <Row>
          {productosDeportivos.length > 0 ? (
            productosDeportivos.map((producto) => (
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
            <p>No hay prendas disponibles aun en la categoria deportiva.</p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Deportiva