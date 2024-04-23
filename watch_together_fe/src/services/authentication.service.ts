import { AxiosResponse } from "axios";
import { axiosInstance } from "./axios.config";

class AutheticationService {

    static instance: AutheticationService | null = null;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new AutheticationService();
        }

        return this.instance;
    };

    getTmdbRequestToken = async (): Promise<AxiosResponse> => {
        return await axiosInstance.get('/authentication/get-tmdb-request-token')
    }

    signUpOrLogin = async (requestToken: string): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/authentication/sign-up-or-login?requestToken=${requestToken}`)
    }
}

export default AutheticationService.getInstance()