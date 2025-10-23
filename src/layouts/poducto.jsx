import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ producto }) => {
  // 1. Hacemos la guarda más estricta: si no hay producto o no tiene nombre, no renderizamos nada.
  if (!producto || !producto.nombre) {
    return null;
  }

  // 2. Usamos "optional chaining" (?.) para acceder de forma segura a la URL.
  // Esto soluciona el error "Cannot read properties of null (reading '0')".
  // Si `producto.imagenes` es nulo o un array vacío, `imageUrl` será `undefined`.
  const imageUrl = producto.imagenes?.[0]?.url;

  return (
    // 3. Hacemos que toda la tarjeta sea un enlace para una mejor experiencia de usuario.
    <Link to={`/detalles/${producto.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card className="h-100" style={{ width: '100%' }}> {/* Aseguramos que la tarjeta ocupe todo el div contenedor */}
        {/* 4. Renderizamos la imagen solo si existe la URL. */}
        {imageUrl ? (
          <Card.Img
            variant="top"
            src={imageUrl}
            alt={`imagen ${producto.nombre}`}
            style={{ height: '250px', objectFit: 'cover', width: '100%' }} // Estilo de ejemplo para unificar tamaño
          />
        ) : (
          // Si no hay imagen, mostramos un placeholder.
          <div className="d-flex justify-content-center align-items-center" style={{ height: '250px', backgroundColor: '#f8f9fa' }}>
            <span className="text-muted">Sin imagen</span>
          </div>
        )}
        {/* 5. La información del producto debe ir dentro de Card.Body para una estructura correcta. */}
        <Card.Body className="d-flex flex-column">
          <Card.Title className="producto-card-titulo mt-auto">{producto.nombre}</Card.Title>
          <Card.Text as="p" className="producto-card-precio">
            ${producto.precio.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;
