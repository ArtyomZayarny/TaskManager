import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.controller.ts:26',message:'login entry',data:{login,passwordLength:password?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    try {
      console.log("login attempt:", login);
      //Validate user - login is actually email
      const { email, _id } = await this.authService.validateUser(login, password);

      //login user
      const result = await this.authService.login(email, _id);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.controller.ts:33',message:'login success',data:{hasAccessToken:!!result?.access_token,hasUserId:!!result?.userId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return result;
    } catch (error) {
      console.error("Login error:", error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.controller.ts:36',message:'login error',data:{errorMessage:error?.message,errorStatus:error?.status,errorName:error?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  }
}
