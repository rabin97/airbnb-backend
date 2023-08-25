import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prismaORM/prisma.service';
import { UserRegisterDto } from './dto/user.dto';
import { AccountProviderType } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from 'src/utils/env.validation';
import { genSaltSync, hashSync } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    // private readonly config: ConfigService<EnvironmentVariable>,
  ) {}

  async RegisterUser(user: UserRegisterDto): Promise<any> {
    try {
      const { email, name, password, role } = user;
      const existingUser =await this.prisma.user.findFirst({
        where: {
          email: user.email,
        },
      });
      console.log(existingUser);
      if (existingUser) {
        throw new ConflictException({ msg: 'user already registered 🎉' });
      }
    //   const saltRounds = genSaltSync(this.config.get<number>('BCRYPT_SALT_ROUNDS'));
      const hashpassword = hashSync(password, 10);
      return this.prisma.user.create({
        data: {
          name,
          email,
          hashpassword,
          role,
          account: {
            create: {
              provider: AccountProviderType.CREDENTIAL,
              username: email,
              hashpassword,
            },
          },
        },
      });
    } catch (err) {
        console.log(err);
      throw new InternalServerErrorException({
        msg: 'Error registering user 😨',
      });
    }
  }
}
