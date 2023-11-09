import { Module } from '@nestjs/common';
import { ProfitsService } from './profits.service';
import { ProfitsController } from './profits.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { ProfitVersion, ProfitVersionSchema } from './schemas/profit-version.schema';
import { Profit, ProfitSchema } from './schemas/profit.schema';
import { AuthModule } from 'src/users_auth/auth.module';

import { Profile, ProfileSchema } from 'src/users_auth/schemas/profile.schema';
import { Assurance, AssuranceSchema } from 'src/general/schemas/assurance.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProfitVersion.name, schema: ProfitVersionSchema },
      { name: Profit.name, schema: ProfitSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Assurance.name, schema: AssuranceSchema },
    ]),
    AuthModule
  ],
  providers: [ProfitsService],
  controllers: [ProfitsController]
})
export class ProfitsModule {}
