import {  IsHexColor, IsOptional, IsString, IsUrl} from "class-validator";

export class CreateAssuranceDto {
    @IsString()
    readonly label: string;
    @IsString()
    readonly code: string;
    @IsOptional()
    @IsUrl()
    readonly uri: string;
    @IsString()
    readonly small_logo: string;
    @IsString()
    readonly normal_logo: string;
    @IsHexColor()
    readonly primary_color: string;
    @IsHexColor()
    readonly secondary_color: string;

}


