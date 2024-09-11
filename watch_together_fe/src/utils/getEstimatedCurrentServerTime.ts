import { axiosInstance, createAuthHeaders } from "../services/axios.config"

const getEstimatedCurrentServerTime = async () => {
    const localTimeServerTimeReq = Date.now()
    const serverTime = await axiosInstance.get('/server-time', { headers: createAuthHeaders() })
    const localTimeServerTimeRes = Date.now()
    const delay = (localTimeServerTimeRes - localTimeServerTimeReq) / 2
    return serverTime.data.timestamp + delay
}

export default getEstimatedCurrentServerTime