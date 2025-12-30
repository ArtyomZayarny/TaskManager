import {
  BadRequestException,
  Body,
  Controller,
  Post,
} from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { USER_ALREADY_REGISTERED_ERROR } from "./auth.constants";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: AuthDto) {
    const oldUser = await this.authService.findUser(dto.login);
    if (oldUser) {
      throw new BadRequestException(USER_ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto);
  }

  @Post("login")
  async login(@Body() { login, password }: AuthDto) {
    try {
      console.log("login attempt:", login);
      //Validate user - login is actually email
      const { email, _id } = await this.authService.validateUser(login, password);

      //login user
      return this.authService.login(email, _id);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
}
