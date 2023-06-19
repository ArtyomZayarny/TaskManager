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
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<Pick<UserModel, "email" | "_id">> {
    //Check if user exist
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUNDED);
    }

    //Check if password is match
    const isPasswordMatch = await compare(password, user.passwordHash);

    if (!isPasswordMatch) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }

    return { email: user.email, _id: user._id };
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
