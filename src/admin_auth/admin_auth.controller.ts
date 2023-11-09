import { Controller, Post, Body } from '@nestjs/common';
import { GetUser } from 'src/users_auth/get-user.decorator';
import { AdminAuthService } from './admin_auth.service';
import { AuthAdministrationDto, CreateAdministrationDto } from './dto/create-administration.dto';
import { Administration } from './schemas/administration.schema';

@Controller('admin')
export class AdminAuthController {
    constructor(
        private readonly adminAuthService: AdminAuthService
    ) { }

    @Post("/signup")
    //@UseGuards(AuthGuard("administration"))
    async signup(
        @Body() createAdministrationDto: CreateAdministrationDto,
        @GetUser() user: Administration
    ) {
        console.log(createAdministrationDto);
        this.adminAuthService.signup(createAdministrationDto, user);
    }
    @Post("/signin")
    async signIn(
        @Body() authAdministrationDto: AuthAdministrationDto
    ): Promise<{ accessToken: string }> {
        return this.adminAuthService.signIn(authAdministrationDto);
    }
}
