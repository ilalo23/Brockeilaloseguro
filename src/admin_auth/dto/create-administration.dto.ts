import { IsEnum, IsOptional, IsString, Matches } from "class-validator";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
export class CreateAdministrationDto {
  @IsString()
  readonly username: string;
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/, {
    message: "The password doesnt match with system rules",
  })
  readonly password: string;
  @IsEnum(Role)
  readonly role: Role;
  @IsOptional()
  readonly status: number;
}

import { PartialType } from "@nestjs/mapped-types";

export class AuthAdministrationDto extends PartialType(
  CreateAdministrationDto
) {
  @IsOptional()
  _id: string;
}
