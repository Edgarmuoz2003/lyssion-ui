import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import AlertComponent from "@/layouts/alertComponent";
import SpinnerComponet from "@/layouts/spinnerComponent";
import { mostrarError, mostrarExito } from "@/utils/hookMensajes";
import { useConfiguracionTienda } from "@/utils/hooks/useConfiguracionTienda";

const CostoEnvio = () => {
  const [costoEnvioInput, setCostoEnvioInput] = useState("");
  const {
    configuracionTienda,
    loadingConfiguracionTienda,
    errorConfiguracionTienda,
    updateConfiguracionTienda,
    actualizandoConfiguracionTienda,
  } = useConfiguracionTienda();

  useEffect(() => {
    const costoEnvio = configuracionTienda?.costoEnvio;
    if (Number.isInteger(costoEnvio)) {
      setCostoEnvioInput(String(costoEnvio));
    }
  }, [configuracionTienda?.costoEnvio]);

  const handleCostoEnvioChange = (event) => {
    const digitsOnly = String(event.target.value || "").replace(/\D/g, "");
    setCostoEnvioInput(digitsOnly);
  };

  const handleGuardarCostoEnvio = async () => {
    const costoEnvio = Number(costoEnvioInput);
    if (!Number.isInteger(costoEnvio) || costoEnvio < 0) {
      mostrarError("El costo de envio debe ser un numero valido");
      return;
    }

    try {
      await updateConfiguracionTienda({
        variables: { costoEnvio },
      });
      mostrarExito("Costo de envio actualizado con exito");
    } catch (error) {
      mostrarError(
        "No se pudo actualizar el costo de envio",
        error?.message || "Error desconocido"
      );
    }
  };

  if (loadingConfiguracionTienda && !configuracionTienda) {
    return <SpinnerComponet />;
  }

  if (errorConfiguracionTienda && !configuracionTienda) {
    return (
      <AlertComponent
        variant="danger"
        heading="Error al cargar configuracion"
      >
        {errorConfiguracionTienda.message}
      </AlertComponent>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Costo de envio</Card.Title>
          <Card.Text>
            Define el valor que se cobrara por envio en los nuevos pedidos.
          </Card.Text>
          {errorConfiguracionTienda ? (
            <p className="text-danger mb-3">{errorConfiguracionTienda.message}</p>
          ) : null}
          <Row className="g-3 align-items-end">
            <Col md={4}>
              <Form.Group controlId="config-costo-envio">
                <Form.Label>Costo de envio</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="numeric"
                  value={costoEnvioInput}
                  onChange={handleCostoEnvioChange}
                  placeholder="15000"
                  disabled={loadingConfiguracionTienda}
                />
              </Form.Group>
            </Col>
            <Col md="auto">
              <Button
                onClick={handleGuardarCostoEnvio}
                disabled={loadingConfiguracionTienda || actualizandoConfiguracionTienda}
              >
                {actualizandoConfiguracionTienda ? "Guardando..." : "Guardar costo"}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CostoEnvio;
