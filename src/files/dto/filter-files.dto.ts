import { Type } from 'class-transformer';
import {IsNumber, Min, IsOptional, IsEnum} from 'class-validator';


export class FilterFilesDto {
    
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly page: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(5)
    readonly limit?: number;

    @IsOptional()
    readonly name?: string;
    
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    readonly parent?: number;

}

