import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegisterDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';


@Controller('/api')
@ApiTags('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('/register')
    async RegisterUser(@Body() user: UserRegisterDto): Promise<any> {
        return this.userService.RegisterUser(user)
    }
}
