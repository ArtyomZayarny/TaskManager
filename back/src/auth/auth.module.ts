import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";

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
  ],
  providers: [AuthService],
})
export class AuthModule {}
