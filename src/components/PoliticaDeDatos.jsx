import { Container } from "react-bootstrap";

const PoliticaDeDatos = () => {
  return (
    <Container className="py-5 my-4">
      <h1>Política de Tratamiento de Datos Personales</h1>
      <p className="text-muted">Última actualización: 24 de Julio de 2024</p>

      <hr />

      <p>
        <strong>Lyssion Style S.A.S.</strong>, sociedad comercial identificada
        con NIT [TU NÚMERO DE NIT AQUÍ], con domicilio principal en Medellín,
        Colombia, en su calidad de responsable del tratamiento de datos
        personales, se compromete a proteger su privacidad y a garantizar el
        correcto manejo de su información, en cumplimiento de la Ley Estatutaria
        1581 de 2012 y sus decretos reglamentarios.
      </p>

      <h2 className="mt-4">1. Finalidad del Tratamiento de Datos</h2>
      <p>
        Los datos personales que recolectamos a través de nuestros formularios
        de compra y canales de contacto serán utilizados única y exclusivamente
        para las siguientes finalidades:
      </p>
      <ul>
        <li>
          <strong>Gestión de Pedidos:</strong> Procesar, facturar, despachar y
          realizar el seguimiento de los productos adquiridos por usted.
        </li>
        <li>
          <strong>Comunicación Transaccional:</strong> Contactarlo para
          informarle sobre el estado de su pedido, resolver inquietudes,
          gestionar devoluciones o cualquier asunto directamente relacionado con
          su compra.
        </li>
        <li>
          <strong>Cumplimiento Legal:</strong> Cumplir con las obligaciones
          contables, fiscales y administrativas exigidas por la legislación
          colombiana.
        </li>
      </ul>
      <p>
        <strong>Lyssion Style S.A.S.</strong> declara explícitamente que no
        utilizará sus datos para fines de marketing o envío de publicidad. No
        vendemos, alquilamos ni cedemos su información a terceros para dichos
        fines.
      </p>

      <h2 className="mt-4">2. Datos Personales Recolectados</h2>
      <p>
        Para llevar a cabo las finalidades descritas, podremos recolectar los
        siguientes datos personales:
      </p>
      <ul>
        <li>Nombre y Apellidos.</li>
        <li>Número de documento de identidad.</li>
        <li>Dirección de residencia y envío.</li>
        <li>Teléfono de contacto.</li>
        <li>Correo electrónico.</li>
      </ul>

      <h2 className="mt-4">3. Derechos del Titular de los Datos</h2>
      <p>Como titular de sus datos personales, usted tiene derecho a:</p>
      <ul>
        <li>
          <strong>Conocer, actualizar y rectificar</strong> sus datos
          personales.
        </li>
        <li>
          <strong>Solicitar prueba</strong> de la autorización otorgada para el
          tratamiento de sus datos.
        </li>
        <li>
          <strong>Ser informado</strong> sobre el uso que se le ha dado a sus
          datos personales.
        </li>
        <li>
          <strong>Presentar quejas</strong> ante la Superintendencia de
          Industria y Comercio por infracciones a la ley.
        </li>
        <li>
          <strong>Revocar la autorización</strong> y/o solicitar la supresión
          de sus datos, siempre y cuando no exista un deber legal o contractual
          de permanecer en la base de datos.
        </li>
      </ul>

      <h2 className="mt-4">4. Canales de Atención</h2>
      <p>
        Para ejercer sus derechos, puede contactarnos a través del correo
        electrónico:{" "}
        <strong>[TU CORREO DE CONTACTO AQUÍ]</strong>. Su solicitud será
        atendida en los términos previstos por la ley.
      </p>

      <h2 className="mt-4">5. Vigencia</h2>
      <p>
        La presente política rige a partir de su publicación y deja sin efectos
        las demás disposiciones institucionales que le sean contrarias.
      </p>
    </Container>
  );
};

export default PoliticaDeDatos;