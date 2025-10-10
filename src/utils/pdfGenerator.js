import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateOrderPDF = (orden) => {
  if (!orden) return;

  const doc = new jsPDF();

  // Título y datos básicos
  doc.setFontSize(20);
  doc.text("Orden de Pedido", 14, 22);
  doc.setFontSize(12);
  doc.text(`Orden Nro: ${orden.numeroOrden}`, 14, 32);
  doc.text(`Fecha: ${new Date(Number(orden.fecha)).toLocaleDateString()}`, 150, 32);
  doc.text(`Estado: ${orden.estado}`, 14, 40);

  // Línea separadora
  doc.line(14, 45, 196, 45);

  // Datos del cliente
  doc.setFontSize(14);
  doc.text("Datos del Cliente", 14, 55);
  doc.setFontSize(10);
  const clienteInfo = `
    Nombre: ${orden.cliente.nombre} ${orden.cliente.apellido || ""}
    Documento: ${orden.cliente.documento}
    Email: ${orden.cliente.email}
    Teléfono: ${orden.cliente.telefono}
    Dirección: ${orden.cliente.direccion}
    Ciudad: ${orden.cliente.ciudad} - ${orden.cliente.departamento}
  `;
  doc.text(clienteInfo, 14, 62);

  // Tabla de productos
  const tableColumn = ["Producto", "Cantidad", "Precio Unit.", "Total"];
  const tableRows = [];

  orden.productos.forEach((prod) => {
    const productoData = [
      `${prod.producto.nombre} Talla: ${prod.talla} Color: ${prod.color}`,
      prod.cantidad,
      `$${prod.precioUnitario.toLocaleString()}`,
      `$${(prod.precioUnitario * prod.cantidad).toLocaleString()}`,
    ];
    tableRows.push(productoData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 95,
    theme: 'striped',
    headStyles: { fillColor: [33, 37, 41] }, // Color oscuro para la cabecera
  });

  // Total del pedido
  const finalY = doc.lastAutoTable.finalY;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(
    `Total del Pedido: ${orden.total.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    })}`,
    196,
    finalY + 15,
    { align: "right" }
  );

  // Abrir el diálogo de impresión
  doc.autoPrint();
  doc.output("dataurlnewwindow");
};