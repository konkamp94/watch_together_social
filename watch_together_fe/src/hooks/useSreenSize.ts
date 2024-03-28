import { useEffect, useState } from "react";

const useScreenSize = () => {
    const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1450);
    const [isTablet, setIsTableT] = useState(window.innerWidth > 900 && window.innerHeight <= 1450)
    const [screenSize, setScreenSize] = useState(window.innerWidth)

    const updateMedia = () => {
        setScreenSize(window.innerWidth)
        setIsTableT(window.innerWidth > 900 && window.innerHeight <= 1450)
        setIsDesktop(window.innerWidth > 1450);
    };

    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });

    return { isDesktop, isTablet, screenSize }

}

export default useScreenSize