import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import {
  Administration,
  AdministrationDocument,
} from "./schemas/administration.schema";

@Injectable()
export class JwtAdministrationStrategy extends PassportStrategy(
  Strategy,
  "administration"
) {
  constructor(
    @InjectModel(Administration.name)
    private readonly userModel: Model<AdministrationDocument>,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("JWT_ADMIN"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
}
