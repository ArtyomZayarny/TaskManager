import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
export interface AuthModel extends Base {
}
export declare class AuthModel extends TimeStamps {
    email: string;
    passwordHash: string;
}
