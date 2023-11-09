import { IsEnum, IsMongoId, IsString, IsUrl } from "class-validator";

enum TypesAssuranceService {
    LIGHT_CAR = "LIGHT_CAR",
    HEAVY_CAR = "HEAVY_CAR",
    HOME = "HOME",
    MEDICINE = "MEDICINE",
    LIFE = "LIFE"
}

export class CreateAssuranceServiceDto {
    @IsMongoId()
    readonly assurance: string;
    @IsUrl()
    readonly url: string;
    @IsString()
    readonly label: string;
    @IsEnum(TypesAssuranceService)
    readonly type: TypesAssuranceService   
}