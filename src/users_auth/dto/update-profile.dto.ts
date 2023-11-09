import { IsMongoId } from "class-validator";

export class UpdateProfileUserDto {
  @IsMongoId()
  readonly _id: string;
  readonly birthday: string;
  readonly province: string;
  readonly city: string;
}
