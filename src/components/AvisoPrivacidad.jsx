import { Link } from "react-router-dom";

const AvisoPrivacidad = () => {
  return (
    <div className="mb-2 small text-muted">
      <p>
        Al continuar, declaras que has leído y estás de acuerdo con nuestra{" "}
        <Link to="/politica-de-datos" target="_blank" rel="noopener noreferrer">
          Política de Tratamiento de Datos Personales
        </Link>
        .
      </p>
    </div>
  );
};

export default AvisoPrivacidad;