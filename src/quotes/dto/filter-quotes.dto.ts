import { Type } from 'class-transformer';
import { IsNumber, Min, IsOptional, IsString } from 'class-validator';


export class FilterQuotesDto {


    @IsString()
    readonly uri: string;

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