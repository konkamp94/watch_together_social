import { CanActivate, ExecutionContext, HttpException, Inject, Logger, Request, Type, mixin } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { DataSource, In, Repository } from "typeorm"; import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { Permission } from './permission.interface';
import { GeneralPermissionTitle, SocialPermissionTitle } from "./permission.enum";
import { FriendshipStatus } from "src/social/social.enum";
import { BlockedUser } from "src/user/entities/blocked-user.entity";
import { WatchRoom } from "src/social/entities/watch-room.entity";

export const PermissionsGuard = (permission: Permission): Type<CanActivate> => {

    class PermissionsGuardMixin extends AuthGuard {
        @Inject()
        protected jwtService: JwtService;
        @Inject()
        protected configService: ConfigService;

        private permissionTitleMapToLogic = {}

        constructor(@InjectDataSource() private dataSource: DataSource, jwtService: JwtService, configService: ConfigService,
            @InjectRepository(User) protected userRepository: Repository<User>) {
            super(jwtService, configService, userRepository);
            this.permissionTitleMapToLogic = {
                [GeneralPermissionTitle.IS_OWNER]: (user: User, request: any) => this.isOwner(user, request),
                [SocialPermissionTitle.CAN_CREATE_FRIENDSHIP]: (user: User, request: any) => this.canCreateFriendship(user, request),
                [SocialPermissionTitle.CAN_UPDATE_FRIENDSHIP_STATUS]: (user: User, request: any) => this.canUpdateFriendshipStatus(user, request),
                [SocialPermissionTitle.CAN_DELETE_FRIENDSHIP]: (user: User, request: any) => this.canDeleteFriendship(user, request),
                [SocialPermissionTitle.CAN_BLOCK_USER]: (user: User, request: any) => this.canBlockUser(user, request),
                [SocialPermissionTitle.IS_INVITED_OR_CREATOR_WATCH_ROOM]: (user: User, request: any) => this.isInvitedOrCreatorWatchRoom(user, request),
            }
        }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            await super.canActivate(context);
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            // run permission logic
            if (!await this.permissionTitleMapToLogic[permission.title](user, request)) {
                throw new HttpException('Permission denied', 403);
            };

            return true;
        }

        // permissions logic functions
        private async isOwner(user: User, request: any): Promise<boolean> {
            const object = await this.getObject(request.params.id);
            return object.ownerId === user.id;
        }

        private async canCreateFriendship(user: User, request: any): Promise<boolean> {
            const requesterUserId = request.body.requesterUserId;
            const receiverUserId = request.body.receiverUserId;

            const blockedRelationshipExists = await this.dataSource.getRepository(BlockedUser)
                .exists({
                    where: [
                        { blockerUserId: receiverUserId, blockedUserId: requesterUserId },
                        { blockerUserId: requesterUserId, blockedUserId: receiverUserId }
                    ]
                })

            if (blockedRelationshipExists) {
                throw new HttpException('Permission Denied. Blocked Relationship', 403);
            }
            return requesterUserId === user.id;
        }

        private async canUpdateFriendshipStatus(user: User, request: any): Promise<boolean> {
            const friendship = await this.getObject(request.params.id);
            const friendshipStatus = friendship.status;
            const isReceiver = friendship.receiverUserId === user.id;

            // not owner of the friendship
            if (!isReceiver) {
                throw new HttpException('Permission Denied', 403);
            }

            if (friendshipStatus === FriendshipStatus.ACCEPTED || friendshipStatus === FriendshipStatus.REJECTED) {
                throw new HttpException('Permission Denied. You are not allowed to modify an Accepted or Rejected Friendship', 403);
            }

            return true;
        }


        private async canDeleteFriendship(user: User, request: any): Promise<boolean> {
            const friendship = await this.getObject(request.params.id);

            const isOwner = friendship.requesterUserId === user.id || friendship.receiverUserId === user.id;
            const isReceiver = friendship.receiverUserId === user.id;

            if (!isOwner) {
                throw new HttpException('Permission Denied. You are not owner', 403);
            }
            if (friendship.status === FriendshipStatus.REJECTED) {
                throw new HttpException('Permission Denied. You are not allowed to delete a Rejected Friendship', 403);
            } else if (isReceiver && friendship.status === FriendshipStatus.PENDING) {
                throw new HttpException('Permission Denied. You are not allowed to delete a Pending Friendship as a receiver', 403);
            }

            return true
        }

        private async canBlockUser(user: User, request: any): Promise<boolean> {
            const blockerUserId = request.body.blockerUserId;
            return blockerUserId === user.id;
        }

        private async isInvitedOrCreatorWatchRoom(user: User, request: any): Promise<boolean> {
            const code = request.params.code
            const watchRoom = await this.dataSource.getRepository(WatchRoom).findOne({ where: { code }, relations: { invitedUsers: true } })
            if (!watchRoom) {
                throw new HttpException('Object not found', 404);
            }

            if (watchRoom.invitedUsers.map((invitedUser) => invitedUser.id).includes(user.id) || watchRoom.creatorUserId === user.id) {
                return true
            }

            return false
        }

        // helper functions
        private async getObject(id: string, relations: {} = {}) {
            const object = await this.dataSource.getRepository(permission.subject).findOne({ where: { id }, relations: relations });
            if (!object) {
                throw new HttpException('Object not found', 404);
            }
            return object;
        }

    }

    return mixin(PermissionsGuardMixin);
}

