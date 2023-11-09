import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsMongoId,
} from "class-validator";

/*export class CreateUserDto {
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly password: string;
}
*/
export class CreateUserDto {
  @IsNotEmpty()
  readonly firstname: string;
  @IsNotEmpty()
  readonly lastname: string;
  @Matches(/[0-9]{10}/)
  readonly identification: string;
  @IsEmail()
  readonly email: string;
  @Matches(/[09]{2}[0-9]{8}/)
  readonly phone: string;
  @IsNotEmpty()
  readonly password: string;
}

import { PartialType } from "@nestjs/mapped-types";
export class AuthUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsMongoId()
  _id: string;
}
