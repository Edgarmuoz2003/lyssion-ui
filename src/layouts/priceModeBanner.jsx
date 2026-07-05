import { Button } from "react-bootstrap";
import { useMainStore } from "@/store/useMainStore";
import { getPriceModeLabel } from "@/components/detalle.helpers";

const PriceModeBanner = () => {
  const priceMode = useMainStore((state) => state.priceMode);
  const setPriceMode = useMainStore((state) => state.setPriceMode);

  const isWholesale = priceMode === "mayorista";
  const currentLabel = getPriceModeLabel(priceMode);
  const nextMode = isWholesale ? "detal" : "mayorista";
  const nextLabel = isWholesale ? "al detal" : "al por mayor";
  const title = `Estas viendo precios ${currentLabel}`;

  return (
    <div className="price-mode-banner">
      <p className="price-mode-banner-eyebrow">Tipo de precio</p>
      <h2 className="price-mode-banner-title">{title}</h2>
      {isWholesale ? (
        <p className="price-mode-banner-note">
          Solo aplica de 6 productos en adelante, pueden ser de diferentes
          referencias.
        </p>
      ) : null}
      <p className="price-mode-banner-copy">
        {isWholesale
          ? "Soy cliente final"
          : "Soy mayorista"}
      </p>
      <Button
        variant="dark"
        className="price-mode-banner-button"
        onClick={() => setPriceMode(nextMode)}
      >
        Quiero ver precios {nextLabel}
      </Button>
    </div>
  );
};

export default PriceModeBanner;
