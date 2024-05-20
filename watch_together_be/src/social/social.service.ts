import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { In, Like, Not, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { FriendshipStatus } from './social.enum';
import { BlockUserDto, CreateFriendshipDto, UpdateFriendshipStatusDto } from './social.interface';
import { BlockedUser } from 'src/user/entities/blocked-user.entity';
import { NotificationType } from 'src/user/user.interface';
import { Notification } from './entities/notification.entity';
@Injectable()
export class SocialService {
    constructor(@InjectRepository(Friendship) private friendshipRepository: Repository<Friendship>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(BlockedUser) private blockedUserRepository: Repository<BlockedUser>,
        @InjectRepository(Notification) private notificationRepository: Repository<Notification>) { }

    async searchFriendByUsernameOrName(user: User, keyword: string) {
        const otherUsers = await this.userRepository.find({
            select: ['id', 'name', 'username'],
            where: [{ username: Like(`%${keyword}%`), id: Not(user.id) },
            { name: Like(`%${keyword}%`), id: Not(user.id) }]
        })

        const otherUsersWithFriendshipStatus = await Promise.all(otherUsers.map(async (otherUser) => {
            otherUser['friendshipInfo'] = await this.getFriendshipState(user.id, otherUser.id)
            return otherUser
        }))

        return otherUsersWithFriendshipStatus
    }

    private async getFriendshipState(userId: number, friendId: number): Promise<{ id: number, status: string; isRequesterUser: boolean; }> {
        const friendship = await this.friendshipRepository
            .findOne(
                {
                    where: [{ requesterUserId: userId, receiverUserId: friendId },
                    { requesterUserId: friendId, receiverUserId: userId }]
                }
            )
        if (!friendship) { return null }

        return { id: friendship.id, status: friendship.status, isRequesterUser: friendship.requesterUserId === userId }
    }

    async getFriendRequests(user: User) {
        const friendships = await this.friendshipRepository
            .createQueryBuilder('friendship')
            .select(['friendship.id', 'friendship.status', 'requesterUser.id', 'requesterUser.name', 'requesterUser.username'])
            .where('friendship.receiverUserId = :userId', { userId: user.id })
            .andWhere('friendship.status = :friendshipStatus', { friendshipStatus: FriendshipStatus.PENDING })
            .innerJoin('friendship.requesterUser', 'requesterUser')
            .getMany()

        return friendships.map(friendship => {
            return {
                id: friendship.requesterUser.id,
                ['name']: friendship.requesterUser.name,
                username: friendship.requesterUser.username,
                friendshipInfo: {
                    id: friendship.id,
                    status: friendship.status,
                    isRequesterUser: false
                }
            }
        })
    }

    async getNotifications(user: User) {
        return this.notificationRepository
            .createQueryBuilder('notification')
            .select([
                'notification.id',
                'notification.userId',
                'notification.type',
                'notification.seen',
                'notification.createdAt',
                'friendRequest.status',
                'friendRequest.createdAt',
                'requesterUser.id',
                'requesterUser.name',
                'requesterUser.username'
            ])
            .where('notification.userId = :userId', { userId: user.id })
            .innerJoin('notification.friendRequest', 'friendRequest')
            .innerJoin('friendRequest.requesterUser', 'requesterUser')
            .orderBy('notification.createdAt', 'DESC')
            .take(10)
            .getMany()

    }

    async markNotificationAsSeen(user: User, notificationsCount: number) {
        const notifications = await this.notificationRepository
            .find({ where: { userId: user.id }, take: notificationsCount, order: { createdAt: 'DESC' } });

        notifications.forEach(async (notification) => {
            notification.seen = true
            await this.notificationRepository.save(notification)
        })
    }

    async createFriendship(createFriendshipDto: CreateFriendshipDto) {

        const user = await this.userRepository.findOne({ where: { id: createFriendshipDto.requesterUserId } });
        const receiverUser = await this.userRepository.findOne({ where: { id: createFriendshipDto.receiverUserId } });

        if (!user || !receiverUser) { throw new HttpException('User not found', 404); }

        if (user.id === receiverUser.id) { throw new HttpException('Requester user id is the same with receiver user id', 400); }

        const existedFriendship = await this.friendshipRepository.findOne(
            {
                where: [
                    { requesterUserId: user.id, receiverUserId: receiverUser.id },
                    { requesterUserId: receiverUser.id, receiverUserId: user.id }
                ]
            });
        if (existedFriendship && existedFriendship.status !== FriendshipStatus.REJECTED) { throw new HttpException('Friendship already exists', 400); }

        //status rejected
        if (existedFriendship && existedFriendship.status === FriendshipStatus.REJECTED) {
            await this.friendshipRepository.remove(existedFriendship)
        }

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

    async createNotification(notificationType: NotificationType, notificationRelationship: Friendship) {
        const notification = new Notification()
        switch (notificationType) {
            case 'FRIEND REQUEST':
                notification.userId = notificationRelationship.receiverUserId
                notification.type = notificationType
                notification.friendRequest = notificationRelationship
        }
        const notificationData = await this.notificationRepository.save(notification)
        notificationData.friendRequest = await this.friendshipRepository.createQueryBuilder('friendship')
            .select([
                'friendship.id',
                'friendship.status',
                'friendship.requesterUserId',
                'friendship.receiverUserId',
                'requesterUser.name',
                'requesterUser.username',
                'friendship.createdAt', 'friendship.updatedAt'])
            .where('friendship.id = :friendshipId', { friendshipId: notificationData.friendRequest.id })
            .innerJoin('friendship.requesterUser', 'requesterUser')
            .getOne()

        return notificationData
    }
}
