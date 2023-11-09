import { IsArray } from "class-validator";
import { Type } from 'class-transformer';
export class CreateProfitsDto {
    @IsArray()
    readonly profits:Array<Profit>
}

interface Profit {
    user_id: string;
    customer: string;
    num_contract: string;
    assurance: string;
    type_assurance: string;
    profit: string;
    reason: string;
}