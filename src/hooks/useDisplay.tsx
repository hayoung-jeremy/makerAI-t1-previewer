import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

const useDisplay = () => {
  const isDesktop = useMediaQuery({ minWidth: 1280 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1279 });
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [showMobileUI, setShowMobileUI] = useState(false);
  const [showTabletUI, setShowTabletUI] = useState(false);
  const [showPCUI, setShowPCUI] = useState(false);

  useEffect(() => {
    setShowMobileUI(isMobile);
    setShowTabletUI(isTablet);
    setShowPCUI(isDesktop);
  }, [isMobile, isTablet, isDesktop]);

  return {
    isDesktop: showPCUI,
    isTablet: showTabletUI,
    isMobile: showMobileUI,
  };
};

export default useDisplay;
