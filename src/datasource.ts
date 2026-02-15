import "reflect-metadata";
import { DataSource } from "typeorm";
import { Categoria } from "./entity/Categoria";
import { Denuncia } from "./entity/Denuncia";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Categoria, Denuncia],
  migrations: [],
  subscribers: [],
});
