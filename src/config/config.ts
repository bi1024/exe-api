import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoDbUri: string | undefined;
  jwtSecret: string ;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoDbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || "secret123",
};

export default config;
