import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file in the server directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Will initialize database with the following config:", {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  database: process.env.DB_NAME,
});

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "moustaches",
  synchronize: false,
  logging: true,
  subscribers: [],
  migrationsTableName: "migrations",
  migrationsRun: true,
  entities: ["dist/app/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  connectTimeout: 60000,
  poolSize: 3,
});
