import { Controller, Body, Query } from '@nestjs/common';
import { Get, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users_auth/get-user.decorator';
import { User } from 'src/users_auth/schemas/user.schema';
import { CreateProfitsDto } from './dto/create-profits.dto';
import { FilterProfitsDto } from './dto/filter-profits.dto';
import { ProfitsService } from './profits.service';

@Controller('profits')
export class ProfitsController {
    constructor( private readonly profitsService: ProfitsService){}

@Post('/register')
async registerProfit(@Body() createProfitsDto : CreateProfitsDto
) {
    
    this.profitsService.registerBulk(createProfitsDto);
    //console.log(createProfitsDto)
}

@UseGuards(AuthGuard('users'))
@Get('/users')
async getAllProfits(@Query() filterProfitsDto: FilterProfitsDto) {
    return {
        ok: true,
        data: await this.profitsService.getAllProfits(filterProfitsDto)
    };
}

@UseGuards(AuthGuard('users'))
@Get('/byUser')
async getProfistsByUser(@Query() filterProfitsDto: FilterProfitsDto, @GetUser() user: User){
    
    return {
        ok: true,
        data: await this.profitsService.getAllProfits(filterProfitsDto, user)
    };
}

}
