import { FriendshipStatus } from './social.enum';

// TODO: make dtos with class-validator
export interface CreateFriendshipDto {
    requesterUserId: number;
    receiverUserId: number;
}

export interface UpdateFriendshipStatusDto {
    status: FriendshipStatus;
}

export interface BlockUserDto {
    blockerUserId: number;
    blockedUserId: number;
}

export interface CreateWatchRoomDto {
    movieId: number
    invitedUsersIds: number[]
    // added after the request
    movieTitle?: string
}