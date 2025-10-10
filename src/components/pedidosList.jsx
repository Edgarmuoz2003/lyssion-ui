import { Container, Button, Form, Spinner } from "react-bootstrap";
import { useMainStore } from "../store/useMainStore";
import { useState, useEffect } from "react";
import PedidoView from "./pedidoView";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ORDENES } from "../graphql/queries/productQueries";
import { DELETE_ORDEN } from "../graphql/mutations/productMutatios";
import Select from "react-select";
import { ESTADO_OPTIONS } from "../utils/enums";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

// Opciones para el filtro, incluyendo "Todos"
const filtroOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: ESTADO_OPTIONS.Pendiente, label: "Pendiente" },
  { value: ESTADO_OPTIONS.Proceso, label: "En Proceso" },
  { value: ESTADO_OPTIONS.Despachado, label: "Despachado" },
];

const PedidosList = () => {
  const ordenes = useMainStore((state) => state.ordenes);
  const setOrdenes = useMainStore((state) => state.setOrdenes);
  const delOrden = useMainStore((state) => state.delOrden);
  const [show, setShow] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(filtroOptions[0]); // Inicia con "Todos"

  const { loading, error } = useQuery(GET_ORDENES, {
    variables: {
      where: filtroEstado.value === "todos" ? {} : { estado: filtroEstado.value },
    },
    onCompleted: (data) => setOrdenes(data.ordenes),
    fetchPolicy: "network-only", // Asegura que siempre se obtengan los datos más recientes
  });

  const [deleteOrdenMutation, { loading: deleting }] = useMutation(DELETE_ORDEN, {
    onCompleted: () => {
      mostrarExito("Orden eliminada correctamente.");
    },
    onError: (error) => {
      mostrarError("Error al eliminar la orden", error.message);
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.")) {
      await deleteOrdenMutation({ variables: { id } });
      // Actualizamos el estado de Zustand localmente para una respuesta visual inmediata.
      delOrden(id);
    }
  };

  const handleShow = (orden) => {
    setOrdenSeleccionada(orden);
    setShow(!show);
  };

  const handleFiltroChange = (selectedOption) => {
    setFiltroEstado(selectedOption);
  };

  const formatFecha = (ms) => {
    if (!ms) return "";

    const timestamp = Number(String(ms).trim()); // 🔹 fuerza a número limpio
    if (isNaN(timestamp)) return ms; // si no se pudo convertir, muestro tal cual

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatNombre = (cliente) => {
    // ✅ Añadimos una guarda para evitar el error si el cliente es nulo o indefinido.
    if (!cliente) return "Cliente no disponible";

    return `${cliente.nombre} ${cliente.apellido ?? ""}`.trim();
  };

  const renderEstado = (estado) => {
    let color;
    switch (estado) {
      case "pendiente":
        color = "red";
        break;
      case "En proceso":
        color = "blue";
        break;
      case "Despachado":
        color = "green";
        break;
      default:
        color = "black";
    }
    return <span style={{ color, fontWeight: "bold" }}>{estado}</span>;
  };
  return (
    <>
      <Container>
        <div className="d-flex justify-content-between align-items-center mt-5 mb-4">
          <div className="d-flex align-items-center">
            <Link to="/Configuraciones" className="btn btn-light border me-3">
              <FaArrowLeft />
            </Link>
            <h1 className="mb-0">Ordenes de pedido</h1>
          </div>
          <div style={{ width: "250px" }}>
            <Select
              options={filtroOptions}
              value={filtroEstado}
              onChange={handleFiltroChange}
              placeholder="Filtrar por estado..."
            />
          </div>
        </div>

        {loading && (
          <div className="text-center">
            <Spinner animation="border" /> <p>Cargando órdenes...</p>
          </div>
        )}
        {error && <p className="text-danger">Error al cargar las órdenes: {error.message}</p>}

        {!loading && !error && (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Fecha</th>
                <th>Orden Numero</th>
                <th>Cliente</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes
                .slice() // Creamos una copia para no mutar el estado original
                .sort((a, b) => Number(b.fecha) - Number(a.fecha)) // Ordenamos por fecha descendente
                .map((orden) => (
                <tr key={orden.id} className="pedidos-list-class">
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(orden.id)}
                      disabled={deleting}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                  <td>{formatFecha(orden.fecha)}</td>
                  <td
                    onClick={() => handleShow(orden)}
                    className="pedidos-number-class"
                  >
                    {orden.numeroOrden}
                  </td>
                  <td>{formatNombre(orden.cliente)}</td>
                  <td>{renderEstado(orden.estado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Container>
      <PedidoView show={show} setShow={setShow} orden={ordenSeleccionada} />
    </>
  );
};

export default PedidosList;
