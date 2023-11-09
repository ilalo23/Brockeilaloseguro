import { Controller, Post, Get, Query, Body } from '@nestjs/common';
import { FilterProfitsDto } from 'src/profits/dto/filter-profits.dto';
import { CreateChanelDto } from './dto/create-chanel.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { LearningService } from './learning.service';

@Controller('learning')
export class LearningController {
    constructor( private readonly _learningService: LearningService){}

    @Get('/chanels')
    async getChanels(@Query() filterChanelsDto: FilterProfitsDto) {
        return {
            ok: true,
            data: await this._learningService.getChanels(filterChanelsDto)
        }
    }

    @Get('/videos')
    async getVideos(@Query() filterVideosDto: FilterProfitsDto) {
        return {
            ok: true,
            data: await this._learningService.getVideos(filterVideosDto)
        }
    }

    @Post('/chanel')
    async registerChanel(@Body() createChanelDto: CreateChanelDto) {
        await  this._learningService.registerChanel(createChanelDto);
        
    }

    @Post('video')
    async registerVideo(@Body() CreateVideoDto: CreateVideoDto) {
        await this._learningService.registerVideo(CreateVideoDto);
    }
}
