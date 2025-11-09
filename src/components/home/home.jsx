import InitialBaner from "../../layouts/baneerInicio";
import Categorias from "./home-secciones/categorias";
import Loultimo from "./home-secciones/loUltimo"
import Nuestros_productos from "./home-secciones/Nuestros_productos";
import Testimonios from "./home-secciones/testimonios";
import ValoresLyssion from "../../layouts/valoresLyssion";

const Home = () => {

  return (
    <>
      <section className="baner-home-inicio">
        <InitialBaner />
      </section>

      {/* PROPUESTA DE VALOR */}
      <ValoresLyssion />

      {/* CATEGORIAS */}
      <Categorias />

      {/* LO ÚLTIMO */}
      <Loultimo />

      {/* NUESTROS PRODUCTOS */}
      <Nuestros_productos />

      {/* TESTIMONIOS */}
      < Testimonios />

    </>
  );
};

export default Home;
