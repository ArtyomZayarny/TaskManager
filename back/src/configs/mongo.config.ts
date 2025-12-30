import { ConfigService } from "@nestjs/config";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export const getMongoConfig = async (
  configService: ConfigService
): Promise<TypegooseModuleOptions> => {
  const mongoString = getMongoString(configService);
  const options = getMongoOptions();
  
  console.log("MongoDB config:", {
    hasLogin: !!configService.get("MONGO_LOGIN"),
    hasPassword: !!configService.get("MONGO_PASSWORD"),
    hasPrefix: !!configService.get("MONGO_PREFIX"),
    hasDatabase: !!configService.get("MONGO_DATABASE_NAME"),
    uri: mongoString.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'), // Hide credentials
    options
  });
  
  return {
    uri: mongoString,
    ...options,
  };
};

const getMongoString = (configService: ConfigService) => {
  return `mongodb+srv://${configService.get("MONGO_LOGIN")}:${configService.get(
    "MONGO_PASSWORD"
  )}@${configService.get("MONGO_PREFIX")}/${configService.get("MONGO_DATABASE_NAME")}`;
};

const getMongoOptions = () => ({
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 1,
});
