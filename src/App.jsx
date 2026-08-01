import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense, useCallback, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PrivateRoute } from "./utils/privateRoutes";
import SpinnerComponent from "./layouts/spinnerComponent";

import { useUsuariosStore } from "./utils/hooks/useUsuariosStore";
import { useLogindata } from "./utils/hooks/useLoginData";

import Header from "./layouts/header";
import Footer from "./layouts/footer";
import KartButton from "./layouts/kartButton";
import WhatsappButton from "./layouts/whatsappButton";
import DrawerComponent from "./layouts/drawerComponet";

const Home = lazy(() => import("./components/home/home"));
const Login = lazy(() => import("./components/login"));
const Pijamas = lazy(() => import("./components/pijamas"));
const Casual = lazy(() => import("./components/casual"));
const Deportiva = lazy(() => import("./components/deportiva"));
const Detalle = lazy(() => import("./components/detalle"));
const Carrito = lazy(() => import("./components/carrito"));
const Pedido = lazy(() => import("./components/pedido"));
const Nosotros = lazy(() => import("./components/nosotros"));
const Configuraciones = lazy(() => import("./components/configuraciones"));
const CostoEnvio = lazy(() => import("./components/configuracion/costoEnvio"));
const PreciosProductos = lazy(() =>
  import("./components/configuracion/preciosProductos")
);
const Banners = lazy(() => import("./components/configuracion/banners"));
const ImagenesCategorias = lazy(() =>
  import("./components/configuracion/imagenesCategorias")
);
const Colores = lazy(() => import("./components/colores"));
const Tallas = lazy(() => import("./components/tallas"));
const Categorias = lazy(() => import("./components/categorias"));
const Usuarios = lazy(() => import("./components/usuarios"));
const PedidosList = lazy(() => import("./components/pedidosList"));
const PoliticaDeDatos = lazy(() => import("./components/PoliticaDeDatos"));
const DetallesPedido = lazy(() => import("./components/detallesPedido"));
const WhatsappInboxPage = lazy(() =>
  import("./components/whatsapp/WhatsappInboxPage")
);

const configPaths = new Set([
  "/Configuraciones",
  "/CostoEnvio",
  "/PreciosProductos",
  "/Colores",
  "/Tallas",
  "/Categorias",
  "/Banners",
  "/ImagenesCategorias",
  "/Usuarios",
  "/PedidosList",
  "/admin/conversaciones",
]);

const AppContent = () => {
  const location = useLocation();
  const [isConfigMenuOpen, setIsConfigMenuOpen] = useState(false);
  const isConfigRoute = configPaths.has(location.pathname);

  const handleToggleConfigMenu = useCallback(() => {
    setIsConfigMenuOpen((prevOpen) => !prevOpen);
  }, []);

  return (
    <div className="app-shell">
      <Header />
      <KartButton />
      <WhatsappButton />

      {isConfigRoute && (
        <DrawerComponent open={isConfigMenuOpen} onToggle={handleToggleConfigMenu} />
      )}

      <main
        className={
          isConfigRoute
            ? `app-main config-page-main ${isConfigMenuOpen ? "sidebar-open" : "sidebar-collapsed"}`
            : "app-main"
        }
      >
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

            <Route
              path="/Configuraciones"
              element={
                <PrivateRoute>
                  <Configuraciones />
                </PrivateRoute>
              }
            />
            <Route
              path="/PreciosProductos"
              element={
                <PrivateRoute>
                  <PreciosProductos />
                </PrivateRoute>
              }
            />
            <Route
              path="/CostoEnvio"
              element={
                <PrivateRoute>
                  <CostoEnvio />
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
              path="/Banners"
              element={
                <PrivateRoute>
                  <Banners />
                </PrivateRoute>
              }
            />
            <Route
              path="/ImagenesCategorias"
              element={
                <PrivateRoute>
                  <ImagenesCategorias />
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
            <Route
              path="/admin/conversaciones"
              element={
                <PrivateRoute>
                  <WhatsappInboxPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

function App() {
  useUsuariosStore();
  useLogindata();

  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

export default App;
