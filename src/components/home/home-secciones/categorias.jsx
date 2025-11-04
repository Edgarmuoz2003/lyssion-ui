import catPijamas from "@/assets/catPijamas.jpg";
import catCasual from "@/assets/catCasual.jpg";
import catDeportiva from "@/assets/catDeportiva.jpg";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import styled from "styled-components";

const categoriesData = [
  { name: "Pijamas", path: "/Pijamas", image: catPijamas, alt: "categoria pijamas" },
  { name: "Casual", path: "/Casual", image: catCasual, alt: "categoria casual" },
  { name: "Deportivo", path: "/Deportiva", image: catDeportiva, alt: "categoria deportiva" },
];

const Section = styled.section`
  padding: 40px 0;
  background-color: #f8f9fa;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryTitle = styled.h2`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
  margin: 0;
  transition: opacity 0.3s ease;
  text-align: center;
  width: 100%;

  /* Por defecto, el título es visible (para móviles/tablets) */
  opacity: 1;
  
  /* En pantallas de escritorio, ocultamos el título para mostrarlo en hover */
  @media (min-width: 992px) {
    opacity: 0;
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease, filter 0.3s ease;
`;

const CategoryCard = styled(Link)`
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  aspect-ratio: 3 / 4;

  /* En escritorio, aplicamos efectos de hover */
  @media (min-width: 992px) {
    &:hover ${CategoryTitle} {
      opacity: 1;
    }
    &:hover ${CategoryImage} {
      transform: scale(1.1);
      filter: brightness(0.7);
    }
  }
`;

const Categorias = () => {
  return (
    <Section>
      <Container>
        <CategoryGrid>
          {categoriesData.map((cat) => (
            <CategoryCard key={cat.name} to={cat.path}>
              <CategoryImage src={cat.image} alt={cat.alt} />
              <CategoryTitle>{cat.name}</CategoryTitle>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Container>
    </Section>
  );
};

export default Categorias;
