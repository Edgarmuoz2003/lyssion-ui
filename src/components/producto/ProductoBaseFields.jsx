import { Form } from "react-bootstrap";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";

const ProductoBaseFields = ({
  isEditing,
  producto,
  editDraft,
  categorias = [],
  onFieldChange,
  formattedPrice,
}) => {
  if (!isEditing) {
    return (
      <>
        <h2>{producto?.nombre}</h2>
        <p className="text-muted">{producto?.descripcion}</p>
        <h3 className="price my-3">{formattedPrice}</h3>
      </>
    );
  }

  return (
    <div className="d-flex flex-column gap-2">
      <label>Nombre del Producto</label>
      <Input
        type="text"
        value={editDraft?.nombre || ""}
        placeholder="Ingrese el nombre"
        onChange={(event) => onFieldChange("nombre", event.target.value)}
      />

      <label>Descripcion</label>
      <TextArea
        rows={3}
        value={editDraft?.descripcion || ""}
        placeholder="Ingrese la descripcion"
        onChange={(event) => onFieldChange("descripcion", event.target.value)}
      />

      <label>Categoria</label>
      <Form.Select
        value={editDraft?.categoriaId || ""}
        onChange={(event) => onFieldChange("categoriaId", event.target.value)}
      >
        <option value="">Seleccione una categoria</option>
        {categorias.map((categoria) => (
          <option key={categoria.id} value={categoria.id}>
            {categoria.nombre}
          </option>
        ))}
      </Form.Select>
    </div>
  );
};

export default ProductoBaseFields;
