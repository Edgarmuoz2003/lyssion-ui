import { Navigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { GET_PRODUCTOS } from "../graphql/queries/productQueries";
import {
  FaHandPaper,
  FaBan,
  FaTshirt,
  FaTemperatureLow,
  FaWater,
  FaSoap,
  FaRegSnowflake,
} from "react-icons/fa";
import { MdIron } from "react-icons/md";
import { BsCircleFill } from "react-icons/bs";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { useNavigate } from "react-router-dom";
import { useLogindata } from "../utils/useLoginData";
import { DELETE_PRODUCTS } from "../graphql/mutations/productMutatios";
import { useMainStore } from "../store/useMainStore";

const Detalle = () => {
  const { id } = useParams();
  const { isAuthenticated } = useLogindata();
  const { delProducto } = useMainStore();

  // Estados para manejar el color y la imagen seleccionados
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTalla, setSelectedTalla] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [productsOnKart, setProductsOnKart] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const navigate = useNavigate();

  // Carga de datos del producto con Apollo Client
  const { data, loading, error } = useQuery(GET_PRODUCTOS, {
    variables: {
      where: { id: parseInt(id, 10) }, // Aseguramos que el ID sea un número
    },
    fetchPolicy: "cache-and-network", 
  });

  const [deleteProduct] = useMutation(DELETE_PRODUCTS, { 
    onCompleted: () => {
      mostrarExito("Producto eliminado con éxito");
      navigate("/Configuraciones");
    },
    onError: (error) => {
      mostrarError("Error al eliminar el producto");
      console.error(error);
    },
  });

  // Extraemos el producto del array que devuelve la query
  const producto = data?.productos?.[0];

  // Efecto para inicializar el estado cuando los datos del producto se cargan
  useEffect(() => {
    if (producto && producto.colores?.length > 0) {
      // Seleccionamos el primer color por defecto
      const initialColor = producto.colores[0];
      setSelectedColor(initialColor);

      // Buscamos la primera imagen que corresponda a ese color
      const initialImage = producto.imagenes?.find(
        (img) => img.color?.id === initialColor.id
      );
      setMainImage(initialImage);
    }
  }, [producto]);

  useEffect(() => {
    if (localStorage.getItem("kartProducts")) {
      try {
        const products = JSON.parse(localStorage.getItem("kartProducts"));
        if (Array.isArray(products) && products.length > 0) {
          setProductsOnKart(true);
        }
      } catch (e) {
        console.error(
          "Error al parsear los productos del carrito desde localStorage",
          e
        );
        setProductsOnKart(false);
      }
    }
  }, []);

  // Manejador para cambiar de color y actualizar las imágenes
  const handleColorClick = (color) => {
    setSelectedColor(color);
    const newMainImage = producto.imagenes?.find(
      (img) => img.color?.id === color.id
    );
    setMainImage(newMainImage);
  };

  const handleTallaClick = (talla) => {
    setSelectedTalla(talla);
  };

  const handleCantidadChange = (event) => {
    setCantidad(event.target.value);
  };

  const handleDelete = (productoId) => {
    deleteProduct({ variables: { id: productoId } });
    delProducto(productoId);
  };

  const validateInputs = () => {
    if (!selectedColor) {
      mostrarError("Debes seleccionar un color");
      return false;
    }
    if (!selectedTalla) {
      mostrarError("Debes seleccionar una talla");
      return false;
    }
    if (cantidad <= 0) {
      mostrarError("La cantidad debe ser al menos 1");
      return false;
    }
    return true;
  };

  const handleKartClick = () => {
    if (!validateInputs()) return;

    const kartData = localStorage.getItem("kartProducts");
    const existingProducts = kartData ? JSON.parse(kartData) : [];

    const newProduct = {
      id: producto?.id,
      nombre: producto?.nombre,
      precio: producto?.precio,
      color: selectedColor?.nombre,
      talla: selectedTalla?.nombre,
      imagen: mainImage?.url,
      cantidad: parseInt(cantidad, 10),
    };

    // Verificamos si el producto ya existe (por nombre, talla y color)
    const existingIndex = existingProducts.findIndex(
      (p) =>
        p.nombre === newProduct.nombre &&
        p.color === newProduct.color &&
        p.talla === newProduct.talla
    );

    if (existingIndex !== -1) {
      // Si ya existe, sumamos la cantidad
      existingProducts[existingIndex].cantidad += newProduct.cantidad;
    } else {
      // Si no existe, lo agregamos
      existingProducts.push(newProduct);
    }

    localStorage.setItem("kartProducts", JSON.stringify(existingProducts));
    setProductsOnKart(true);
    window.dispatchEvent(new Event("kartUpdated")); // Notifica al botón del carrito
    mostrarExito("Producto añadido al carrito con éxito");
  };

  // Renderizado de estados de carga y error
  if (loading) {
    return (
      <Container className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error)
    return (
      <p className="text-center text-danger mt-5">Error: {error.message}</p>
    );
  if (!producto)
    return <p className="text-center mt-5">Producto no encontrado.</p>;

  // Filtramos las miniaturas según el color seleccionado
  const thumbnails =
    producto.imagenes?.filter(
      (img) => selectedColor && img.color?.id === selectedColor.id
    ) || [];

  return (
    <Container className="mt-4">
      <p className="text-muted breadcrumb-text">
        {producto.categoria?.nombre} / {producto.nombre}
      </p>
      <Row className="mt-3">
        {/* Columna de Miniaturas */}
        <Col md={1} className="d-flex flex-md-column align-items-center gap-2">
          {thumbnails.map((img) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Thumbnail ${img.color.nombre}`}
              className="img-fluid detail-thumbnail"
              style={{
                cursor: "pointer",
                border:
                  mainImage?.id === img.id
                    ? "2px solid black"
                    : "2px solid #eee",
                width: "80px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
              onClick={() => setMainImage(img)}
            />
          ))}
        </Col>

        {/* Columna de Imagen Principal */}
        <Col md={6}>
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={`${producto.nombre} - ${selectedColor?.nombre}`}
              className="img-fluid detail-main-image"
            />
          ) : (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: "100%",
                minHeight: "400px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <span className="text-muted">No hay imagen para este color</span>
            </div>
          )}

          {isAuthenticated && (
            <Button onClick={() => handleDelete(producto.id)} className="mt-3">
              Eliminar
            </Button>
          )}
        </Col>

        {/* Columna de Información del Producto */}
        <Col md={5}>
          <h2>{producto.nombre}</h2>
          <p className="text-muted">{producto.descripcion}</p>

          <h3 className="price my-3">
            {producto.precio.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </h3>

          <hr />

          {/* Colores disponibles */}
          <div className="mb-3">
            <p>
              <strong>Color:</strong> {selectedColor?.nombre}
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {producto.colores.map((color) => (
                <BsCircleFill
                  key={color.id}
                  className="color-swatch"
                  style={{
                    color: color.codigo_hex,
                    outline:
                      selectedColor?.id === color.id
                        ? `2px solid black`
                        : `1px solid ${
                            color.codigo_hex === "#FFFFFF"
                              ? "#ccc"
                              : "transparent"
                          }`,
                    outlineOffset: "2px",
                  }}
                  onClick={() => handleColorClick(color)}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>

          <hr />

          {/* Tallas disponibles */}
          <div className="mb-3">
            <p>
              <strong>Tallas disponibles:</strong>
            </p>
            <div className="d-flex gap-2 flex-wrap">
              {producto.tallas.map((talla) => (
                <span
                  key={talla.id}
                  className="talla-badge"
                  style={{
                    padding: "0.5rem 1rem",
                    border:
                      selectedTalla?.id === talla.id
                        ? "2px solid black"
                        : "1px solid #eee",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTallaClick(talla)}
                >
                  {talla.nombre}
                </span>
              ))}
            </div>
          </div>

          <hr />

          {/* Cantidad */}
          <div>
            <p>
              <strong>Cantidad:</strong>
            </p>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={handleCantidadChange}
              style={{ width: "50px" }}
            />
          </div>

          {/* Recomendaciones de cuidado */}
          <div>
            <p>
              <strong>Recomendaciones de cuidado:</strong>
            </p>
            <div className="d-flex justify-content-around flex-wrap gap-3">
              <div className="text-center cuidado-item">
                <FaHandPaper size={30} />
                <p className="cuidado-texto">Lavar a mano</p>
              </div>
              <div className="text-center cuidado-item">
                <FaBan size={30} />
                <p className="cuidado-texto">No usar cloro</p>
              </div>
              <div className="text-center cuidado-item">
                <FaTshirt size={30} />
                <p className="cuidado-texto">No secadora</p>
              </div>
              <div className="text-center cuidado-item">
                <FaTemperatureLow size={30} />
                <p className="cuidado-texto">Agua fría</p>
              </div>
              <div className="text-center cuidado-item">
                <MdIron size={30} />
                <p className="cuidado-texto">Plancha tibia</p>
              </div>
              <div className="text-center cuidado-item">
                <FaWater size={30} />
                <p className="cuidado-texto">No remojar</p>
              </div>
              <div className="text-center cuidado-item">
                <FaSoap size={30} />
                <p className="cuidado-texto">Jabón suave</p>
              </div>
              <div className="text-center cuidado-item">
                <FaRegSnowflake size={30} />
                <p className="cuidado-texto">Secar a la sombra</p>
              </div>
            </div>
          </div>

          <hr />

          {/* Botón añadir al carrito */}
          <div className="d-grid gap-2 mt-4">
            <Button variant="dark" size="lg" onClick={handleKartClick}>
              🛒 Añadir al carrito
            </Button>
          </div>
          <div className="d-grid gap-2 mt-4">
            {productsOnKart && (
              <Button onClick={() => navigate(-1)}>Seguir Comprando</Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Detalle;
