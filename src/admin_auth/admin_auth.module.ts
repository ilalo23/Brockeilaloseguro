import { Module } from '@nestjs/common';
import { AdminAuthService } from './admin_auth.service';
import { AdminAuthController } from './admin_auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Administration, AdministrationSchema } from './schemas/administration.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAdministrationStrategy } from './jwt-administration.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Administration.name, schema: AdministrationSchema },
    ]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ADMIN"),
        signOptions: {
          expiresIn: 28800,
        },
      }),
    }),
  ],
  providers: [AdminAuthService,  JwtAdministrationStrategy],
  controllers: [AdminAuthController],
  exports: [JwtAdministrationStrategy, PassportModule]
})
export class AdminAuthModule {}
