import AlertComponent from "@/layouts/alertComponent";
import ProductCard from "@/layouts/poducto";
import SpinnerComponet from "@/layouts/spinnerComponent";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import { Button, Col, Container, Row } from "react-bootstrap";

const Nuestros_productos = () => {
  const { productos, loading, error, refetch } = useProductosStore();

  if (loading) {
    return (
      <>
        <h1 className="titulo-home-inicio">Nuestros productos</h1>
        <div className="py-5 d-flex justify-content-center">
          <SpinnerComponet />
        </div>
      </>
    );
  }

  if (error)
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar productos"
        actions={<Button onClick={() => refetch()}>Reintentar</Button>}
      >
        {error.message}
      </AlertComponent>
    );

  return (
    <>
      <h1 className="titulo-home-inicio">Nuestros productos</h1>
      <Container>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {productos?.length ? (
            productos.map((producto) => (
              <Col key={producto.id} className="d-flex align-items-stretch">
                <ProductCard producto={producto} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center text-muted py-5">
              No hay productos para mostrar.
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Nuestros_productos;
