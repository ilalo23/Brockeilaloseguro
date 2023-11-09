import { IsMongoId, IsString } from "class-validator";

export class CreateAssuranceApiDto {
    @IsMongoId()
    readonly assurance: string;
    @IsString()
    readonly uri: string;
    
}