import { Button, Drawer } from "antd";
import styled from "styled-components";
import { HiColorSwatch } from "react-icons/hi";
import { TbRulerMeasure } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { FaUsers, FaClipboardList } from "react-icons/fa";

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DrawerLinkButton = styled(Button)`
  && {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    color: #1f1f1f;
    font-weight: 500;
    border: 1px solid #1f1f1f;
    box-shadow: none;
    background: transparent;
    text-decoration: none;
    transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    cursor: pointer;
    text-align: center;
  }

  && svg {
    font-size: 20px;
  }

  &&:hover,
  &&:focus-visible {
    color: #1f1f1f;
    background-color: rgba(0, 0, 0, 0.08);
  }

  &&:hover svg,
  &&:focus-visible svg {
    color: inherit;
  }
`;

const DrawerComponent = ({ open, onClose }) => (
  <Drawer title="Configuraciones" open={open} onClose={onClose}>
    <DrawerContent>
      <DrawerLinkButton size="large" type="text" href="/Colores" icon={<HiColorSwatch />}>
        Colores
      </DrawerLinkButton>
      <DrawerLinkButton size="large" type="text" href="/Tallas" icon={<TbRulerMeasure />}>
        Tallas
      </DrawerLinkButton>
      <DrawerLinkButton size="large" type="text" href="/Categorias" icon={<MdCategory />}>
        Categorias
      </DrawerLinkButton>
      <DrawerLinkButton size="large" type="text" href="/Usuarios" icon={<FaUsers />}>
        Usuarios
      </DrawerLinkButton>
      <DrawerLinkButton size="large" type="text" href="/PedidosList" icon={<FaClipboardList />}>
        Ordenes de pedido
      </DrawerLinkButton>
    </DrawerContent>
  </Drawer>
);

export default DrawerComponent;
