import { Container, Button } from "react-bootstrap";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import ModalCrear from "../forms/crearProducto";
import { useMainStore } from "../store/useMainStore";

const Productos = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const productos = useMainStore((state) => state.productos);

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

      <Container className="productos_container">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <div key={producto.id} className="producto_card">
              <h5>{producto.nombre}</h5>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles.</p>
        )}
      </Container>
    </>
  );
};

export default Productos;
