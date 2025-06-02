import { toast } from "react-toastify";

export const mostrarExito = (mensaje) => toast.success(mensaje);
export const mostrarError = (mensaje, detalles) =>
  toast.error(
    <div>
      {mensaje}
      {detalles && (
        <details style={{ marginTop: 8 }}>
          <summary>Ver detalles</summary>
          <pre style={{ whiteSpace: "pre-wrap" }}>{detalles}</pre>
        </details>
      )}
    </div>
  );