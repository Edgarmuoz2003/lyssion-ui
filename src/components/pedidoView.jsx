import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { ESTADO_OPTIONS } from "../utils/enums";
import { useEffect, useMemo, useState } from "react";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { FaPrint, FaSave, FaTimes } from "react-icons/fa";
import { generateOrderPDF } from "../utils/pdfGenerator";
import { useOrdenesStore } from "../utils/hooks/useOrdenesStore";
import { useVariacionesProductoMap } from "../utils/hooks/useVariacionesProductoMap";
import { normalizeOrdenProductos } from "../utils/normalizeOrden";

const estadoOptions = [
  { value: ESTADO_OPTIONS.Pendiente, label: "Pendiente" },
  { value: ESTADO_OPTIONS.Proceso, label: "En Proceso" },
  { value: ESTADO_OPTIONS.Despachado, label: "Despachado" },
];

const PedidoView = ({ show, setShow, orden, onOrdenUpdated }) => {
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const { updateOrdenEstado, actualizandoOrden } = useOrdenesStore({
    skipQuery: true,
  });
  const { variacionesMap } = useVariacionesProductoMap({ skip: !show });

  useEffect(() => {
    if (orden) {
      const currentOption = estadoOptions.find(
        (opt) => opt.value === orden.estado
      );
      setSelectedEstado(currentOption ?? null);
      setHasChanges(false);
    }
  }, [orden]);

  const handleClose = () => {
    setShow(false);
    setHasChanges(false);
  };

  const handleEstadoChange = (selectedOption) => {
    setSelectedEstado(selectedOption);
    if (!orden) return;

    setHasChanges(selectedOption?.value !== orden.estado);
  };

  const handleSaveChanges = async () => {
    if (!orden || !hasChanges || !selectedEstado) return;

    try {
      await updateOrdenEstado({
        variables: { id: orden.id, estado: selectedEstado.value },
      });
      mostrarExito("¡Estado de la orden actualizado!");
      setHasChanges(false);
      onOrdenUpdated?.();
      handleClose();
    } catch (error) {
      mostrarError(
        "Error al actualizar el estado",
        error?.message ?? "Error desconocido"
      );
    }
  };

  const handlePrint = () => {
    if (orden) {
      generateOrderPDF(orden, productosNormalizados);
    }
  };

  const productosNormalizados = useMemo(() => {
    return normalizeOrdenProductos(orden, { variacionesMap });
  }, [orden, variacionesMap]);

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        className="modal-pedido"
      >
        <Modal.Header closeButton>
          <Modal.Title>Orden de pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orden ? (
            <>
              <div className="d-flex justify-content-between">
                <p>
                  <strong>Orden Nro</strong> {orden.numeroOrden}
                </p>
                <Form className="d-flex">
                  <Form.Label>Estado: </Form.Label>
                  <Select
                    options={estadoOptions}
                    value={selectedEstado}
                    onChange={handleEstadoChange}
                    placeholder="Seleccione un estado"
                  />
                </Form>

                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(Number(orden.fecha)).toLocaleDateString()}
                </p>
              </div>
              <h4>Datos del cliente</h4>
              <div className="d-flex">
                <div className="flex-column w-50 ms-3">
                  <p className="mb-1">
                    <strong>Nombre:</strong> {orden.cliente.nombre}{" "}
                    {orden.cliente.apellido}
                  </p>
                  <p className="mb-1">
                    <strong>Documento:</strong> {orden.cliente.documento}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {orden.cliente.email}
                  </p>
                </div>
                <div className="flex-column w-50 ms-3">
                  <p className="mb-1">
                    <strong>Teléfono:</strong> {orden.cliente.telefono}
                  </p>
                  <p className="mb-1">
                    <strong>Dirección:</strong> {orden.cliente.direccion}
                  </p>
                  <p className="mb-1">
                    <strong>Ciudad:</strong> {orden.cliente.ciudad}-
                    {orden.cliente.departamento}
                  </p>
                </div>
              </div>
              <br />
              <hr />
              <h4>Productos</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Cantidad</th>
                    <th>Precio unitario</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {productosNormalizados.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        {prod.nombre} talla {prod.talla} color {prod.color}
                      </td>
                      <td>{prod.cantidad}</td>
                      <td>${Number(prod.precioUnitario).toLocaleString()}</td>
                      <td>
                        $
                        {Number(prod.precioUnitario * prod.cantidad).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-end">
                <div>
                  <h5 className="text-end me-2">Total del Pedido</h5>
                  <div className="total-display-led">
                    {Number(orden.total).toLocaleString("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>No hay orden seleccionada.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handlePrint}>
            <FaPrint /> Imprimir
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            <FaTimes /> Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={!hasChanges || actualizandoOrden}
          >
            {actualizandoOrden ? (
              "Guardando..."
            ) : (
              <>
                <FaSave /> Guardar Cambios
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PedidoView;
