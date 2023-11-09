import { IsMongoId, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateVideoDto {
    @IsMongoId()
    readonly chanel: mongoose.Types.ObjectId;
    @IsString()
    readonly title: string;
    @IsString()
    readonly url: string;
    @IsString()
    readonly description: string;
    @IsMongoId()
    created_by: mongoose.Types.ObjectId;
}