import { Module } from '@nestjs/common';
import { GeneralService } from './general.service';
import { GeneralController } from './general.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Assurance, AssuranceSchema } from './schemas/assurance.schema';
import { AssuranceService, AssuranceServiceSchema } from './schemas/assurance-service.schema';
import { AssuranceApi, AssuranceApiSchema } from './schemas/assurance-api.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Assurance.name, schema: AssuranceSchema },
      { name: AssuranceService.name, schema: AssuranceServiceSchema },
      { name: AssuranceApi.name, schema: AssuranceApiSchema },
    ]),
  ],
  providers: [GeneralService],
  controllers: [GeneralController]
})
export class GeneralModule {}
