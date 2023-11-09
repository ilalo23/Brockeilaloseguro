import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AssuranceContract } from "./aws_entities/assurance_contract";
import { Repository, Between, In, Not } from "typeorm";
import { InjectModel } from "@nestjs/mongoose";
import { Assurance } from "src/general/schemas/assurance.schema";
import { Model } from "mongoose";
import * as FCM from "fcm-node";
import { Profile } from "src/users_auth/schemas/profile.schema";
import {
  ContractNotification,
  TypeContractNofication,
} from "./schemas/contract_notification.schema";
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";
@Injectable()
export class ContractsService {
  private fcm: FCM;
  constructor(
    @InjectRepository(AssuranceContract, "aws")
    private readonly contractsRepository: Repository<AssuranceContract>,
    @InjectModel(Assurance.name)
    private readonly assuranceModel: Model<Assurance>,
    @InjectModel(Profile.name)
    private readonly profileModel: Model<Profile>,
    @InjectModel(ContractNotification.name)
    private readonly contractNotificationModel: Model<ContractNotification>,
    private readonly configService: ConfigService
  ) {
    this.fcm = new FCM(this.configService.get("FCM_TOKEN"));
  }

  public async getContractsByUser(
    // filterContractsDto: FilterProfitsDto,
    identificationUser: string
  ) {
    const today = new Date();
    let assets = [];
    const filters = {};
    if (identificationUser !== "1705545828") {
      filters["consultant"] = identificationUser;
    }
    const docs = await this.contractsRepository.find({
      where: {
        ...filters,
        expiredDate: Between(
          new Date(today.setHours(0, 0, 0, 0)),
          new Date(today.setDate(today.getDate() - 90))
        ),
      },
      order: {
        expiredDate: "ASC",
      },
    });
    if (docs.length) {
      const assurancesNames = [
        ...new Set(docs.map((d) => d.assuranceCompany.trim())),
      ];
      assets = await this.getAssetsAssurances(assurancesNames);
    }

    const forExpiration = await this.getContractsForExpiration(
      identificationUser
    );
    return {
      payments: docs,
      forExpiration: forExpiration.docs,
      assets: [...new Set([...assets, ...forExpiration.assets])],
    };
  }

  public async getContractsForExpiration(identificationUser: string) {
    const today = new Date();
    let assets = [];
    const docs = await this.contractsRepository.find({
      where: {
        consultant: identificationUser,
        endContractDate: Between(
          new Date(today.setHours(0, 0, 0, 0)),
          new Date(today.setDate(today.getDate() + 15))
        ),
      },
      order: {
        endContractDate: "ASC",
      },
    });

    const filterExpiredContracts: AssuranceContract[] = Array.from(
      new Set(docs.map((d) => d.contract))
    ).map((id) => docs.find((d) => d.contract === id));
    /*const docs = await this.contractsRepository
      .createQueryBuilder('contract')
      .select([
        'DISTINCT(contract.contract) AS contract',
        'contract.customer as customer',
        'contract.id as id',
        'contract.consultant as consultant',
        'contract.email as email',
        'contract.phone as phone',
        'contract.assuranceCompany as assuranceCompany',
        'contract.startContractDate as startContractDate',
        'contract.endContractDate as endContractDate',
        'contract.expiredDate as expiredDate',
        'contract.orderPayment as orderPayment',
      ])


      .where({
        consultant: identificationUser,
        endContractDate: Between(
          new Date(today.setHours(0, 0, 0, 0)),
          new Date(today.setDate(today.getDate() + 15))
        ),
      })
      .orderBy('contract.endContractDate', 'ASC')
      .getRawMany();*/
    if (filterExpiredContracts.length) {
      const assurancesNames = [...new Set(docs.map((d) => d.assuranceCompany))];
      assets = await this.getAssetsAssurances(assurancesNames);
    }
    return {
      docs: filterExpiredContracts,
      assets,
    };
  }

