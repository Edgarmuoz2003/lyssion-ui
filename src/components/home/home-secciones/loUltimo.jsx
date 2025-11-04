import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_ULTIMOS_PRODUCTOS } from "../../../graphql/queries/productQueries";
import Marquee from "react-fast-marquee";
import ProductCard from "../../../layouts/poducto";


const Loultimo = () => {
     const [isMarqueeVisible, setIsMarqueeVisible] = useState(false);

      useEffect(() => {
    const timer = setTimeout(() => {
      setIsMarqueeVisible(true);
    }, 100); 
    return () => clearTimeout(timer); 
  }, []);

  const { data, loading, error } = useQuery(GET_ULTIMOS_PRODUCTOS, {
    fetchPolicy: "network-only",
  });

  
  if (loading) return <p>Cargando...</p>;
  if (error) {
    console.error("Error al cargar los últimos productos:", error);
    return <p>Error al cargar productos. Por favor, intenta de nuevo más tarde.</p>;
  }
  return (
    <>
      <section className="section-lo-ultimo-home bg-light">
        <h1 className="titulo-home-inicio">Lo último</h1>
        {data?.ultimosProductos && data.ultimosProductos.length > 0 ? (
          <div
            style={{
              opacity: isMarqueeVisible ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          >
            <Marquee>
              <div style={{ display: "flex", gap: "1rem" }}>
                {data.ultimosProductos.map((producto) => (
                  // 3. Aseguramos un tamaño mínimo consistente para cada item.
                  <div
                    key={producto.id} 
                    style={{ width: "250px", padding: "0 10px" }} /* Aumentamos el ancho */
                  >
                    <ProductCard producto={producto} />
                  </div>
                ))}
              </div>
            </Marquee>
          </div>
        ) : (
          <p style={{ textAlign: "center" }}>
            No hay productos nuevos para mostrar.
          </p>
        )}
      </section>
    </>
  );
};

export default Loultimo;
