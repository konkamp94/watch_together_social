import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class BlockedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.blockedUsers)
    blockerUser: User;

    @ManyToOne(() => User, user => user.blockedByUsers)
    blockedUser: User;

    @Column()
    blockerUserId: number;

    @Column()
    blockedUserId: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}   
