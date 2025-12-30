import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { AuthDto } from "./dto/auth.dto";
import { compare, genSalt, hash } from "bcrypt";
import { USER_NOT_FOUNDED, WRONG_PASSWORD } from "./auth.constants";
import { JwtService } from "@nestjs/jwt";
import { Types } from "mongoose";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private jwtService: JwtService
  ) {}

  async findUser(email: string) {
    try {
      console.log("findUser called with email:", email);
      const user = await this.userModel.findOne({ email }).exec();
      return user;
    } catch (error) {
      console.error("findUser database error:", error);
      throw error;
    }
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<Pick<UserModel, "email" | "_id">> {
    try {
      console.log("validateUser called with email:", email);
      //Check if user exist
      const user = await this.findUser(email);
      console.log("User found:", user ? "yes" : "no");

      if (!user) {
        throw new UnauthorizedException(USER_NOT_FOUNDED);
      }

      //Check if password is match
      const isPasswordMatch = await compare(password, user.passwordHash);

      if (!isPasswordMatch) {
        throw new UnauthorizedException(WRONG_PASSWORD);
      }

      return { email: user.email, _id: user._id };
    } catch (error) {
      console.error("validateUser error:", error);
      console.error("validateUser error details:", {
        message: error?.message,
        status: error?.status,
        name: error?.name,
        stack: error?.stack,
        isUnauthorized: error instanceof UnauthorizedException
      });
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // If it's a database error or other error, log the real error and wrap it
      console.error("Real error before wrapping:", error);
      throw new UnauthorizedException(`Authentication failed: ${error?.message || 'Unknown error'}`);
    }
  }

  async login(email: string, userId: Types.ObjectId) {
    //create jwt token
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userId,
    };
  }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: dto.login,
      passwordHash: await hash(dto.password, salt),
    });
    const newSavedUser = newUser.save();

    return await this.login(
      (
        await newSavedUser
      ).email,
      (
        await newSavedUser
      )._id
    );
  }
}
