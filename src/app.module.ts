import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import { ProfitsModule } from "./profits/profits.module";
import { FilesModule } from "./files/files.module";
import { AssurancesModule } from "./assurances/assurances.module";
import { LearningModule } from "./learning/learning.module";
import { SalesModule } from "./sales/sales.module";
import { GeneralModule } from "./general/general.module";
import { AuthModule } from "./users_auth/auth.module";
import { AdminAuthModule } from "./admin_auth/admin_auth.module";
import { QuotesModule } from "./quotes/quotes.module";
import { ContractsModule } from "./contracts/contracts.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    ProfitsModule,
    FilesModule,
    AssurancesModule,
    LearningModule,
    SalesModule,
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: "aws",
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mysql",
          options: {
            encrypt: false,
            readOnlyIntent: true, //Only read data
          },
          autoLoadEntities: true,
          logging: ["query", "error"],
          host: configService.get("AWS_MYSQL_HOST"),
          port: parseInt(configService.get("AWS_MYSQL_PORT"), 10),
          username: configService.get("AWS_MYSQL_USER"),
          password: configService.get("AWS_MYSQL_PASSW"),
          database: configService.get("AWS_MYSQL_DB"),
        };
      },
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mssql",
          options: {
            encrypt: false,
            readOnlyIntent: true, //Only read data
          },
          //logger: "debug",
          autoLoadEntities: true,
          logging: ["query", "error"],
          host:
            configService.get("MSSQL_CORPO_HOST") +
            "\\" +
            configService.get("MSSQL_CORPO_INSTANCE"),
          port: parseInt(configService.get("MSSQL_CORPO_PORT"), 10),
          username: configService.get("MSSQL_CORPO_USER"),
          password: configService.get("MSSQL_CORPO_PASSW"),
          database: configService.get("MSSQL_CORPO_DB"),
        };
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      name: "files",
      useFactory: async (configService: ConfigService) => {
        return {
          type: "mssql",
          options: {
            encrypt: false,
            readOnlyIntent: true, //Only read data
          },
          autoLoadEntities: true,
          logging: ["query", "error"],
          host: configService.get("MSSQL_FILES_HOST"),
          port: parseInt(configService.get("MSSQL_FILES_PORT"), 10),
          username: configService.get("MSSQL_FILES_USER"),
          password: configService.get("MSSQL_FILES_PASSW"),
          database: configService.get("MSSQL_FILES_DB"),
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          uri: configService.get("MONGODB_URI"),
        };
      },
    }),
    GeneralModule,
    AuthModule,
    AdminAuthModule,
    QuotesModule,
    ContractsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
