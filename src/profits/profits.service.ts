import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Assurance, AssuranceDocument } from 'src/general/schemas/assurance.schema';
import { Profile, ProfileDocument } from 'src/users_auth/schemas/profile.schema';
import { User } from 'src/users_auth/schemas/user.schema';
import { CreateProfitsDto } from './dto/create-profits.dto';
import { FilterProfitsDto } from './dto/filter-profits.dto';
import { ProfitVersion } from './schemas/profit-version.schema';
import { Profit } from './schemas/profit.schema';
@Injectable()
export class ProfitsService {
    constructor(
        @InjectModel(Profit.name)
        private readonly profitModel: Model<Profit>,
        @InjectModel(ProfitVersion.name)
        private readonly profitVersionModel: Model<ProfitVersion>,
        @InjectModel(Profile.name)
        private readonly profileModel: Model<ProfileDocument>,
        @InjectModel(Assurance.name)
        private readonly assuranceModel: Model<AssuranceDocument>
    ) { }

    async registerBulk(createProfitDto: CreateProfitsDto): Promise<void> {
        const assurances = await this.assuranceModel.find({status: true}).exec();
        //  Change status other profits
        await this.profitVersionModel.updateMany({ status: true }, { $set: { status: false } });
        // Create new version
        const createdProfitVersion = new this.profitVersionModel({
            rows: createProfitDto.profits.length
        });
        await createdProfitVersion.save();

        createProfitDto.profits.forEach((d)=> {
            const code = assurances.find((a)=> a.label === d['assurance']);
            d['assurance'] = !code ? 'NO_DEFINED': code.code;
        });

        //change last profits status
        await this.profitModel.updateMany({ status: true }, { $set: { status: false } })
        // create new profits
        await this.profitModel.insertMany(createProfitDto.profits.map(p => {
            return {
                ...p,
                ['version_id']: createdProfitVersion._id
            }

        }));
    }

    async getAllProfits(filterProfitsDto: FilterProfitsDto, user?: User): Promise<{
        docs: Array<Profit>,
        totalDocs: number,
        totalPages: number,
        currentPage: number,
        hasNextPage: boolean
    }> {

        let filter = { status: true };
        if (filterProfitsDto.name) {
            filter["$or"] = [
                { user_id: { $regex: new RegExp(filterProfitsDto.name, "i") } },
                { customer: { $regex: new RegExp(filterProfitsDto.name, "i") } },
                { assurance: { $regex: new RegExp(filterProfitsDto.name, "i") } },
            ];
        }
        if(user){
            const profile = await this.profileModel.findOne({user: user._id});
            filter['user_id'] = profile.identification;
        }
        const query = this.profitModel.find(filter)
            .sort({ created_at: 1 })
            .skip(filterProfitsDto.page === 1 ? 0 : ((filterProfitsDto.page - 1) * filterProfitsDto.limit))
            .limit(filterProfitsDto.limit)
        const total = await this.profitModel.count(filter);
        return  {
            docs: await query,
            totalDocs: total,
            totalPages: Math.ceil(total/filterProfitsDto.limit),
            currentPage: filterProfitsDto.page,
            hasNextPage: total === (filterProfitsDto.page  * filterProfitsDto.limit) ||  (filterProfitsDto.page  * filterProfitsDto.limit) >total ? false : true
        }
    }

}
