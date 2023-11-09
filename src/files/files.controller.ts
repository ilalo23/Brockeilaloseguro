import { Controller, Get, Query, BadRequestException, StreamableFile, HttpStatus, Param, Header } from '@nestjs/common';
import { FilesService } from './files.service';
import { createReadStream } from 'fs';
import { HttpCode } from '@nestjs/common/decorators/http';
import { FilterFilesDto } from './dto/filter-files.dto';

@Controller('files')
export class FilesController {
    constructor(
        private readonly _filesService: FilesService
    ){}
    @Get('/list')
    async getListFiles(@Query() filterFilesDto: FilterFilesDto) {
        return await this._filesService.getDirectory(filterFilesDto);
    }

    @Get('/download/:id')
    @HttpCode(HttpStatus.OK)
    
    async downloadFile(@Param() query) {
        const { id } = query;
    if (!id) throw new BadRequestException('Data its required');
    const dataFile = await this._filesService.downloadFile(id);
       
    return new StreamableFile(dataFile.file,{
        type: dataFile.type, 
    });
    }
}
