import { createContext, ReactNode} from "react";
import { MetadataContextValue } from "./interfaces.context";
import useGetGenres from "../hooks/api/useGetGenres"
import { Genre } from "../services/api.interfaces"

const initialMetadataContextValue = {} as MetadataContextValue 
export const MetadataContext = createContext<MetadataContextValue>(initialMetadataContextValue)

export const MetadataProvider = ({ children}: { children: ReactNode}) => {
    const { genres, isLoadingGenres } = useGetGenres()

    const createGenresMap = () => {
        const idTitleMap: {[id: number]: string} = {}
        genres?.data.genres.forEach((genre: Genre) => idTitleMap[genre.id] = genre.name)
        return idTitleMap
    }


    return (<MetadataContext.Provider value={{ genres: createGenresMap() , isLoadingGenres }}>
                {children}
            </MetadataContext.Provider>)
}