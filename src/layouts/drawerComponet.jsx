import { NavLink } from "react-router-dom";
import { HiColorSwatch } from "react-icons/hi";
import { TbRulerMeasure } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import {
  FaBars,
  FaClipboardList,
  FaDollarSign,
  FaImages,
  FaTruck,
  FaUsers,
  FaWhatsapp,
} from "react-icons/fa";

const menuItems = [
  { path: "/PreciosProductos", label: "Precios productos", icon: <FaDollarSign /> },
  { path: "/CostoEnvio", label: "Costo de envio", icon: <FaTruck /> },
  { path: "/Colores", label: "Colores", icon: <HiColorSwatch /> },
  { path: "/Tallas", label: "Tallas", icon: <TbRulerMeasure /> },
  { path: "/Categorias", label: "Categorias", icon: <MdCategory /> },
  { path: "/Banners", label: "Banners", icon: <FaImages /> },
  {
    path: "/ImagenesCategorias",
    label: "Imagenes de categorias",
    icon: <FaImages />,
  },
  { path: "/Usuarios", label: "Usuarios", icon: <FaUsers /> },
  { path: "/PedidosList", label: "Ordenes de pedido", icon: <FaClipboardList /> },
  {
    path: "/admin/conversaciones",
    label: "Conversaciones",
    icon: <FaWhatsapp />,
  },
];

const DrawerComponent = ({ open, onToggle }) => {
  return (
    <aside className={`config-sidebar ${open ? "is-open" : "is-collapsed"}`}>
      <button
        type="button"
        className="config-sidebar-toggle"
        onClick={onToggle}
        aria-label={open ? "Recoger menu" : "Abrir menu"}
      >
        <FaBars />
      </button>

      <nav className="config-sidebar-nav" aria-label="Opciones de configuracion">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `config-sidebar-link ${isActive ? "is-active" : ""}`
            }
            title={!open ? item.label : undefined}
          >
            <span className="config-sidebar-icon">{item.icon}</span>
            <span className="config-sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default DrawerComponent;
