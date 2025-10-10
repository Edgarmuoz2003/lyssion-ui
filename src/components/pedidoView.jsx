import { Modal, Button, Form } from "react-bootstrap";
import Select from "react-select";
import { ESTADO_OPTIONS } from "../utils/enums";
import { UPDATE_ORDEN_ESTADO } from "../graphql/mutations/productMutatios";
import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { useMainStore } from "../store/useMainStore";
import { mostrarError, mostrarExito } from "../utils/hookMensajes";
import { FaPrint, FaSave, FaTimes } from "react-icons/fa";
import { generateOrderPDF } from "../utils/pdfGenerator";

// ✅ Se mueven las opciones fuera del componente para que no se redeclaren en cada render.
//    Esto también soluciona la advertencia del linter en el `useEffect`.
const estadoOptions = [
  { value: ESTADO_OPTIONS.Pendiente, label: "Pendiente" },
  { value: ESTADO_OPTIONS.Proceso, label: "En Proceso" },
  { value: ESTADO_OPTIONS.Despachado, label: "Despachado" },
];
const PedidoView = ({ show, setShow, orden }) => {
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const updateOrdenStore = useMainStore((state) => state.updateOrden);

  const [updateOrdenEstado, { loading }] = useMutation(UPDATE_ORDEN_ESTADO, {
    onCompleted: (data) => {
      // Actualizamos el estado global en Zustand
      updateOrdenStore(data.updateOrdenEstado);
      mostrarExito("¡Estado de la orden actualizado!");
      setHasChanges(false); // Desactivamos el botón de guardar
      // Opcional: cerrar el modal tras el éxito
      handleClose();
    },
    onError: (error) => {
      mostrarError("Error al actualizar el estado", error.message);
    },
  });

  useEffect(() => {
    if (orden) {
      // Encuentra el objeto de opción que coincide con el estado actual de la orden
      const currentOption = estadoOptions.find(opt => opt.value === orden.estado);
      setSelectedEstado(currentOption);
      setHasChanges(false); // Resetea los cambios cuando la orden cambia
    }
  }, [orden]); // Ahora `estadoOptions` no es una dependencia porque es una constante externa.

  const handleClose = () => {
    setShow(false);
    setHasChanges(false); // Descarta los cambios al cerrar
  };

  const handleEstadoChange = (selectedOption) => {
    setSelectedEstado(selectedOption);
    // Comprueba si el nuevo estado es diferente al original
    if (selectedOption.value !== orden.estado) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  };

  const handleSaveChanges = () => {
    if (!hasChanges || !selectedEstado) return;

    updateOrdenEstado({
      variables: { id: orden.id, estado: selectedEstado.value },
    });
  };

  const handlePrint = () => {
    generateOrderPDF(orden);
  };

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
                  {orden.productos.map((prod) => (
                    <tr key={prod.id}>
                      <td>
                        {prod.producto.nombre} talla {prod.talla} color{" "}
                        {prod.color}
                      </td>
                      <td>{prod.cantidad}</td>
                      <td>${prod.precioUnitario.toLocaleString()}</td>
                      <td>
                        $
                        {(prod.precioUnitario * prod.cantidad).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
               <div className="d-flex justify-content-end">
                <div>
                  <h5 className="text-end me-2">Total del Pedido</h5>
                  <div className="total-display-led">
                    {orden.total.toLocaleString("es-CO", {
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
            disabled={!hasChanges || loading}
          >
            {loading ? "Guardando..." : <><FaSave /> Guardar Cambios</>}
          </Button>
         
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PedidoView;
