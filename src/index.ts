import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes.ts";
import { AppDataSource } from "./datasource.ts"; // <--- 1. Importe o DataSource

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.query && typeof req.query.method === "string") {
    req.method = req.query.method.toUpperCase();
  }
  next();
});

// Rotas
app.use(router);

const PORT = process.env.WEB_PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("📦 Banco de dados conectado com sucesso!");

    app.listen(PORT, () => {
      console.log(`\n🚀 Servidor rodando na porta ${PORT}.`);
      console.log(`📡 Acesse: https://575n3y-3000.csb.app/`);
    });
  })
  .catch((error) => {
    console.error("Erro ao conectar no banco de dados:", error);
  });
