import { Carousel } from "react-bootstrap";
import { useQuery } from "@apollo/client";
import { GET_BANNERS_ACTIVOS } from "../graphql/queries/productQueries";
import { DEFAULT_BANNERS } from "../utils/bannerConfig";

const InitialBaner = () => {
  const { data } = useQuery(GET_BANNERS_ACTIVOS, {
    fetchPolicy: "cache-and-network",
  });
  const bannersActivos = data?.bannersActivos || [];
  const banners = bannersActivos.length > 0 ? bannersActivos : DEFAULT_BANNERS;

  return (
    <Carousel interval={4000} fade>
      {banners.map((banner, index) => (
        <Carousel.Item key={banner.id}>
          <img
            src={banner.url}
            alt={banner.nombre || `imagen del banner ${index + 1}`}
            className="d-block w-100"
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default InitialBaner;
