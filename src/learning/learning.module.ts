import { Module } from '@nestjs/common';
import { LearningService } from './learning.service';
import { LearningController } from './learning.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chanel, ChanelSchema } from './schemas/chanel.schema';
import { Video, VideoSchema } from './schemas/video.schema';



@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chanel.name, schema: ChanelSchema },
      { name: Video.name, schema: VideoSchema },
    ]),
    
  ],
  providers: [LearningService],
  controllers: [LearningController]
})
export class LearningModule {}
