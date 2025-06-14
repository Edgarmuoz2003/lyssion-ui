import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ producto }) => {
  return (
    <>
      <Card>
        <Card.Body>
          <Link to={`/detalles/${producto.id}`}>
            <div className="imagen-producto">
              <img
                src={producto.imagenes[0]?.url}
                alt={`imagen ${producto.nombre}`}
              />
            </div>
          </Link>
        </Card.Body>
        <Card.Title className="producto-card-titulo">{producto.nombre}</Card.Title>
        <p className="producto-card-precio">${producto.precio.toLocaleString("es-CO", { minimumFractionDigits: 0 })}</p>
      </Card> 
    </>
  );
};

export default ProductCard;
