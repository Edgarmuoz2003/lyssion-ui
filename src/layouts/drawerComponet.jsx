import { Button, Drawer } from "antd";
import styled from "styled-components";
import { HiColorSwatch } from "react-icons/hi";
import { TbRulerMeasure } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { FaUsers, FaClipboardList, FaImages } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DrawerLinkButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;
    padding: 12px 14px;
    color: #10243e;
    font-weight: 600;
    border: 1px solid #d8e0e8;
    border-radius: 12px;
    box-shadow: none;
    background: #fff;
    text-decoration: none;
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
    cursor: pointer;
    text-align: left;
  }

  && svg {
    font-size: 20px;
    color: #193f66;
  }

  &&:hover,
  &&:focus-visible {
    color: #10243e;
    border-color: #193f66;
    background-color: #f4f7fb;
  }

  &&:hover svg,
  &&:focus-visible svg {
    color: inherit;
  }
`;

const DrawerComponent = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      title="Configuraciones"
      className="config-drawer"
      open={open}
      onClose={onClose}
      width={320}
    >
      <DrawerContent>
        <DrawerLinkButton size="large" type="text" icon={<HiColorSwatch />} onClick={() => handleNavigate("/Colores")}>
          Colores
        </DrawerLinkButton>
        <DrawerLinkButton size="large" type="text" icon={<TbRulerMeasure />} onClick={() => handleNavigate("/Tallas")}>
          Tallas
        </DrawerLinkButton>
        <DrawerLinkButton size="large" type="text" icon={<MdCategory />} onClick={() => handleNavigate("/Categorias")}>
          Categorías
        </DrawerLinkButton>
        <DrawerLinkButton size="large" type="text" icon={<FaImages />} onClick={() => handleNavigate("/Banners")}>
          Banners
        </DrawerLinkButton>
        <DrawerLinkButton size="large" type="text" icon={<FaUsers />} onClick={() => handleNavigate("/Usuarios")}>
          Usuarios
        </DrawerLinkButton>
        <DrawerLinkButton size="large" type="text" icon={<FaClipboardList />} onClick={() => handleNavigate("/PedidosList")}>
          Órdenes de pedido
        </DrawerLinkButton>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerComponent;
