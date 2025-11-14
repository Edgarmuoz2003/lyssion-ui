import { Container, Button, Spinner } from "react-bootstrap";
import { useMemo, useState } from "react";
import PedidoView from "./pedidoView";
import Select from "react-select";
import { ESTADO_OPTIONS } from "../utils/enums";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { FaTrash, FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useOrdenesStore } from "../utils/hooks/useOrdenesStore";

const filtroOptions = [
  { value: "todos", label: "Todos los estados" },
  { value: ESTADO_OPTIONS.Pendiente, label: "Pendiente" },
  { value: ESTADO_OPTIONS.Proceso, label: "En Proceso" },
  { value: ESTADO_OPTIONS.Despachado, label: "Despachado" },
];

const PedidosList = () => {
  const [show, setShow] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState(filtroOptions[0]);

  const filtroWhere = useMemo(() => {
    return filtroEstado.value === "todos"
      ? {}
      : { estado: filtroEstado.value };
  }, [filtroEstado]);

  const {
    ordenes,
    loadingOrdenes,
    errorOrdenes,
    deleteOrden: deleteOrdenMutation,
    eliminandoOrden,
    refetchOrdenes,
  } = useOrdenesStore({ where: filtroWhere });

  const ordenesOrdenadas = useMemo(() => {
    return [...ordenes].sort((a, b) => Number(b.fecha) - Number(a.fecha));
  }, [ordenes]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    try {
      await deleteOrdenMutation({ variables: { id } });
      mostrarExito("Orden eliminada correctamente.");
      refetchOrdenes();
    } catch (error) {
      mostrarError(
        "Error al eliminar la orden",
        error?.message ?? "Error desconocido"
      );
    }
  };

  const handleShow = (orden) => {
    setOrdenSeleccionada(orden);
    setShow(true);
  };

  const handleFiltroChange = (selectedOption) => {
    setFiltroEstado(selectedOption);
  };

  const formatFecha = (ms) => {
    if (!ms) return "";

    const timestamp = Number(String(ms).trim());
    if (Number.isNaN(timestamp)) return ms;

    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatNombre = (cliente) => {
    if (!cliente) return "Cliente no disponible";
    return `${cliente.nombre} ${cliente.apellido ?? ""}`.trim();
  };

  const renderEstado = (estado) => {
    let color;
    switch (estado) {
      case ESTADO_OPTIONS.Pendiente:
        color = "red";
        break;
      case ESTADO_OPTIONS.Proceso:
        color = "blue";
        break;
      case ESTADO_OPTIONS.Despachado:
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

        {loadingOrdenes && (
          <div className="text-center">
            <Spinner animation="border" /> <p>Cargando órdenes...</p>
          </div>
        )}
        {errorOrdenes && (
          <p className="text-danger">
            Error al cargar las órdenes: {errorOrdenes.message}
          </p>
        )}

        {!loadingOrdenes && !errorOrdenes && (
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
              {ordenesOrdenadas.map((orden) => (
                <tr key={orden.id} className="pedidos-list-class">
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(orden.id)}
                      disabled={eliminandoOrden}
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
      <PedidoView
        show={show}
        setShow={setShow}
        orden={ordenSeleccionada}
        onOrdenUpdated={refetchOrdenes}
      />
    </>
  );
};

export default PedidosList;
