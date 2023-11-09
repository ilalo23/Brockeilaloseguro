import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quote } from './schemas/quote.schema';
import { Model, PopulateOptions } from 'mongoose';
import { FilterQuotesDto } from './dto/filter-quotes.dto';
import { ResponseService } from 'src/interfaces/response.interface';

@Injectable()
export class QuotesService {
    constructor(
        @InjectModel(Quote.name)
        private readonly quoteModel: Model<Quote>,
    ) {

    }

    async getUserQuotes(
        filterQuotesDto: FilterQuotesDto,
        _id?: string
    ): Promise<ResponseService> {
        const filter = { status: true, type: filterQuotesDto.uri };
        if (filterQuotesDto.name) {
            filter["$or"] = [
                {
                    "customer.identification": {
                        $regex: new RegExp(filterQuotesDto.name, "i"),
                    },
                },
                {
                    "customer.lastname": {
                        $regex: new RegExp(filterQuotesDto.name, "i"),
                    },
                },
            ];
        }
        _id && (filter["created_by"] = _id);
        const populate: PopulateOptions = {
            path: 'assurance',
            select: { code: 1, _id: 1, small_logo: 1, normal_logo: 1, primary_color: 1, secondary_color: 1 }
            //strictPopulate: false
        };
        const query = this.quoteModel
        
            .find(filter, ["_id", "type", "customer", "car", "created_at", "assurance", 'products'])
            .populate(populate)
            .sort({ created_at: 1 })
            .skip(
                filterQuotesDto.page === 1
                    ? 0
                    : (filterQuotesDto.page - 1) * filterQuotesDto.limit
            )
            .limit(filterQuotesDto.limit);
        const total = await this.quoteModel.count(filter);
        return {
            docs: await query,
            totalDocs: total,
            totalPages: Math.ceil(total / filterQuotesDto.limit),
            currentPage: filterQuotesDto.page,
            hasNextPage:
                total === filterQuotesDto.page * filterQuotesDto.limit ||
                    filterQuotesDto.page * filterQuotesDto.limit > total
                    ? false
                    : true,
        };
    }
}
