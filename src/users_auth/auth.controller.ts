import { Body, Controller, Post, Put, UseGuards, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthUserDto, CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { User } from "./schemas/user.schema";

@Controller("auth/users")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
  }

  @Post("/login")
  async login(@Body() authUserDto: AuthUserDto) {
    return await this.authService.login(authUserDto);
  }

  @Post("/recovery")
  async generateCode(@Body() body) {
    const { identification } = body;
    return {
      data: await this.authService.generateCode(identification),
    };
  }

  @Post("/recovery/validate")
  async validateCode(@Body() body) {
    const { code } = body;
    return await this.authService.validateCode(code);
  }

  @Put("/password")
  @UseGuards(AuthGuard("users"))
  async updatePassword(
    @Body() authUserdto: AuthUserDto,
    @GetUser() user: User
  ) {
    const { password } = authUserdto;
    const { email } = user;
    await this.authService.updatePassword(password, email);
  }

  @Get("")
  //@UseGuards(AuthGuard("administration"))
  async getListOfConsultants() {
    return this.authService.getListOfConsultants();
  }

  @Put("fcm")
  @UseGuards(AuthGuard("users"))
  async updateFCM(@Body("fcm") fcm: string, @GetUser() user) {
    await this.authService.updateFCM(fcm, user["identification"]);
  }
}
