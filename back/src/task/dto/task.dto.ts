import { IsString } from "class-validator";

export class TaskDto {

    @IsString()
    title:string;

    @IsString()
    status:string;


    @IsString()
    image:string


    @IsString()
    userId: string;
}