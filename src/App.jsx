import "bootstrap/dist/css/bootstrap.min.css";
import Productos from "./components/productos";
import Colores from "./components/colores";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useColoresStore } from "./utils/useColoresStore";


function App() {
 useColoresStore();

  return (
    <>
      <ToastContainer position="bottom-right" />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Colores />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
