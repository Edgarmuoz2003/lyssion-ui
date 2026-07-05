import AlertComponent from "@/layouts/alertComponent";
import ProductCard from "@/layouts/poducto";
import PriceModeBanner from "@/layouts/priceModeBanner";
import SpinnerComponet from "@/layouts/spinnerComponent";
import { useProductosStore } from "@/utils/hooks/useProductosStore";
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Button, Col, Container, Row } from "react-bootstrap";

const Nuestros_productos = () => {
  const { productos, loading, error, refetch } = useProductosStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return productos || [];
    return (productos || []).filter((producto) =>
      (producto?.nombre || "").toLowerCase().includes(term)
    );
  }, [productos, searchTerm]);

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
        <PriceModeBanner />
        <div className="home-search-wrapper">
          <label className="home-search-label" htmlFor="home-product-search">
            ¿Qué estás buscando?
          </label>
          <div className="home-search-input-wrap">
            <FaSearch className="home-search-icon" />
            <input
              id="home-product-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej: Sudadera, pijama, deportiva..."
              className="home-search-input"
            />
          </div>
        </div>
        <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-4">
          {filteredProducts?.length ? (
            filteredProducts.map((producto) => (
              <Col key={producto.id} className="d-flex align-items-stretch">
                <ProductCard producto={producto} />
              </Col>
            ))
          ) : (
            <Col xs={12} className="text-center text-muted py-5">
              {searchTerm.trim()
                ? "No encontramos productos con ese nombre."
                : "No hay productos para mostrar."}
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default Nuestros_productos;
