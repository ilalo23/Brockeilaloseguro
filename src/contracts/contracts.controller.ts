import { Controller, Get, UseGuards, Query } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "src/users_auth/get-user.decorator";

import { FilterProfitsDto } from "src/profits/dto/filter-profits.dto";
import { ContractsService } from "./contracts.service";
import { User } from "src/users_auth/schemas/user.schema";

@Controller("contracts")
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) { }
  @Get("")
  @UseGuards(AuthGuard("users"))
  async getContractsByUser(
    //@Query() @Query() filterContractsDto: FilterProfitsDto,
    @GetUser() user
  ) {
    return this.contractsService.getContractsByUser(user["identification"]);
  }

  @Get("forExpiration")
  @UseGuards(AuthGuard("users"))
  async getContractsForExpiration(
    //@Query() @Query() filterContractsDto: FilterProfitsDto,
    @GetUser() user
  ) {
    return this.contractsService.getContractsForExpiration(
      user["identification"]
    );
  }
  @Get("notifications")
  @UseGuards(AuthGuard("users"))
  async getNotReadedNotifications(@GetUser() user) {
    return this.contractsService.getNotReadedNotifications(user['identification']);
  }


}
