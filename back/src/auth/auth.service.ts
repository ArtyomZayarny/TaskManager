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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:18',message:'findUser entry',data:{email,emailLength:email?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    try {
      console.log("findUser called with email:", email);
      const user = await this.userModel.findOne({ email }).exec();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:22',message:'findUser result',data:{userFound:!!user,userId:user?._id?.toString(),userEmail:user?.email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return user;
    } catch (error) {
      console.error("findUser database error:", error);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:25',message:'findUser db error',data:{errorMessage:error?.message,errorName:error?.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<Pick<UserModel, "email" | "_id">> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:29',message:'validateUser entry',data:{email,passwordLength:password?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    try {
      console.log("validateUser called with email:", email);
      //Check if user exist
      const user = await this.findUser(email);
      console.log("User found:", user ? "yes" : "no");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:37',message:'validateUser after findUser',data:{userFound:!!user,hasPasswordHash:!!user?.passwordHash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      if (!user) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:40',message:'user not found',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        throw new UnauthorizedException(USER_NOT_FOUNDED);
      }

      //Check if password is match
      const isPasswordMatch = await compare(password, user.passwordHash);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:44',message:'password compare result',data:{isPasswordMatch,hasPasswordHash:!!user.passwordHash},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion

      if (!isPasswordMatch) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:47',message:'password mismatch',data:{email},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
        throw new UnauthorizedException(WRONG_PASSWORD);
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:50',message:'validateUser success',data:{email:user.email,hasId:!!user._id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
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
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/3937f987-7605-4960-a902-926a58bb3c7e',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'auth.service.ts:52',message:'validateUser catch',data:{errorMessage:error?.message,errorStatus:error?.status,errorName:error?.name,isUnauthorized:error instanceof UnauthorizedException,errorStack:error?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
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
