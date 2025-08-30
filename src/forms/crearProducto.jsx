import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useState, useMemo } from "react";
import { Button, Modal, Form, Row, Col, Image } from "react-bootstrap";
import Select from "react-select";
import {
  GET_COLORS,
  GET_TALLAS,
  GET_CATEGORIAS,
  GET_PRODUCTOS,
} from "../graphql/queries/productQueries";
import { IoMdAdd } from "react-icons/io";
import { CREATE_PRODUCTS } from "../graphql/mutations/productMutatios"; // Asegúrate que el path sea correcto
import { useMainStore } from "../store/useMainStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";

const ModalCrear = ({ handleClose, show }) => {
  const [selectedImagenes, setSelectedImagenes] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState();
  const [tallaIds, setTallaIds] = useState([]);
  const [colorIds, setColoIds] = useState([]);
  const [categoriaId, setCategoriaId] = useState(null);
  const [colorsToview, setColorsToview] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTallas, setselectedTallas] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const {
    data: coloresData,
    loading: coloresLoading,
    error: coloresError,
  } = useQuery(GET_COLORS);
  const {
    data: tallasData,
    loading: tallasLoading,
    error: tallasError,
  } = useQuery(GET_TALLAS);
  const {
    data: categoriasData,
    loading: categoriasLoading,
    error: categoriasError,
  } = useQuery(GET_CATEGORIAS);

  // 1. Obtenemos la acción para REEMPLAZAR la lista de productos en Zustand.
  const setProductos = useMainStore((state) => state.setProductos);

  // 2. Preparamos una "lazy query" para poder refrescar la lista de productos cuando la necesitemos.
  const [refrescarProductos, { loading: cargandoProductos }] = useLazyQuery(
    GET_PRODUCTOS,
    {
      fetchPolicy: "network-only", // ¡MUY IMPORTANTE! No usar el caché para esto.
      onCompleted: (data) => {
        // 4. Cuando la lista se refresca, la guardamos en Zustand.
        setProductos(data.productos);
        mostrarExito("Producto creado y lista actualizada.");
        handleClose(); // Cerramos el modal solo después de que todo esté actualizado.
      },
      onError: (error) => {
        mostrarError("Producto creado, pero falló al refrescar la lista.", error.message);
        handleClose();
      },
    }
  );

  const [createProducto] = useMutation(CREATE_PRODUCTS, {
    onCompleted: (data) => {
      // 3. Cuando el producto se crea, llamamos a la query para refrescar la lista completa.
      refrescarProductos();
    },
    onError: (error) => {
      mostrarError("Error al crear el producto", error.message);
    },
  });

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedImagenes(Array.from(files));
  };

  const formateador = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handlePrecioFormat = (event) => {
    const value = event.target.value;
    setPrecio(Number(value));
  };

  const coloresOptions =
    coloresData?.colores.map((color) => ({
      value: color.id,
      label: color.nombre,
      color: color.codigo_hex,
    })) || [];

  const tallasOptions =
    tallasData?.tallas.map((talla) => ({
      value: talla.id,
      label: talla.nombre,
    })) || [];

  const categoriasOptions =
    categoriasData?.categorias.map((categoria) => ({
      value: categoria.id,
      label: categoria.nombre,
    })) || [];

  const handleTallas = (selectedOptions) => {
    setselectedTallas(selectedOptions); // <-- ahora guarda los objetos completos
    setTallaIds(selectedOptions.map((option) => option.value));
  };

  const handleCategoria = (selectedOptions) => {
    setSelectedCategoria(selectedOptions); // <-- ahora guarda los objetos completos
    setCategoriaId(selectedOptions ? selectedOptions.value : null);
  }

  const formatOptionLabel = ({ label, color }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: color,
          borderRadius: "3px",
          marginRight: "8px",
          border: "1px solid #ccc",
        }}
      ></div>
      <span>{label}</span>
    </div>
  );

  const handleAddImages = () => {
    // 4. CORRECCIÓN: Se define `newColor` antes de usarlo.
    const newColor = {
      nombre: selectedColor.label,
      codigo_hex: selectedColor.color,
    };

    setColoIds((prev) => [...prev, selectedColor.value]);
    setColorsToview((prev) => [...prev, newColor]);

    const newImages = selectedImagenes.map((file) => ({
      colorId: selectedColor.value,
      archivo: file,
    }));

    setImagenes((prev) => [...prev, ...newImages]);

    setSelectedImagenes([]);
    setSelectedColor(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const input = {
      nombre,
      descripcion,
      precio: Number(precio),
      tallaIds,
      colorIds,
      categoriaId,
      imagenes: imagenes.map((image) => ({
        colorId: image.colorId,
        archivo: image.archivo,
      })),
    };

    // 5. SIMPLIFICACIÓN: La lógica de éxito/error ya está en `useMutation`.
    createProducto({
      variables: { input },
    });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Crear producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Nombre del producto</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productDescription">
              <Form.Label>Descripción del producto</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Ingrese la descripción del producto"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="productPrice">
              <Form.Label>Precio del producto</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ingrese el precio del producto"
                value={precio}
                onChange={handlePrecioFormat}
              />
            </Form.Group>
            {precio > 0 && (
              <Form.Group className="mb-3">
                <Form.Label>{formateador.format(precio)}</Form.Label>
              </Form.Group>
            )}

            <Form.Group controlId="ColorDisponible" className="mb-3">
              <Form.Label>Imagenes por color</Form.Label>
              <Select
                options={coloresOptions}
                formatOptionLabel={formatOptionLabel}
                value={selectedColor}
                onChange={setSelectedColor}
                isLoading={coloresLoading}
                placeholder={
                  coloresLoading ? "Cargando colores..." : "Seleccione un color"
                }
                isDisabled={coloresLoading || !!coloresError}
              />
              {coloresError && (
                <div style={{ color: "red", marginTop: 5 }}>
                  Error al cargar los colores
                </div>
              )}
            </Form.Group>

            {selectedColor && (
              <>
                <Form.Group controlId="formFileMultiple" className="mb-3">
                  <Form.Label>Seleccione las Imagenes</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={handleAddImages}
                  disabled={selectedImagenes.length === 0 || !selectedColor}
                  className="mb-5"
                >
                  <IoMdAdd size={22} />
                  Añadir Imagenes
                </Button>
              </>
            )}

            {imagenes.length > 0 && (
              <>
                <div className="form_image-preview">
                  {imagenes.map((image, index) => (
                    <div key={index} className="form_image-item">
                      <img
                        src={URL.createObjectURL(image.archivo)}
                        alt={`Imagen ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
            <br />
            {colorsToview.length > 0 && (
              <>
                <p>Colores disponibles</p>
                <div className="form_color-preview">
                  {colorsToview.map((color, index) => (
                    <div
                      key={index}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          backgroundColor: color.codigo_hex,
                          borderRadius: "3px",
                          marginRight: "8px",
                          border: "1px solid #ccc",
                        }}
                      ></div>
                      <span>{color.nombre}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <br />

            <Form.Group controlId="tallaDisponible" className="mb-3">
              <Form.Label>Tallas Disponibles</Form.Label>
              <Select
                isMulti
                options={tallasOptions}
                value={selectedTallas}
                onChange={handleTallas}
                isLoading={tallasLoading}
                placeholder={
                  tallasLoading ? "Cargando tallas..." : "Seleccione las tallas"
                }
                isDisabled={tallasLoading || !!tallasError}
              />
              {tallasError && (
                <div style={{ color: "red", marginTop: 5 }}>
                  Error al cargar los tallas
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="categoriasDisponible" className="mb-3">
              <Form.Label>Categoria Disponibles</Form.Label>
              <Select
                options={categoriasOptions}
                value={selectedCategoria}
                onChange={handleCategoria}
                isLoading={categoriasLoading}
                placeholder={
                  categoriasLoading ? "Cargando categorias..." : "Seleccione las categorias"
                }
                isDisabled={categoriasLoading || !!categoriasError}
              />
              {categoriasError && (
                <div style={{ color: "red", marginTop: 5 }}>
                  Error al cargar las categorias
                </div>
              )}
            </Form.Group>
            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalCrear;
