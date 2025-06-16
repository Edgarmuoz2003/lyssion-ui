import InitialBaner from "../layouts/baneerInicio";
import { Container, Card } from "react-bootstrap";
import catPijamas from "../assets/catPijamas.jpg";
import catCasual from "../assets/catCasual.jpg";
import catDeportiva from "../assets/catDeportiva.jpg";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <section className="baner-home-inicio">
        <InitialBaner />
      </section>

      <section className="section-categorias-home">
        <h1 className="titulo-home-inicio">Nuestras Categorias</h1>
        <Container>
          <div className="Categorias-container-home">
            <Card className="categoria-item">
              <Link to={"/Pijamas"}>
                <img src={catPijamas} alt="categoria pijamas" />
                <h2>Pijamas</h2>
              </Link>
            </Card>
            <Card className="categoria-item">
              <Link to={"/Casual"}>
                <img src={catCasual} alt="categoria casual" />
                <h2>Casual</h2>
              </Link>
            </Card>
            <Card className="categoria-item">
              <Link to={"/Deportiva"}>
                <img src={catDeportiva} alt="categoria pijamas" />
                <h2>Deportivo</h2>
              </Link>
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Home;
