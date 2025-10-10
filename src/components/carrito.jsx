import { Container, Button, Table, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ValoresLyssion from "../layouts/valoresLyssion";
import { FaArrowLeft, FaTrash, FaCreditCard } from "react-icons/fa";

const Carrito = () => {
    const [productKart, setProductKart] = useState(
        JSON.parse(localStorage.getItem("kartProducts")) || []
    );
    const navigate = useNavigate();

    const fullName = (producto) => {
        return `${producto?.nombre} talla ${producto?.talla} color ${producto?.color}`;
    }

    const resetKart = () => {
        if (window.confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
            localStorage.removeItem("kartProducts");
            setProductKart([]); // Actualiza el estado para re-renderizar
            window.dispatchEvent(new Event("kartUpdated")); // Notifica a otros componentes
        }
    }

    const formatPrice = (price) => {
        return price.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    }

    const total = productKart.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

    return (
        <Container className="mt-4">
            <ValoresLyssion />
            <h1 className="m-4">Carrito de compras</h1>
            {productKart.length === 0 ? (
                <div className="text-center p-5">
                    <h2>No hay productos en el carrito</h2>
                    <Button variant="dark" onClick={() => navigate('/')}>
                        <FaArrowLeft /> Volver a la tienda
                    </Button>
                </div>
            ) : (
                <>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Producto</th>
                                <th>Precio Unitario</th>
                                <th>Cantidad</th>
                                <th>Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productKart.map((producto, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={producto.imagen} alt={producto.nombre} style={{ width: '50px', height: '60px', objectFit: 'cover', marginRight: '10px' }} />
                                            {fullName(producto)}
                                        </div>
                                    </td>
                                    <td>{formatPrice(producto.precio)}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>{formatPrice(producto.precio * producto.cantidad)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3"></td>
                                <td className="text-end"><strong>Total:</strong></td>
                                <td><strong>{formatPrice(total)}</strong></td>
                            </tr>
                        </tfoot>
                    </Table>
                    <Row className="mt-4 justify-content-end">
                        <Col md="auto">
                            <Button variant="secondary" onClick={() => navigate(-1)} className="me-2">
                                <FaArrowLeft /> Seguir comprando
                            </Button>
                            <Button variant="danger" onClick={resetKart} className="me-2">
                                <FaTrash /> Vaciar carrito
                            </Button>
                            <Button variant="dark" onClick={() => navigate('/pedido')}>
                                <FaCreditCard /> Realizar pedido
                            </Button>
                        </Col>
                    </Row>
                </>
            )}
            
        </Container>
    )
}

export default Carrito;