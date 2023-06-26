import { IsString } from "class-validator";

export class TaskDto {

    @IsString()
    title:string;

    @IsString()
    status:string;


    image?: { bucketId:string,fileId:string}


    @IsString()
    userId: string;
}