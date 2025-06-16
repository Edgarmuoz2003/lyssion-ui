import { Carousel } from "react-bootstrap";
import bannerInicio3 from "../assets/bannerInicio3.jpg";
import bannerInicio2 from "../assets/bannerInicio2.png";

const InitialBaner = () => {
    return(
         <Carousel interval={4000} fade>
          <Carousel.Item>
            <img
              src={bannerInicio3}
              alt="imagen del banner"
              className="d-block w-100"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              src={bannerInicio2}
              alt="imagen del banner 2"
              className="d-block w-100"
            />
          </Carousel.Item>
        </Carousel>
    )
}
 
export default InitialBaner