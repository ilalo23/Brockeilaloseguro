import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "users") {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService
  ) {
    super({
      secretOrKey: configService.get("JWT_USER"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    // console.log(payload)
    const { identification } = payload;

    const user = await this.userModel.findOne({ identification, status: 1 });
    if (!user) {
      throw new UnauthorizedException();
    }
    const {
      _id,
      email,
      password,
      status,
      updated_by,
      created_at,
      updated_at,
    } = user;
    return {
      _id,
      email,
      password,
      status,
      updated_by,
      created_at,
      updated_at,
      identification,
    };
  }
}
