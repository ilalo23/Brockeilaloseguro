import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { FilterProfitsDto } from 'src/profits/dto/filter-profits.dto';
import { CreateAssuranceApiDto } from './dto/create-assurance-api.dto';
import { CreateAssuranceServiceDto } from './dto/create-assurance-service.dto';
import { CreateAssuranceDto } from './dto/create-assurance.dto';
import { GeneralService } from './general.service';

@Controller('general')
export class GeneralController {
    constructor(
        private readonly _generalService: GeneralService
    ){}
    //Register new assurance
    @Post('/assurance')
    async registerAssurance(@Body() createAssuranceDto: CreateAssuranceDto){
        await this._generalService.registerAssurance(createAssuranceDto);
    }

    @Post('/assurance/service')
    async registerAssuranceService(@Body() createAssuranceServiceDto: CreateAssuranceServiceDto) {
        await this._generalService.registerAssuranceService(createAssuranceServiceDto);
    }

    @Post('/assurance/api')
    async registerAssuranceApi(@Body() createAssuranceApiDto: CreateAssuranceApiDto) {
        await this._generalService.registerAssuranceApi(createAssuranceApiDto);
    }


    //Get Active Assurances
    @Get('/assurances')
    async getAssurances(@Query() filterAssurancesDto: FilterProfitsDto) {
        return {
            ok: true,
            data: await this._generalService.getAssurances(filterAssurancesDto)
        }
    }

    @Get('/assurance/services')
    async getAssuranceServices(@Query() filterServicesDto: FilterProfitsDto) {
        return {
            ok: true,
            data: await this._generalService.getAssurancesServices(filterServicesDto),
        }
    }


    @Get('/assurances/apis')
    async getAssurancesApis() {
        return {
            ok: true,
            data: await this._generalService.getAssurancesApis(),
        }
    }




}
