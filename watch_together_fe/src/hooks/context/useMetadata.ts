import { MetadataContext } from "../../context/metadata.context";
import { useContext } from "react";

const useMetadata = () => {
    return useContext(MetadataContext)
}

export default useMetadata