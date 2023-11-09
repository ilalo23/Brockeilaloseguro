import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractsService } from "./contracts.service";
import { ContractsController } from "./contracts.controller";
import { AssuranceContract } from "./aws_entities/assurance_contract";
import { MongooseModule } from "@nestjs/mongoose";
import {
  Assurance,
  AssuranceSchema,
} from "src/general/schemas/assurance.schema";
import { ContractNotification, ContractNotificationSchema } from "./schemas/contract_notification.schema";
import { Profile, ProfileSchema } from "src/users_auth/schemas/profile.schema";

@Module({
  imports: [
    TypeOrmModule.forFeature([AssuranceContract], "aws"),

    MongooseModule.forFeature([
      { name: Assurance.name, schema: AssuranceSchema },
      { name: ContractNotification.name, schema: ContractNotificationSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [ContractsService],
  controllers: [ContractsController],
})
export class ContractsModule { }
