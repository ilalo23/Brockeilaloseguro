import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PopulateOptions } from "mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { JwtPayload } from "./jwt-payload.interface";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuthUserDto, CreateUserDto } from "./dto/create-user.dto";
import { Profile, ProfileDocument } from "./schemas/profile.schema";
import * as dayjs from "dayjs";
import "dayjs/locale/es";
import * as LocalizedFormat from "dayjs/plugin/localizedFormat";
import { generateSecureRandomNumber } from "src/helpers/helpers";
import EmailService from "src/mail/mail.service";
import {
  CodeRecovery,
  CodeRecoveryDocument,
} from "./schemas/code-recovery.schema";
dayjs.locale("es");
dayjs.extend(LocalizedFormat);

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    @InjectModel(CodeRecovery.name)
    private readonly codeModel: Model<CodeRecoveryDocument>
  ) {}

  async register(createUserDto: CreateUserDto): Promise<void> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 11);
      const newUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      const n = await newUser.save();
      const newProfile = new this.profileModel({
        ...createUserDto,
        user: n._id,
      });
      await newProfile.save();
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async login(
    authUserDto: AuthUserDto
  ): Promise<{ token: string; profile: any }> {
    const { email, password } = authUserDto;
    const user = await this.userModel.findOne({ email });
    if (user) {
      if (user.status === 3)
        throw new BadRequestException("Tu usuario se encuentra deshabilitado");
      if (await bcrypt.compare(password, user.password)) {
        const profile = await this.profileModel.findOne({ user: user._id });
        const payload = {
          _id: user._id,
          identification: profile.identification,
        };
        const token: string = this.jwtService.sign(payload);
        return {
          token,
          profile: {
            birthday: profile.birthday ?? "",
            city: profile.city,
            province: profile.province,
            phone: profile.phone,
            photo: profile.photo,
            firstname: profile.firstname,
            lastname: profile.lastname,
            email: user.email,
          },
        };
      } else
        throw new UnauthorizedException(
          "Por favor verifica tus datos e intenta nuevamente"
        );
    } else {
      throw new UnauthorizedException(
        "Por favor verifica tus datos e intenta nuevamente"
      );
    }
  }

  async generateCode(identification: string): Promise<any> {
    const user = await this.userModel.findOne({
      email: identification,
      status: 1,
    });
    if (user) {
      const validUntil = dayjs().add(5, "minute");
      const rndcode = generateSecureRandomNumber(6);
      const code = new this.codeModel({
        identification,
        validUntil,
        code: rndcode,
      });
      await code.save();
      // Event

      const data = {
        code: rndcode,
        dateEmail: dayjs().format("LL"),
      };
      await this.emailService.sendMail(
        user.email,
        "Recuperación de Contraseña",
        "ncode",
        data
      );

      return {
        ok: true,
      };
    } else throw new NotFoundException("No data");
  }

  async validateCode(code: string): Promise<{ accessToken: string }> {
    const validCode = await this.codeModel.findOne({ code, status: 0 });
    if (validCode) {
      await validCode.updateOne({
        update_at: new Date(),
        status: 1,
      });
      const diff = dayjs().diff(
        dayjs(validCode.created_at),
        "millisecond",
        true
      );
      if (diff <= 300000) {
        console.log("here in time");
        //send mail
        const profile = await this.userModel.findOne({
          email: validCode.identification,
        });
        const payload: JwtPayload = {
          identification: profile.email,
        };
        const accessToken: string = this.jwtService.sign(payload, {
          expiresIn: 120,
        });
        return { accessToken };
      }
    }

    throw new NotFoundException("No data");
  }

  async updatePassword(
    password: string,
    identification: string
  ): Promise<void> {
    const profile = await this.userModel.findOne({ identification });
    if (profile) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await profile.updateOne({
        password: hashedPassword,
        updated_at: new Date(),
      });
    } else throw new NotFoundException("Not found data");
  }

  async updateFCM(fcm: string, identification: string) {
    const profile = await this.profileModel.findOne({ identification });
    if (profile) {
      await profile.updateOne({
        fcm,
        updated_fcm: new Date(),
      });
    }
  }

  async getListOfConsultants() {
    const profiles = await this.profileModel.find().populate({
      path: "user",
    });
    return profiles;
  }
}
