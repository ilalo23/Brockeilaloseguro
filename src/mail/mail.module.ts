import { Module } from '@nestjs/common';
import EmailService from './mail.service';
//import { ConfigModule } from '@nestjs/config';

@Module({
  //imports: [ConfigModule],
  controllers: [],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule { }
