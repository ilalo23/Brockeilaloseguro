import { IsMongoId, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";

export class CreateChanelDto {
    @IsString()
    readonly name: string;
    @IsOptional()
    @IsString()
    readonly logo: string;
    @IsMongoId()
    created_by: mongoose.Types.ObjectId;
}