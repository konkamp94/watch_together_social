import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FriendshipStatus } from './social.enum';
import { BlockUserDto, CreateFriendshipDto, UpdateFriendshipStatusDto } from './social.interface';
import { BlockedUser } from 'src/user/entities/blocked-user.entity';
@Injectable()
export class SocialService {
    constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>,
        @InjectRepository(User) private userRepository: Repository<User>, @InjectRepository(BlockedUser) private blockedUserRepository: Repository<BlockedUser>) { }

    async createFriendship(createFriendshipDto: CreateFriendshipDto) {

        const user = await this.userRepository.findOne({ where: { id: createFriendshipDto.requesterUserId } });
        const receiverUser = await this.userRepository.findOne({ where: { id: createFriendshipDto.receiverUserId } });

        if (!user || !receiverUser) { throw new HttpException('User not found', 404); }

        if (user.id === receiverUser.id) { throw new HttpException('Requester user id is the same with receiver user id', 400); }

        const existedFriendship = await this.friendshipRepository.findOne({ where: { requesterUserId: user.id, receiverUserId: receiverUser.id } });
        if (existedFriendship && existedFriendship.status !== FriendshipStatus.REJECTED) { throw new HttpException('Friendship already exists', 400); }

        const friendship = new Friendship();
        friendship.requesterUserId = user.id;
        friendship.receiverUserId = receiverUser.id;
        friendship.status = FriendshipStatus.PENDING;
        return this.friendshipRepository.save(friendship);
    }

    async updateFriendshipStatus(friendshipId: number, updateFriendshipStatusDto: UpdateFriendshipStatusDto) {
        const friendship = await this.friendshipRepository.findOne({ where: { id: friendshipId } });

        friendship.status = updateFriendshipStatusDto.status;
        return this.friendshipRepository.save(friendship);
    }

    async deleteFriendship(id: number): Promise<Friendship> {
        const friendship = await this.friendshipRepository.findOne({ where: { id } });
        if (!friendship) { throw new HttpException('Friendship not found', 404); }
        return await this.friendshipRepository.remove(friendship);
    }

    async blockUser(blockUserDto: BlockUserDto) {
        const { blockerUserId, blockedUserId } = blockUserDto;
        if (blockerUserId === blockedUserId) { throw new HttpException('Blocker user id is the same with blocked user id', 400); }
        const blockRelationshipExists = await this.blockedUserRepository.exists({ where: { blockerUserId, blockedUserId } });
        if (blockRelationshipExists) { throw new HttpException('Blocked relationship already exists', 400); }

        // if there is friendship between blocker and blocked, remove it
        const friendship = await this.friendshipRepository.findOne({
            where: [{ requesterUserId: blockerUserId, receiverUserId: blockedUserId }
                , { requesterUserId: blockedUserId, receiverUserId: blockerUserId }]
        });
        if (friendship) {
            await this.friendshipRepository.remove(friendship);
        }

        const blockedUser = new BlockedUser();
        blockedUser.blockerUserId = blockerUserId;
        blockedUser.blockedUserId = blockedUserId;
        return this.blockedUserRepository.save(blockedUser);
    }
}
