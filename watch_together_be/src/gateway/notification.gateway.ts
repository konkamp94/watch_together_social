import { Logger, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { Notification } from "src/social/entities/notification.entity";
@WebSocketGateway({
    namespace: 'notifications',
    cors: { origin: '*' }
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    // userId: client object
    clients: {}
    // clientId: userId
    mapClientIdToUserId: {}

    constructor(protected jwtService: JwtService, protected configService: ConfigService) {
        this.clients = {}
        this.mapClientIdToUserId = {}
    }

    async handleConnection(client: Socket) {
        const { authorization } = client.handshake.headers
        const [type, token] = authorization?.split(' ') ?? [];
        const authToken = type === 'Bearer' ? token : undefined;

        try {
            const payload = await this.jwtService.verifyAsync(
                authToken,
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                }
            );
            this.clients[payload.userId] = client
            this.mapClientIdToUserId[client.id] = payload.userId
        } catch (error) {
            Logger.warn(this.jwtService.verifyAsync(authToken, { secret: this.configService.get<string>('JWT_SECRET') }))
            Logger.error(error, 'AuthGuard');
            client.disconnect()
        }

    }

    handleDisconnect(client: any) {
        const userId = this.mapClientIdToUserId[client.id]
        delete this.clients[userId]
        delete this.mapClientIdToUserId[client.id]
    }

    // @SubscribeMessage('event')
    // onEvent(@MessageBody() body, @ConnectedSocket() socket: Socket) {
    //     Logger.log(body)
    //     return body
    // }

    sendNotification(notification: Notification) {
        Logger.log(notification.userId, 'notification user id')
        const userId = notification.userId
        const client = this.clients[userId]
        Logger.log(JSON.stringify(notification))
        Logger.log(client.id)
        if (client) {
            client.emit('notifications', JSON.stringify(notification))
        }
    }

}