  private async getAssetsAssurances(assurances: string[]) {
    return await this.assuranceModel.find(
      {
        code: {
          $in: assurances,
        },
      },
      {
        small_logo: 1,
        primary_color: 1,
        secondary_color: 1,
        code: 1,
      }
    );
  }
  @Cron("0 52 9 * * 1-6", {
    name: "whtCommitment",
    timeZone: "America/Guayaquil",
  })
  private async generateNotification() {
    const profiles = await this.profileModel
      .find({
        $and: [
          { fcm: { $exists: true } }, // Check if the field exists
          { fcm: { $ne: null } }, // Check if the field is not null
          { fcm: { $ne: "" } }, // Check if the field is not an empty string
        ],
      })
      .populate({
        path: "user",
        match: { status: 1 },
      });
    if (profiles.length) {
      let contractsNotified = [];
      for await (const profile of profiles) {
        const lastContractsNotifications = await this.contractNotificationModel.findOne(
          {
            identification: profile.identification,
            typeNotification: TypeContractNofication.PAYMENT_EXPIRED,
            wasSent: true,
          }
        );
        if (lastContractsNotifications) {
          contractsNotified = [
            ...contractsNotified,
            ...lastContractsNotifications.group_contracts,
          ];
        }
      }
      const today = new Date();
      const contracts = await this.contractsRepository.find({
        where: {
          id: Not(In(contractsNotified)),
          consultant: In(profiles.map((p) => p.identification)),
          expiredDate: Between(
            new Date(today.setHours(0, 0, 0, 0)),
            new Date(today.setDate(today.getDate() + 15))
          ),
        },
      });

      for await (const profile of profiles) {
        const profileContracts = contracts.filter(
          (c) => c.consultant === profile.identification
        );
        if (profileContracts.length) {
          const message = {
            notification: {
              title: "Recordatorio de cuotas Vencidas",
              body: `Tienes ${profileContracts.length} polizas con cuotas vencidas, puedes revisarlo en la sección de vencimientos`,
            },
            to: profile.fcm,
          };

          this.fcm.send(message, async (err, _) => {
            if (err) {
              console.log(err);
              const newNotification = new this.contractNotificationModel({
                identification: profile.identification,
                typeNotification: TypeContractNofication.PAYMENT_EXPIRED,
                title: message.notification.title,
                message: message.notification.body,
                group_contracts: profileContracts.map((p) => p.id),
                wasSent: false,
              });
              await newNotification.save();
            } else {
              const newNotification = new this.contractNotificationModel({
                identification: profile.identification,
                typeNotification: TypeContractNofication.PAYMENT_EXPIRED,
                title: message.notification.title,
                message: message.notification.body,
                group_contracts: profileContracts.map((p) => p.id),
                wasSent: true,
              });
              await newNotification.save();
            }
          });
        }
      }
    }
  }

  @Cron("0 53 9 * * 1-6", {
    name: "cronRenovation",
    timeZone: "America/Guayaquil",
  })
  private async generateNotificationRenovation() {
    const profiles = await this.profileModel
      .find({
        $and: [
          { fcm: { $exists: true } }, // Check if the field exists
          { fcm: { $ne: null } }, // Check if the field is not null
          { fcm: { $ne: "" } }, // Check if the field is not an empty string
        ],
      })
      .populate({
        path: "user",
        match: { status: 1 },
      });
    if (profiles.length) {
      let contractsNotified = [];
      for await (const profile of profiles) {
        const lastContractsNotifications = await this.contractNotificationModel.findOne(
          {
            identification: profile.identification,
            typeNotification: TypeContractNofication.RENOVATION,
            wasSent: true,
          }
        );
        if (lastContractsNotifications) {
          contractsNotified = [
            ...contractsNotified,
            ...lastContractsNotifications.group_contracts,
          ];
        }
      }
      const today = new Date();
      const contracts = await this.contractsRepository.find({
        where: {
          id: Not(In(contractsNotified)),
          consultant: In(profiles.map((p) => p.identification)),
          endContractDate: Between(
            new Date(today.setHours(0, 0, 0, 0)),
            new Date(today.setDate(today.getDate() + 15))
          ),
        },
      });

      for await (const profile of profiles) {
        const profileContracts = contracts.filter(
          (c) => c.consultant === profile.identification
        );
        if (profileContracts.length) {
          const message = {
            notification: {
              title: "Recordatorio de Renovaciones",
              body: `Tienes ${profileContracts.length} polizas que deben ser renovadas, puedes revisarlo en la sección de renovaciones`,
            },
            to: profile.fcm,
          };

          this.fcm.send(message, async (err, _) => {
            if (err) {
              console.log(err);
              const newNotification = new this.contractNotificationModel({
                identification: profile.identification,
                typeNotification: TypeContractNofication.RENOVATION,
                title: message.notification.title,
                message: message.notification.body,
                group_contracts: profileContracts.map((p) => p.id),
                wasSent: false,
              });
              await newNotification.save();
            } else {
              const newNotification = new this.contractNotificationModel({
                identification: profile.identification,
                typeNotification: TypeContractNofication.RENOVATION,
                title: message.notification.title,
                message: message.notification.body,
                group_contracts: profileContracts.map((p) => p.id),
                wasSent: true,
              });
              await newNotification.save();
            }
          });
        }
      }
    }
  }

  async getNotReadedNotifications(identification: string) {
    const today = new Date();
    return await this.contractNotificationModel.find(
      {
        identification,
        wasSent: true,
        wasViewed: false,
        created_at: {
          $gte: new Date(
            new Date(today.setDate(today.getDate() - 5)).setHours(0, 0, 0, 0)
          ),
          $lte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      {
        title: 1,
        message: 1,
        created_at: 1,
      }
    );
  }
}
