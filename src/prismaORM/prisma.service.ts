import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { Environment, EnvironmentVariable } from 'src/utils/env.validation';
import { Order, PaginationAndSortDto } from './dto/pagination-and-sort.dto';

const configService = new ConfigService<EnvironmentVariable>();
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor() {
        super({
            errorFormat:
                configService.get('NODE_ENV', { infer: true }) ===
                    Environment.Production
                    ? 'minimal'
                    : 'pretty',
        });
    }
    private readonly logger = new Logger(PrismaService.name);
    async onModuleInit() {
        this.logger.log('👀 Initializing prisma 🔌');

        await this.$connect()
            .then(() => {
                this.logger.log('🎉 prisma connected 🪢');
            })
            .catch((err) => {
                this.logger.log(`🌋prisma connection error 😭: ${err}`);
            });
    }

    setPaginationAndSort(pagination: PaginationAndSortDto) {
        const { pageNo, perPage, orderBy, order } = pagination;
        return {
            ...(perPage &&
                pageNo && {
                skip: (pageNo - 1) * perPage,
                take: perPage,
            }),
            ...(orderBy &&
                order && {
                orderBy: {
                    [orderBy ? orderBy : 'created_at']: order ? order : 'desc',
                },
            }),
        };
    }
}
