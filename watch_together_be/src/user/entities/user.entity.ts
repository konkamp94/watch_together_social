import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Friendship } from 'src/social/entities/friendship.entity';
import { BlockedUser } from './blocked-user.entity';
import { Notification } from '../../social/entities/notification.entity';
import { WatchRoom } from 'src/social/entities/watch-room.entity';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    tmdbId: number;

    // TODO is better to be stored in redis
    @Column({ nullable: true })
    tmdbSessionId: string;

    @Column({ nullable: true, default: null })
    refreshToken: string;

    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];

    @OneToMany(() => Friendship, friendship => friendship.requesterUser)
    friendshipsRequested: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.receiverUser)
    friendshipsReceived: Friendship[];

    @OneToMany(() => WatchRoom, watchRoom => watchRoom.creatorUser)
    createdRooms: WatchRoom

    @ManyToMany(() => WatchRoom, watchRoom => watchRoom.invitedUsers)
    invitedRooms: WatchRoom[]

    @OneToMany(() => BlockedUser, blockedUser => blockedUser.blockerUser)
    blockedUsers: BlockedUser[];

    @OneToMany(() => BlockedUser, blockedUser => blockedUser.blockedUser)
    blockedByUsers: BlockedUser[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // authorization logic
    get ownerId() {
        return this.id;
    }
}