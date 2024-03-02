import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Friendship } from 'src/social/entities/friendship.entity';
import { BlockedUser } from './blocked-user.entity';

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

    @OneToMany(() => Friendship, friendship => friendship.requesterUser)
    friendshipsRequested: Friendship[];

    @OneToMany(() => Friendship, friendship => friendship.receiverUser)
    friendshipsReceived: Friendship[];

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