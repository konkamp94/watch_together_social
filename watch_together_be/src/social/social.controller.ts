import { Body, Controller, Delete, Get, HttpException, Logger, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { PermissionsGuard } from 'src/authentication/guards/permissions.guard';
import { Friendship } from './entities/friendship.entity';
import { GeneralPermissionTitle, SocialPermissionTitle } from 'src/authentication/guards/permission.enum';
import { SocialService } from './social.service';
import { BlockUserDto, CreateFriendshipDto, CreateWatchRoomDto, UpdateFriendshipStatusDto } from './social.interface';
import { NotificationGateway } from 'src/gateway/notification.gateway';
import { NotificationType } from 'src/user/user.interface';
import { SharedService } from 'src/shared/shared.service';
import { Notification } from './entities/notification.entity';

@Controller('social')
export class SocialController {
    constructor(private socialService: SocialService,
        private notificationGateway: NotificationGateway,
        private sharedService: SharedService) { }

    @UseGuards(AuthGuard)
    @Get('search-friends')
    async searchFriendByUsernameOrName(@Req() request, @Query() params) {
        return this.socialService.searchFriendByUsernameOrName(request['user'], params?.search)
    }

    @UseGuards(AuthGuard)
    @Get('friend-requests')
    async getFriendRequests(@Req() request) {
        return await this.socialService.getFriendRequests(request['user'])
    }

    // add friendship
    @UseGuards(PermissionsGuard({ title: SocialPermissionTitle.CAN_CREATE_FRIENDSHIP, subject: Friendship }))
    @Post('friendship')
    async createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
        const friendship = await this.socialService.createFriendship(createFriendshipDto);
        const notification = (await this.socialService.createNotification(NotificationType.FRIEND_REQUEST, friendship) as Notification)
        this.notificationGateway.sendNotification(notification)
        return friendship
    }

    @UseGuards(PermissionsGuard({ title: SocialPermissionTitle.CAN_UPDATE_FRIENDSHIP_STATUS, subject: Friendship }))
    @Patch('friendship/:id/status')
    async updateFriendshipStatus(@Body() updateFriendshipStatusDto: UpdateFriendshipStatusDto, @Param('id') id: string) {
        return await this.socialService.updateFriendshipStatus(parseInt(id), updateFriendshipStatusDto);
    }

    @UseGuards(PermissionsGuard({ title: SocialPermissionTitle.CAN_DELETE_FRIENDSHIP, subject: Friendship }))
    @Delete('friendship/:id')
    async deleteFriendship(@Param('id') id: number) {
        return await this.socialService.deleteFriendship(id);
    }

    @UseGuards(PermissionsGuard({ title: SocialPermissionTitle.CAN_BLOCK_USER, subject: Friendship }))
    @Post('blocked-user')
    async blockUser(@Body() blockUserDto: BlockUserDto) {
        return this.socialService.blockUser(blockUserDto);
    }

    @UseGuards(AuthGuard)
    @Get('/notifications')
    async getNotifications(@Req() request) {
        return await this.socialService.getNotifications(request['user'])
    }

    @UseGuards(AuthGuard)
    @Get('/notifications/mark-as-seen')
    async markNotificationsAsSeen(@Req() request, @Query() params) {
        if (!params.notificationsCount) { throw new HttpException('Pass notificationsCount param', 400) }
        await this.socialService.markNotificationAsSeen(request['user'], params.notificationsCount)
        return { message: 'Latest Notifications marked as seen' }
    }

    @UseGuards(AuthGuard)
    @Post('/watch-room')
    async createWatchRoom(@Req() request, @Body() createWatchRoomBody: CreateWatchRoomDto) {
        const user = request['user']
        const tmdbProxyBody = {
            uri: `/movie/${createWatchRoomBody.movieId}`,
            method: 'GET'
        }

        const tmdbResponse = await this.sharedService.tmdbProxy(user, tmdbProxyBody);
        createWatchRoomBody['movieTitle'] = tmdbResponse.original_title

        const watchRoom = await this.socialService.createWatchRoom(createWatchRoomBody, user)
        const notifications = (await this.socialService.createNotification(NotificationType.WATCH_ROOM_INVITE, watchRoom) as Notification[])
        notifications.forEach(notification => this.notificationGateway.sendNotification(notification))

        return watchRoom

    }




}
