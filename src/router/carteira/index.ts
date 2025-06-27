// src/router/carteira.ts
import { Router } from "express";
import prisma from "../../pisma";
import {
  extractUserDataFromToken,
  validateJWT,
} from "../../middlewares/JWTverifier";

export const routerCarteira = Router();

routerCarteira.post("/add", validateJWT, async (req, res) => {
  const userData = await extractUserDataFromToken(req, res);
  if (!userData || "status" in userData) {
    return;
  }

  const { name, icon } = req.body as { name: string; icon: string };

  if (typeof name !== "string" || typeof icon !== "string") {
    res.status(400).json({ message: "Campos name e icon devem ser strings" });
  }

  try {
    const newPortfolio = await prisma.portfolio.create({
      data: {
        user_id: userData.id,
        nome_carteira: name,
        icon: icon,
      },
    });
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error("Erro ao criar portfolio:", error);
    res.status(500).json({ message: "Erro interno ao criar carteira" });
  }
});

routerCarteira.get("/list", validateJWT, async (req, res) => {
  const userData = await extractUserDataFromToken(req, res);
  if (!userData || "status" in userData) {
    return;
  }

  try {
    const findPortfolio = await prisma.portfolio.findMany({
      where: {
        user_id: userData.id,
      },
    });
    res.status(201).json(findPortfolio);
  } catch (error) {
    console.error("Erro ao criar portfolio:", error);
    res.status(500).json({ message: "Erro interno ao criar carteira" });
  }
});
