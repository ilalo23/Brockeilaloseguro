import { Injectable,   UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from "bcrypt";
import { Model } from 'mongoose';
import { JwtPayload } from 'src/users_auth/jwt-payload.interface';
import { AuthAdministrationDto, CreateAdministrationDto } from './dto/create-administration.dto';
import { Administration, AdministrationDocument } from './schemas/administration.schema';

@Injectable()
export class AdminAuthService {
    constructor(
        @InjectModel(Administration.name)
        private readonly administrationModel:Model<AdministrationDocument>,
        private readonly jwtService: JwtService
        ){}
    async signup(
        createAdministrationDto: CreateAdministrationDto,
        user: Administration
      ): Promise<void> {
        const hashedPassword = await bcrypt.hash(
          createAdministrationDto.password,
          10
        );
        const createdUser = new this.administrationModel({
          ...createAdministrationDto,
          password: hashedPassword,
          /*created_by: user._id,
          updated_by: user._id,*/
        });
        //const createdUser = new this.administrationModel(createAdministrationDto);
        await createdUser.save();
      }
    
      async signIn(
        authUserDto: AuthAdministrationDto
      ): Promise<{ accessToken: string }> {
        const { username, password } = authUserDto;
        //console.log(identification, password);
        const user = await this.administrationModel.findOne({
          username,
          status: 1,
        });
        if (user && (await bcrypt.compare(password, user.password))) {
          const payload: JwtPayload = { username };
          const accessToken: string = this.jwtService.sign(payload);
          return { accessToken };
        } else {
          throw new UnauthorizedException("Please check your credentials");
        }
      }
}
