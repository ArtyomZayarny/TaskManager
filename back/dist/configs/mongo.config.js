"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoConfig = void 0;
const getMongoConfig = async (configService) => {
    return Object.assign({ uri: getMongoString(configService) }, getMongoOptions());
};
exports.getMongoConfig = getMongoConfig;
const getMongoString = (configService) => {
    return `mongodb+srv://${configService.get("MONGO_LOGIN")}:${configService.get("MONGO_PASSWORD")}@cluster0.formhkq.mongodb.net/${configService.get("MONGO_DATABASE_NAME")}`;
};
const getMongoOptions = () => ({
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
//# sourceMappingURL=mongo.config.js.map