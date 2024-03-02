import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FriendshipStatus } from "../social.enum";

@Entity()
export class Friendship {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    requesterUserId: number;

    @Column()
    receiverUserId: number;

    @ManyToOne(() => User, user => user.friendshipsRequested)
    requesterUser: number;

    @ManyToOne(() => User, user => user.friendshipsReceived)
    receiverUser: number;

    @Column()
    status: FriendshipStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

}