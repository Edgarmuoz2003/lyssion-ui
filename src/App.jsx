import "bootstrap/dist/css/bootstrap.min.css";
import Productos from "./components/productos";
import Colores from "./components/colores";
import Categorias from "./components/categorias";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useColoresStore } from "./utils/useColoresStore";
import Tallas from "./components/tallas";
import { useTallasStore } from "./utils/useTallasStore";
import { useCategoriasStore } from "./utils/useCategoriasStore";
import { useProductosStore } from "./utils/useProductosStore";



function App() {
 useColoresStore();
 useTallasStore();
 useCategoriasStore();
 useProductosStore();
 
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Productos />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
