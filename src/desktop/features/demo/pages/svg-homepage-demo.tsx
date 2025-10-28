import { SVGHomepage } from "@/common/components/svg-homepage/svg-homepage";
import { useNavigate } from "react-router-dom";

export const SVGHomepageDemo = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/notes");
  };

  const handleLearnMore = () => {
    console.log("Learn more clicked");
  };

  return (
    <SVGHomepage 
      onGetStarted={handleGetStarted}
      onLearnMore={handleLearnMore}
    />
  );
};
