import { Container, Button } from "react-bootstrap";
import { useMainStore } from "../store/useMainStore";

const PedidosList = () => {
  const ordenes = useMainStore((state) => state.ordenes);
  const handleDelete = async (id) => {
    try {
      console.log(`Funcion pendiente por implementar ${id}}`);
    } catch (error) {
      console.error(error);
    }
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
    return `${cliente.nombre} ${cliente.apellido ?? ""}`.trim();
  };

  return (
    <>
      <Container>
        <h1 className="text-center mt-5">Ordenes de pedido</h1>
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
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(orden.id)}
                  >
                    Eliminar
                  </Button>
                </td>
                <td>{formatFecha(orden.fecha)}</td>
                <td>{orden.numeroOrden}</td>
                <td>{formatNombre(orden.cliente)}</td>
                <td>{orden.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Container>
    </>
  );
};

export default PedidosList;
