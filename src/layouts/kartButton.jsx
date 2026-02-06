import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const KartButton = () => {
  const [productCount, setProductCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCount = () => {
      const stored = localStorage.getItem("kartProducts");
      const parsed = stored ? JSON.parse(stored) : [];
      // Sumamos la cantidad de cada producto para obtener el total de artículos
      const totalItems = parsed.reduce((sum, item) => sum + item.cantidad, 0);
      setProductCount(totalItems);
    };

    updateCount(); // Carga inicial
    window.addEventListener("kartUpdated", updateCount); // Escucha cambios

    // Limpieza del listener cuando el componente se desmonte
    return () => window.removeEventListener("kartUpdated", updateCount);
  }, []); // El array vacío asegura que el listener se añade solo una vez

  return (
    <button
      onClick={() => navigate("/carrito")}
      className="kart-button"
    >
      <FaShoppingCart size={20} />
      {productCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "red",
            color: "#fff",
            borderRadius: "50%",
            padding: "2px 6px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {productCount}
        </span>
      )}
    </button>
  );
};

export default KartButton;
