import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WatchRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string

    @Column()
    creatorUserId: number;

    @Column()
    movieId: number

    @Column()
    movieTitle: string

    @ManyToOne(() => User, user => user.createdRooms)
    creatorUser: User;

    @ManyToMany(() => User, user => user.invitedRooms)
    @JoinTable()
    invitedUsers: User[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
