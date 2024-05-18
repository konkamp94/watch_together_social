import { AxiosResponse } from "axios"
import { axiosInstance, createAuthHeaders } from "./axios.config"
class SocialService {

    static instance: SocialService | null = null;

    static getInstance = () => {
        if (!this.instance) {
            this.instance = new SocialService();
        }

        return this.instance;
    };

    searchFriends = async (keyword: string): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/social/search-friends?search=${keyword}`, { headers: createAuthHeaders() })
    }

    getFriendRequests = async (): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/social/friend-requests`, { headers: createAuthHeaders() })
    }

    getNotifications = async (): Promise<AxiosResponse> => {
        return await axiosInstance.get(`/social/notifications`, { headers: createAuthHeaders() })
    }

    addFriend = async ({ otherUserId, userId }: { otherUserId: number, userId: number }): Promise<AxiosResponse> => {

        const body = {
            requesterUserId: userId,
            receiverUserId: otherUserId
        }

        return await axiosInstance.post('/social/friendship', body, { headers: createAuthHeaders() })
    }

    acceptOrRejectFriend = async ({ friendshipId, status }: { friendshipId: number, status: string }) => {
        const body = { status }

        return await axiosInstance.patch(`/social/friendship/${friendshipId}/status`, body, { headers: createAuthHeaders() })
    }
}

export default SocialService.getInstance()