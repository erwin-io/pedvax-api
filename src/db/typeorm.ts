import "reflect-metadata";
import { ConnectionOptions } from "typeorm";
import { Vaccination } from "./entities/Vaccination";
import { HealthCenter } from "./entities/HealthCenter";
import { People } from "./entities/People";
import { SystemConfig } from "./entities/SystemConfig";
import { Users } from "./entities/Users";
import { Vaccine } from "./entities/Vaccine";

export function createConfig(): ConnectionOptions {
   const ssl = process.env.SSL;
  const config: ConnectionOptions = {
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    entities: [HealthCenter, People, SystemConfig, Users, Vaccination, Vaccine],
    synchronize: false,
    ssl: ssl.toLocaleLowerCase().includes("true"),
    extra: {
    }
  };
  if(config.ssl) {
    config.extra.ssl = {
      require: true,
      rejectUnauthorized: false,
    }
  }
  return config;
}
