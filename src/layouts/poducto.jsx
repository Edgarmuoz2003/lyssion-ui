import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const ProductCard = ({ producto }) => {
  if (!producto?.nombre) {
    return null;
  }

  const allImages =
    producto.coloresDisponibles?.flatMap((colorEntry) =>
      colorEntry?.imagenes?.map((imagen) => ({
        ...imagen,
        isPrincipal: Boolean(imagen?.isPrincipal),
      })) || []
    ) || [];

  const principalImage =
    allImages.find((imagen) => imagen.isPrincipal) || allImages[0];

  const imageUrl = principalImage?.url;

  const variationPrices =
    producto.variaciones
      ?.map((variacion) => Number(variacion?.precio))
      .filter((precio) => Number.isFinite(precio)) || [];

  const minPrice =
    variationPrices.length > 0 ? Math.min(...variationPrices) : null;

  return (
    <Link
      to={`/detalles/${producto.id}`}
      className="product-card-link"
    >
      <Card className="h-100 product-card">
        {imageUrl ? (
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={`imagen ${producto.nombre}`}
            className="product-card-image"
          />
        ) : (
          <div className="d-flex justify-content-center align-items-center product-card-image product-card-image-empty">
            <span className="text-muted">Sin imagen</span>
          </div>
        )}

        <Card.Body className="d-flex flex-column">
          <Card.Title className="producto-card-titulo">
            {producto.nombre}
          </Card.Title>

          <Card.Text as="p" className="producto-card-precio mt-auto">
            {minPrice !== null
              ? currencyFormatter.format(minPrice)
              : "Sin precio"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
