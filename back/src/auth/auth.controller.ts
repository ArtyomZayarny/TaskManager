import { Controller } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(private readonly configService: ConfigService) {}
}
