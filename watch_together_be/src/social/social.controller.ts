import { Body, Controller, Delete, Get, HttpException, Logger, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { PermissionsGuard } from 'src/authentication/guards/permissions.guard';
import { Friendship } from './entities/friendship.entity';
import { GeneralPermissionTitle, SocialPermissionTitle } from 'src/authentication/guards/permission.enum';
import { SocialService } from './social.service';
import { BlockUserDto, CreateFriendshipDto, UpdateFriendshipStatusDto } from './social.interface';
import { NotificationGateway } from 'src/gateway/notification.gateway';
import { NotificationType } from 'src/user/user.interface';

@Controller('social')
export class SocialController {
    constructor(private socialService: SocialService, private notificationGateway: NotificationGateway) { }

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
        const notification = await this.socialService.createNotification(NotificationType.FRIEND_REQUEST, friendship)
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




}
