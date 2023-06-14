import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [AuthController],
  imports: [ConfigModule],
})
export class AuthModule {}
