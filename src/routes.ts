import { Router, Request, Response } from "express";
import { AppDataSource } from "./datasource.ts";
import { Categoria } from "./entity/Categoria";
import { Denuncia } from "./entity/Denuncia.ts";
import { Historico } from "./entity/Historico.ts";

const router = Router();

const categoriaRepo = AppDataSource.getRepository(Categoria);
const denunciaRepo = AppDataSource.getRepository(Denuncia);
const historicoRepo = AppDataSource.getRepository(Historico);

// Rota padrão
router.get("/", (req: Request, res: Response) => {
  res.json({ message: "Tudo certo." });
});

// CATEGORIAS
router.get("/categories", async (req: Request, res: Response) => {
  const categorias = await categoriaRepo.find();

  if (categorias.length < 1) {
    res.status(404).json({ message: "Não existem categorias cadastradas." });
  } else {
    res.status(200).json({ categorias });
  }
});

router.get("/categories/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const categoria = await categoriaRepo.findOneBy({ id: id });

  if (!categoria) {
    res.status(404).json({ message: "Categoria não encontrada." });
  } else {
    res.status(200).json({ categoria });
  }
});

router.post("/categories", async (req: Request, res: Response) => {
  const nome = req.body.nome;
  const descricao = req.body.descricao;

  const novaCategoria = categoriaRepo.create({
    nome: nome,
    descricao: descricao,
  });

  await categoriaRepo.save(novaCategoria);

  res.status(201).json({
    message: "Categoria cadastrada com sucesso!",
    categoria: novaCategoria,
  });
});

router.put("/categories/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const nome = req.body.nome;
  const descricao = req.body.descricao;

  if (categoriaRepo.findOneBy({ id: id })) {
    await categoriaRepo.update(id, {
      nome: nome,
      descricao: descricao,
    });

    const categoria = await categoriaRepo.findOneBy({ id: id });

    res.status(200).json({
      message: "Categoria atualizada com sucesso!",
      categoria: categoria,
    });
  } else {
    res.status(404).json({ message: "Categoria não encontrada." });
  }
});

router.delete("/categories/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (categoriaRepo.findOneBy({ id: id })) {
    await categoriaRepo.delete({ id: id });

    res.status(200).json({
      message: "Categoria apagada com sucesso!",
    });
  } else {
    res.status(404).json({ message: "Categoria não encontrada." });
  }
});

// DENÚNCIA
router.get("/reports", async (req: Request, res: Response) => {
  const { categoriaId, status, prioridade } = req.query;

  const where: any = {};

  if (status) {
    where.status = status;
  }
  if (prioridade) {
    where.prioridade = prioridade;
  }
  if (categoriaId) {
    where.categoria = { id: Number(categoriaId) };
  }

  const denuncias = await denunciaRepo.find({
    where: where,
    relations: ["categoria"],
  });

  res.status(200).json({ denuncias });
});

router.get("/reports/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const denuncia = await denunciaRepo.findOneBy({ id: id });

  if (!denuncia) {
    res.status(404).json({ message: "Denúncia não encontrada." });
  } else {
    res.status(200).json({ denuncia });
  }
});

router.post("/reports", async (req: Request, res: Response) => {
  const { titulo, descricao, local, prioridade, status, categoriaId } = req.body;

  try {
    const categoriaEncontrada = await categoriaRepo.findOneBy({
      id: categoriaId,
    });

    if (!categoriaEncontrada) {
      return res.status(404).json({ message: "Categoria não encontrada." });
    }

    const novaDenuncia = denunciaRepo.create({
      titulo,
      descricao,
      local,
      prioridade,
      status,
      categoria: categoriaEncontrada,
    });

    await denunciaRepo.save(novaDenuncia);

    return res.status(201).json({
      message: "Denuncia cadastrada com sucesso!",
      denuncia: novaDenuncia,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

router.put("/reports/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, categoriaId, local, prioridade, status, registrante } =
    req.body;

  const denunciaEncontrada = await denunciaRepo.findOneBy({
    id: id,
  });

  if (denunciaEncontrada) {
    const categoriaEncontrada = await categoriaRepo.findOneBy({
      id: categoriaId,
    });

    if (categoriaEncontrada) {
      await denunciaRepo.update(id, {
        titulo,
        descricao,
        categoria: categoriaEncontrada,
        local,
        prioridade,
        registrante,
        status,
      });

      const denuncia = await denunciaRepo.findOneBy({ id: id });

      res.status(200).json({
        message: "Denuncia atualizada com sucesso!",
        denuncia: denuncia,
      });
    } else {
      res.status(404).json({ message: "Categoria não encontrada." });
    }
  } else {
    res.status(404).json({ message: "Denúncia não encontrada." });
  }
});

router.get("/reports", async (req: Request, res: Response) => {
  const { categoriaId, status, prioridade, pagina, porPagina } = req.query;

  const numeroPagina = parseInt(pagina as string) || 1;
  const itensPagina = parseInt(porPagina as string) || 10;
  
  const where: any = {};

  if (status) {
    where.status = status;
  }
  if (prioridade) {
    where.prioridade = prioridade; 
  }
  if (categoriaId) {
    where.categoria = { id: Number(categoriaId) };
  }

  try {
    const [denuncias, total] = await denunciaRepo.findAndCount({
      where: where,
      relations: ["categoria"], 
      skip: (numeroPagina - 1) * itensPagina,
      take: itensPagina,
      order: { id: "DESC" }
    });

    res.status(200).json({
      page: numeroPagina,
      perPage: itensPagina,
      total: total,
      data: denuncias
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar denúncias" });
  }
});
router.delete("/reports/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (await denunciaRepo.findOneBy({ id: id })) {
    await denunciaRepo.delete({ id: id });

    res.status(200).json({
      message: "Denúncia apagada com sucesso!",
    });
  } else {
    res.status(404).json({ message: "Denúncia não encontrada." });
  }
});

router.post("/reports/:id/updates", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { comentario, responsavel } = req.body;

  const denuncia = await denunciaRepo.findOneBy({ id });

  if (!denuncia) {
    return res.status(404).json({ message: "Denúncia não encontrada" });
  }

  const novoHistorico = historicoRepo.create({
    comentario,
    responsavel,
    denuncia: denuncia,
  });

  await historicoRepo.save(novoHistorico);

  res
    .status(201)
    .json({ message: "Histórico adicionado!", historico: novoHistorico });
});

export { router };
