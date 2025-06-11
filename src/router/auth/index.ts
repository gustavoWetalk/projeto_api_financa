import { Router } from "express";
import prisma from "../../pisma";
import sessionGenerator from "../../utils/authFunctions";
import { validateData } from "../../middlewares/zodVerifier";
import { loginSchema } from "../../schema/auth";
export const routerAuth = Router();
const messageErrorAuthDate = "Email ou senha inválidos.";
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

routerAuth.post("/create", async (req, res) => {
  const { email, password, firstName, lastName, bornDate } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userAlreadyExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userAlreadyExists) {
      res.status(400).json({ message: "Usuário já cadastrado no sistema" });
      return;
    }

    const createdUser = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: hashedPassword,
        date_of_birth: bornDate,
      },
    });

    if (!createdUser) {
      res.status(400).json({ message: "Erro ao criar usuário" });
      return;
    }

    const code: string = await sessionGenerator(createdUser.id);
    if (code === "Error") {
      res.status(500).json({
        message: "Erro interno do servidor. Entre em contato com o suporte",
      });
      return;
    }

    const token = jwt.sign(
      {
        user: createdUser.id,
        client: "API",
      },
      code,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({
      token,
      user: {
        email: email,
        name: createdUser.first_name + " " + createdUser.last_name,
        date_of_birth: bornDate,
      },
      message: "Usuário criado com sucesso",
    });
    return;
  } catch (error) {
    console.error("Erro durante a criação de usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
    return;
  }
});

routerAuth.post(
  "/login",
  validateData(loginSchema, messageErrorAuthDate),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        res.status(400).json({ message: "erro ao logar" });
        return;
      }
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        res.status(401).json({ message: "senha ou email inválido" });
        return;
      }
      const checkPassword = await bcrypt.compare(password, user.password_hash);
      if (!checkPassword) {
        res.status(401).json({ message: "senha ou email inválido" });
        return;
      }
      const code: string = await sessionGenerator(user.id);
      if (code === "Error") {
        res.status(505).json({
          message: "Erro interno do servidor. Entre em contato com o suporte",
        });
      }
      const token = jwt.sign(
        {
          user: user.id,
          client: "API",
        },
        code,
        {
          expiresIn: "2h",
        }
      );
      res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.first_name + " " + user.last_name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Erro durante o login:", error);
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }
);
