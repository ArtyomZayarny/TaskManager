import { Client, Account, ID, Databases, Storage } from "appwrite";

const client = new Client();

client
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setSelfSigned(true); // Помогает с CORS проблемами

const account = new Account(client);
const storage = new Storage(client);

export { client, account, storage, ID };
