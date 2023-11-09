import { Type } from 'class-transformer';
import {IsNumber, Min, IsOptional} from 'class-validator';


export class FilterProfitsDto {
    
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
}