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
router.get("/categorias", async (req: Request, res: Response) => {
  const categorias = await categoriaRepo.find();

  if (categorias.length < 1) {
    res.status(404).json({ message: "Não existem categorias cadastradas." });
  } else {
    res.status(200).json({ categorias });
  }
});

router.get("/categorias/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const categoria = await categoriaRepo.findOneBy({ id: id });

  if (!categoria) {
    res.status(404).json({ message: "Categoria não encontrada." });
  } else {
    res.status(200).json({ categoria });
  }
});

router.post("/categorias", async (req: Request, res: Response) => {
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

router.put("/categorias/:id", async (req: Request, res: Response) => {
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

router.delete("/categorias/:id", async (req: Request, res: Response) => {
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
router.get("/denuncias", async (req: Request, res: Response) => {
  const denuncias = await denunciaRepo.find();

  if (denuncias.length < 1) {
    res.status(404).json({ message: "Não existem denúncias cadastradas." });
  } else {
    res.status(200).json({ denuncias });
  }
});

router.get("/denuncias/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const denuncia = await denunciaRepo.findOneBy({ id: id });

  if (!denuncia) {
    res.status(404).json({ message: "Denúncia não encontrada." });
  } else {
    res.status(200).json({ denuncia });
  }
});

router.post("/denuncias", async (req: Request, res: Response) => {
  const { titulo, descricao, denunciaId, local, prioridade, status } = req.body;

  try {
    const denunciaEncontrada = await denunciaRepo.findOneBy({
      id: denunciaId,
    });

    if (!denunciaEncontrada) {
      return res.status(404).json({ message: "Denúncia não encontrada." });
    }

    const novaDenuncia = denunciaRepo.create({
      titulo,
      descricao,
      local,
      prioridade,
      status,
      denuncia: denunciaEncontrada,
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

router.put("/denuncias/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { titulo, descricao, categoriaId, local, prioridade, status } =
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

router.patch("/denuncias/:id/status", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  const denunciaEncontrada = await denunciaRepo.findOneBy({
    id: id,
  });

  if (denunciaEncontrada) {
    await denunciaRepo.update(id, {
      status,
    });

    const denuncia = await denunciaRepo.findOneBy({ id: id });

    res.status(200).json({
      message: "Status da denúncia atualizado com sucesso!",
      denuncia: denuncia,
    });
  } else {
    res.status(404).json({ message: "Categoria não encontrada." });
  }
});

router.delete("/denuncias/:id", async (req: Request, res: Response) => {
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

router.post("/denuncias/:id/historico", async (req: Request, res: Response) => {
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
