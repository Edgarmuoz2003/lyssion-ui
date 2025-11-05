import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./utils/privateRoutes";
import SpinnerComponent from "./layouts/spinnerComponent";

// 🪣 Zustand stores
import { useUsuariosStore } from "./utils/hooks/useUsuariosStore";
import { useLogindata } from "./utils/hooks/useLoginData";
import { useOrdenesStore } from "./utils/hooks/useOrdenesStore";

// 📦 Componentes cargados siempre (layout)
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import KartButton from "./layouts/kartButton";
import WhatsappButton from "./layouts/whatsappButton";

// 💨 Lazy load para las páginas
const Home = lazy(() => import("./components/home"));
const Login = lazy(() => import("./components/login"));
const Pijamas = lazy(() => import("./components/pijamas"));
const Casual = lazy(() => import("./components/casual"));
const Deportiva = lazy(() => import("./components/deportiva"));
const Detalle = lazy(() => import("./components/detalle"));
const Carrito = lazy(() => import("./components/carrito"));
const Pedido = lazy(() => import("./components/pedido"));
const Nosotros = lazy(() => import("./components/nosotros"));
const Configuraciones = lazy(() => import("./components/configuraciones"));
const Colores = lazy(() => import("./components/colores"));
const Tallas = lazy(() => import("./components/tallas"));
const Categorias = lazy(() => import("./components/categorias"));
const Usuarios = lazy(() => import("./components/usuarios"));
const PedidosList = lazy(() => import("./components/pedidosList"));
const PoliticaDeDatos = lazy(() => import("./components/PoliticaDeDatos"));
const DetallesPedido = lazy(() => import("./components/detallesPedido"));

function App() {
  // Inicializa los estados globales (Zustand)
  useUsuariosStore();
  useLogindata();
  useOrdenesStore();
  

  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router>
        <Header />
        <KartButton />
        <WhatsappButton />

        {/* 🌀 Suspense muestra un loader mientras carga cada página */}
        <Suspense
          fallback={
            <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
              <SpinnerComponent />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Pijamas" element={<Pijamas />} />
            <Route path="/Casual" element={<Casual />} />
            <Route path="/Deportiva" element={<Deportiva />} />
            <Route path="/detalles/:id" element={<Detalle />} />
            <Route path="/detallesPedido/:id" element={<DetallesPedido />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/pedido" element={<Pedido />} />
            <Route path="/Nosotros" element={<Nosotros />} />
            <Route path="/politica-de-datos" element={<PoliticaDeDatos />} />

            {/* 🔐 Rutas privadas */}
            <Route
              path="/Configuraciones"
              element={
                <PrivateRoute>
                  <Configuraciones />
                </PrivateRoute>
              }
            />
            <Route
              path="/Colores"
              element={
                <PrivateRoute>
                  <Colores />
                </PrivateRoute>
              }
            />
            <Route
              path="/Tallas"
              element={
                <PrivateRoute>
                  <Tallas />
                </PrivateRoute>
              }
            />
            <Route
              path="/Categorias"
              element={
                <PrivateRoute>
                  <Categorias />
                </PrivateRoute>
              }
            />
            <Route
              path="/Usuarios"
              element={
                <PrivateRoute>
                  <Usuarios />
                </PrivateRoute>
              }
            />
            <Route
              path="/PedidosList"
              element={
                <PrivateRoute>
                  <PedidosList />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>

        <Footer />
      </Router>
    </>
  );
}

export default App;
