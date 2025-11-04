import { useMainStore } from "@/store/useMainStore";
import ProductCard from "@/layouts/poducto";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Aumentamos el mínimo para tener máx. 5 columnas */
  gap: 24px;
  padding: 20px 0;
  justify-items: center;
`;

const ProductWrapper = styled.div`
  width: 100%; /* Permitimos que la cuadrícula controle el ancho */
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05); /* efecto al pasar el mouse */
  }
`;

const Nuestros_productos = () => {
  const productos = useMainStore((state) => state.productos);
  return (
    <>
      <h1 className="titulo-home-inicio">Nuestros productos</h1>
      <Container>
         {productos.map((producto) => (
           <ProductWrapper key={producto.id}>
            <ProductCard producto={producto} />
          </ProductWrapper>
         
        ))}
      </Container>
    </>
  );
};

export default Nuestros_productos;
