import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseService } from 'src/interfaces/response.interface';
import { FilterProfitsDto } from 'src/profits/dto/filter-profits.dto';
import { CreateChanelDto } from './dto/create-chanel.dto';
import { CreateVideoDto } from './dto/create-video.dto';
import { Chanel } from './schemas/chanel.schema';
import { Video } from './schemas/video.schema';

@Injectable()
export class LearningService {
    constructor(
        @InjectModel(Chanel.name)
        private readonly chanelModel: Model<Chanel>,
        @InjectModel(Video.name)
        private readonly videoModel: Model<Video>
    ) { }

    async getChanels(filterChanelsDto: FilterProfitsDto): Promise<ResponseService> {
        let filter = { status: true };
        if (filterChanelsDto.name) {
            filter["$or"] = [
                { name: { $regex: new RegExp(filterChanelsDto.name, "i") } },
            ];
        }
        const query = this.chanelModel.find(filter)
            .sort({ created_at: 1 })
            .skip(filterChanelsDto.page === 1 ? 0 : ((filterChanelsDto.page - 1) * filterChanelsDto.limit))
            .limit(filterChanelsDto.limit)
        const total = await this.chanelModel.count(filter);
        return {
            docs: await query,
            totalDocs: total,
            totalPages: Math.ceil(total / filterChanelsDto.limit),
            currentPage: filterChanelsDto.page,
            hasNextPage: total === (filterChanelsDto.page * filterChanelsDto.limit) || (filterChanelsDto.page * filterChanelsDto.limit) > total ? false : true
        }
    }

    async getVideos(filterVideosDto: FilterProfitsDto): Promise<ResponseService> {
        let filter = { status: true };
        if (filterVideosDto.name) {
            filter["$or"] = [
                { name: { $regex: new RegExp(filterVideosDto.name, "i") } },
            ];
        }
        const query = this.videoModel.find(filter)
            .sort({ created_at: 1 })
            .skip(filterVideosDto.page === 1 ? 0 : ((filterVideosDto.page - 1) * filterVideosDto.limit))
            .limit(filterVideosDto.limit)
        const total = await this.videoModel.count(filter);
        return {
            docs: await query.populate('chanel',['name', 'logo']),
            totalDocs: total,
            totalPages: Math.ceil(total / filterVideosDto.limit),
            currentPage: filterVideosDto.page,
            hasNextPage: total === (filterVideosDto.page * filterVideosDto.limit) || (filterVideosDto.page * filterVideosDto.limit) > total ? false : true
        }
    }

    async registerChanel(createChanelDto: CreateChanelDto):Promise<void> {
       try {
        const newChanel = new this.chanelModel({
            ...createChanelDto
        });
        await newChanel.save();
       } catch (error) {
            throw new InternalServerErrorException();
       }    
    }

    async registerVideo(createVideoDto: CreateVideoDto):Promise<void> {
        try {
         const newVideo = new this.videoModel({
             ...createVideoDto
         });
         await newVideo.save();
        } catch (error) {
             throw new InternalServerErrorException();
        }    
     }
}
