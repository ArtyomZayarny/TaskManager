import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { JwtModule } from "@nestjs/jwt";
import { getJwtConfig } from "src/configs/jwt.config";

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: "users",
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
