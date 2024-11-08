import { AxiosResponse } from "axios";
import { axiosInstance, createAuthHeaders } from "./axios.config";
import { TmdbProxyBody } from './api.interfaces'

class TmdbProxyService {

    static instance: TmdbProxyService | null = null;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new TmdbProxyService();
        }

        return this.instance;
    };

    accessTmdbApi = async (tmdbProxyBody: TmdbProxyBody): Promise<AxiosResponse> => {
        const { uri, method, body, headers } = tmdbProxyBody

        let proxyBody: TmdbProxyBody = { uri, method }
        if (body) {
            proxyBody = { ...proxyBody, body }
        }
        if (headers) {
            proxyBody = { ...proxyBody, headers }
        }
        return await axiosInstance.post('tmdb-proxy', proxyBody, { headers: createAuthHeaders() })
    }

}

export default TmdbProxyService.getInstance();