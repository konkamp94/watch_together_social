import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/authentication/guards/auth.guard';
import { PermissionsGuard } from 'src/authentication/guards/permissions.guard';
import { Friendship } from './entities/friendship.entity';
import { GeneralPermissionTitle, SocialPermissionTitle } from 'src/authentication/guards/permission.enum';
import { SocialService } from './social.service';
import { BlockUserDto, CreateFriendshipDto, UpdateFriendshipStatusDto } from './social.interface';

@Controller('social')
export class SocialController {
    constructor(private socialService: SocialService) { }

    // add friendship
    @UseGuards(PermissionsGuard({ title: SocialPermissionTitle.CAN_CREATE_FRIENDSHIP, subject: Friendship }))
    @Post('friendship')
    async createFriendship(@Body() createFriendshipDto: CreateFriendshipDto) {
        return await this.socialService.createFriendship(createFriendshipDto);
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
}
