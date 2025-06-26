// src/router/carteira.ts
import { Router } from "express";
import prisma from "../../pisma";
import {
  extractUserDataFromToken,
  validateJWT,
} from '../../middlewares/JWTverifier';;

export const routerCarteira = Router();

// Cria uma nova carteira enviando: { name: string; icon: string }
routerCarteira.post(
  "/add",
  validateJWT,
  async (req, res) => {
    // 1) extrai dados do usuário
   const userData = await extractUserDataFromToken(req, res);
    if (!userData || "status" in userData) {
      return;
    }

    // 2) lê name e icon do body
    const { name, icon } = req.body as { name: string; icon: string };

    if (typeof name !== "string" || typeof icon !== "string") {
       res
        .status(400)
        .json({ message: "Campos name e icon devem ser strings" });
    }

    // 3) cria no banco
    try {
      const newPortfolio = await prisma.portfolio.create({
        data: {
          user_id: userData.id,
          nome_carteira: name,
          icon: icon,  // grava o nome do AntIcon, ex: "HomeOutlined"
        },
      });
       res.status(201).json(newPortfolio);
    } catch (error) {
      console.error("Erro ao criar portfolio:", error);
       res
        .status(500)
        .json({ message: "Erro interno ao criar carteira" });
    }
  }
);
