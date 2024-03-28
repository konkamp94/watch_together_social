import { User } from "../user/entities/user.entity";

export interface TmdbProxyDto {
    uri: string;
    method: string;
    body?: any;
    headers?: any;
}

export interface RequestWithUser extends Request {
    user: User;
}