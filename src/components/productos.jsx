import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";

const Productos = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Container>
        <div className="productos_header">
          <div className="input-icon">
            <FaSearch size={18} className="icono-buscar" />
            <input type="text" placeholder="Buscar..." />
          </div>
          <Button onClick={handleShow} >
            <IoMdAdd size={22} /> Crear
          </Button>
        </div>
        <ModalCrear handleClose={handleClose} show={show} />
      </Container>

      <h1>Productos</h1>
      <p>Esta es la página de productos</p>
      <p>En esta página se mostrarán los productos disponibles en la tienda.</p>
      <p>
        Los productos estarán organizados por categorías y se podrán filtrar por
        precio, marca, etc.
      </p>
      <p>
        También se podrá ver información detallada de cada producto y agregarlo
        al carrito de compras.
      </p>
    </>
  );
};

export default Productos;
