import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets"
import { Server, Socket } from 'socket.io'
import { Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WatchRoom } from "src/social/entities/watch-room.entity";

@WebSocketGateway({
    namespace: 'socket.io/watch-room',
    cors: { origin: '*' }
})
export class WatchRoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server
    rooms: { [roomCode: string]: { client: Socket, userId: string }[] }
    // clientId: roomCode
    mapClientIdToRoomCode: { [clientId: string]: string }

    clients: { [userId: string]: Socket }
    mapClientIdToUserId: { [clientId: string]: string }

    constructor(protected jwtService: JwtService,
        protected configService: ConfigService,
        @InjectRepository(WatchRoom) private watchRoomRepository: Repository<WatchRoom>) {
        this.rooms = {}
        this.mapClientIdToRoomCode = {}
        this.clients = {}
        this.mapClientIdToUserId = {}
    }

    async handleConnection(client: Socket) {
        const token = client.handshake.query['token'] as string
        const roomCode = client.handshake.query['code'] as string

        const authToken = token ?? undefined;
        let payload: any

        try {
            payload = await this.jwtService.verifyAsync(
                authToken,
                {
                    secret: this.configService.get<string>('JWT_SECRET'),
                }
            );
            this.clients[payload.userId] = client
            this.mapClientIdToUserId[client.id] = payload.userId.toString()
        } catch (error) {
            // Logger.warn(this.jwtService.verifyAsync(authToken, { secret: this.configService.get<string>('JWT_SECRET') }))
            Logger.error(error, 'AuthGuard');
            client.disconnect()
            return;
        }

        if (!roomCode) {
            Logger.error('You have to pass a code in the params', 'AuthGuard');
            client.disconnect()
            return;
        }
        const watchRoom = await this.watchRoomRepository.findOne({ where: { code: roomCode }, relations: ['invitedUsers'] })
        if (!watchRoom) {
            Logger.error('There is no room with this code', 'AuthGuard');
            client.disconnect()
            return;
        }

        if ((watchRoom.creatorUserId.toString() !== this.mapClientIdToUserId[client.id]) && !watchRoom.invitedUsers.map(user => user.id.toString()).includes(this.mapClientIdToUserId[client.id])) {
            Logger.error('You have not permission to connect to this room', 'AuthGuard');
            client.disconnect()
            return;
        }


        if (this.rooms[roomCode]) {
            // clean the previous instance of the user's socket if exists
            const connectedRoomUsers = this.rooms[roomCode]
            this.rooms[roomCode] = connectedRoomUsers.filter((connectedRoomUser) => {
                if (connectedRoomUser.userId === payload.userId) {
                    delete this.clients[connectedRoomUser.userId]
                    delete this.mapClientIdToUserId[connectedRoomUser.client.id]
                    delete this.mapClientIdToRoomCode[connectedRoomUser.client.id]
                    return false
                } else {
                    return true
                }
            })
            // add new instance to room
            this.rooms[roomCode].push({ client: client, userId: payload.userId })
        } else {
            this.rooms[roomCode] = []
            this.rooms[roomCode].push({ client: client, userId: payload.userId })
        }
        this.mapClientIdToRoomCode[client.id] = roomCode

    }

    handleDisconnect(client: Socket) {
        const userId = this.mapClientIdToUserId[client.id]
        delete this.clients[userId]
        delete this.mapClientIdToUserId[client.id]

        const roomCode = this.mapClientIdToRoomCode[client.id]
        if (this.rooms[roomCode]) {
            this.rooms[roomCode] = this.rooms[roomCode].filter(userIdToClient => userIdToClient[userId] !== client)
        }
        delete this.mapClientIdToRoomCode[client.id]
    }

    @SubscribeMessage('events')
    onEvent(@MessageBody() body, @ConnectedSocket() client: Socket) {
        const roomCode = this.mapClientIdToRoomCode[client.id]
        const connectedRoomUsers = this.rooms[roomCode]
        connectedRoomUsers?.forEach(user => {
            Logger.log('---------------------------')
            Logger.log('CLIENT_ID', user.client.id)
            Logger.log('USER_ID', user.userId)
        })
        Logger.log(body)
        switch (body.type) {
            case ('sync-new-user-request'):
                for (let i = 0; i < connectedRoomUsers?.length; i++) {
                    let user = connectedRoomUsers[i]
                    if (user.client !== client) {
                        // Logger.log('send request to another user')
                        // Logger.log('called user id', user.userId)
                        user.client.emit('events', JSON.stringify(body));
                    }
                }
                break;
            case ('sync-new-user-response'):
                const newUser = connectedRoomUsers?.find((user) => user.userId === body.newUserId)
                // Logger.log('send response to the new user')
                // Logger.log('newUser', newUser.userId)
                if (newUser) {
                    newUser.client.emit('events', JSON.stringify(body))
                }
                break;
            default:
                connectedRoomUsers.forEach(connectedRoomUser => {
                    Logger.log(connectedRoomUser.client.id)
                    Logger.log(connectedRoomUser.userId)
                    if (connectedRoomUser.client !== client) {
                        Logger.log(connectedRoomUser.client.id)
                        Logger.log(connectedRoomUser.userId)
                        connectedRoomUser.client.emit('events', JSON.stringify(body))
                    }
                    return body
                })
        }
    }

}