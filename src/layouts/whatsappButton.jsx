import { FaWhatsapp } from "react-icons/fa";

const WhatsappButton = () => {
  // 👇 Reemplaza este número con tu número de WhatsApp en formato internacional (sin el '+')
  const phoneNumber = "573235620464";
  const message = "Hola, estuve viendo la página web y me gustaron algunos productos, podrias darme mas informacion por favor";
  

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#25D366", // Color verde de WhatsApp
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        zIndex: 9998, // Un poco menos que el carrito para que no se solapen
        cursor: "pointer",
      }}
    >
      <FaWhatsapp size={30} />
    </a>
  );
};

export default WhatsappButton;