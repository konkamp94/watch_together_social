import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { NotificationType } from "../../user/user.interface";
import { Friendship } from "src/social/entities/friendship.entity";
import { WatchRoom } from "./watch-room.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.notifications)
    user: User

    // when i add proposals and rooms invitations maybe i should use polymorphic relationships
    @Column()
    type: NotificationType

    @OneToOne(() => Friendship, { nullable: true, onDelete: 'CASCADE' })
    @JoinColumn()
    friendRequest: Friendship

    @ManyToOne(() => WatchRoom, { nullable: true, onDelete: 'CASCADE' })
    watchRoom: WatchRoom


    @Column({ default: false })
    seen: boolean

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}