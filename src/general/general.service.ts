import { Injectable } from '@nestjs/common';
import { Model, PopulateOptions } from 'mongoose';
import { FilterProfitsDto } from 'src/profits/dto/filter-profits.dto';
import { CreateAssuranceDto } from './dto/create-assurance.dto';
import { Assurance } from './schemas/assurance.schema';
import { ResponseService } from 'src/interfaces/response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAssuranceServiceDto } from './dto/create-assurance-service.dto';
import { AssuranceService } from './schemas/assurance-service.schema';
import { CreateAssuranceApiDto } from './dto/create-assurance-api.dto';
import { AssuranceApi } from './schemas/assurance-api.schema';

@Injectable()
export class GeneralService {
    constructor(
        @InjectModel(Assurance.name)
        private readonly assuranceModel: Model<Assurance>,
        @InjectModel(AssuranceService.name)
        private readonly assuranceServiceModel: Model<AssuranceService>,
        @InjectModel(AssuranceApi.name)
        private readonly assuranceApiModel: Model<AssuranceApi>,
    ) { }

    //Register assurance
    async registerAssurance(createAssuranceDto: CreateAssuranceDto): Promise<void> {
        const newAssurance = new this.assuranceModel(createAssuranceDto);
        await newAssurance.save();
    }

    //RegisterService
    async registerAssuranceService(createAssuranceServiceDto: CreateAssuranceServiceDto): Promise<void> {
        const newService = new this.assuranceServiceModel(createAssuranceServiceDto);
        await newService.save();
    }

    // Register Assurance APi
    async registerAssuranceApi(createAssuranceApiDto: CreateAssuranceApiDto): Promise<void> {
        const newApi = new this.assuranceApiModel(createAssuranceApiDto);
        await newApi.save();
    }

    // Get active assurances
    async getAssurances(filterAssurancesDto: FilterProfitsDto): Promise<ResponseService> {
        let filter = { status: true };
        if (filterAssurancesDto.name) {
            filter["label"] = filterAssurancesDto.name;
        }

        const query = this.assuranceModel.find(filter)
            .sort({ created_at: 1 })
            .skip(filterAssurancesDto.page === 1 ? 0 : ((filterAssurancesDto.page - 1) * filterAssurancesDto.limit))
            .limit(filterAssurancesDto.limit)
        const total = await this.assuranceModel.count(filter);
        return {
            docs: await query,
            totalDocs: total,
            totalPages: Math.ceil(total / filterAssurancesDto.limit),
            currentPage: filterAssurancesDto.page,
            hasNextPage: total === (filterAssurancesDto.page * filterAssurancesDto.limit) || (filterAssurancesDto.page * filterAssurancesDto.limit) > total ? false : true
        }
    }

    async getAssurancesServices(filterServicesDto: FilterProfitsDto): Promise<ResponseService> {

        let filter = {
            '$or': [
                { status: 1 },
                { status: 2 }
            ]
        }

        const populate: PopulateOptions = {
            path: 'assurance',
            select: ['label', 'code', 'small_logo', 'normal_logo', 'primary_color', 'secondary_color']
            //strictPopulate: false
        }
        const query = this.assuranceServiceModel.find(filter)
            .populate(populate)
            .sort({ created_at: 1 })
            .skip(filterServicesDto.page === 1 ? 0 : ((filterServicesDto.page - 1) * filterServicesDto.limit))
            .limit(filterServicesDto.limit)

        // query.populate(populate)
        const total = await this.assuranceServiceModel.count(filter);
        return {
            docs: await query,
            totalDocs: total,
            totalPages: Math.ceil(total / filterServicesDto.limit),
            currentPage: filterServicesDto.page,
            hasNextPage: total === (filterServicesDto.page * filterServicesDto.limit) || (filterServicesDto.page * filterServicesDto.limit) > total ? false : true
        }
    }

    async getAssurancesApis(): Promise<ResponseService> {
        const populate: PopulateOptions = {
            path: 'assurance',
            select: { code: 1, _id: 1, small_logo: 1, normal_logo: 1, primary_color: 1, secondary_color: 1 }
            //strictPopulate: false
        };
        const query = this.assuranceApiModel.find({ status: 1 }, { uri: 1 })
            .populate(populate)
            .sort({ 'assurance.code': 1 });
        const total = await this.assuranceApiModel.count({ status: 1 });
        return {
            docs: await query,
            totalDocs: total,
            totalPages: 1,
            currentPage: 1,
            hasNextPage: false
        }

    }

}
