import { ConfigService } from "@nestjs/config";
export declare class AuthController {
    private readonly configService;
    constructor(configService: ConfigService);
    login(): Promise<void>;
}
