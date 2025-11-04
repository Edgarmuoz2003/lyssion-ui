import Alert from "react-bootstrap/Alert";

const AlertComponent = ({ variant = "danger", heading, children, actions }) => (
  <Alert variant={variant}>
    {heading && <Alert.Heading>{heading}</Alert.Heading>}
    <div>{children}</div>
    {actions}
  </Alert>
);

export default AlertComponent;