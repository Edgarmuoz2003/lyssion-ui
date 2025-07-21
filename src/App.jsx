import "bootstrap/dist/css/bootstrap.min.css";
import Productos from "./components/productos";
import Colores from "./components/colores";
import Categorias from "./components/categorias";
import Pijamas from "./components/pijamas";
import Casual from "./components/casual";
import Deportiva from "./components/deportiva";
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
import Usuarios from "./components/usuarios";
import { useUsuariosStore } from "./utils/useUsuariosStore";
import Login from "./components/login";
import { useLogindata } from "./utils/useLoginData";
import { PrivateRoute } from "./utils/privateRoutes";
import Home from "./components/home";
import Detalle from "./components/detalle";



function App() {
 useColoresStore();
 useTallasStore();
 useCategoriasStore();
 useProductosStore();
 useUsuariosStore();
 useLogindata();
 
  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Pijamas" element={<Pijamas />}/>
          <Route path="/Casual" element={<Casual />}/>
          <Route path="/Deportiva" element={<Deportiva />}/>
          <Route path="/detalles/:id" element={<Detalle />} />
          <Route path="/Productos" element={ <PrivateRoute><Productos /></PrivateRoute> } />
          <Route path="/Colores" element={<PrivateRoute><Colores /></PrivateRoute>} />
          <Route path="/Tallas" element={<PrivateRoute><Tallas /></PrivateRoute>} />
          <Route path="/Categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
          <Route path="/Usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
