import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/users_auth/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { FilterQuotesDto } from './dto/filter-quotes.dto';
import { QuotesService } from './quotes.service';
@Controller('quotes')
export class QuotesController {

    constructor(
        private readonly quotesService: QuotesService
    ) { }

    @Get('/users/myquotes')
    @UseGuards(AuthGuard('users'))
    async getUsersQuotes(@Query() filterQuotesDto: FilterQuotesDto, @GetUser() user) {

        return await this.quotesService.getUserQuotes(filterQuotesDto, user?._id)


    }
}
