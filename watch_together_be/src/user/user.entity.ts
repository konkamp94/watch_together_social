import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}