"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerCarteira = void 0;
// src/router/carteira.ts
const express_1 = require("express");
const pisma_1 = __importDefault(require("../../pisma"));
const JWTverifier_1 = require("../../middlewares/JWTverifier");
exports.routerCarteira = (0, express_1.Router)();
exports.routerCarteira.post("/add", JWTverifier_1.validateJWT, async (req, res) => {
    const userData = await (0, JWTverifier_1.extractUserDataFromToken)(req, res);
    if (!userData || "status" in userData) {
        return;
    }
    const { name, icon } = req.body;
    if (typeof name !== "string" || typeof icon !== "string") {
        res.status(400).json({ message: "Campos name e icon devem ser strings" });
    }
    try {
        const newPortfolio = await pisma_1.default.portfolio.create({
            data: {
                user_id: userData.id,
                nome_carteira: name,
                icon: icon,
            },
        });
        res.status(201).json(newPortfolio);
    }
    catch (error) {
        console.error("Erro ao criar portfolio:", error);
        res.status(500).json({ message: "Erro interno ao criar carteira" });
    }
});
exports.routerCarteira.get("/list", JWTverifier_1.validateJWT, async (req, res) => {
    const userData = await (0, JWTverifier_1.extractUserDataFromToken)(req, res);
    if (!userData || "status" in userData) {
        return;
    }
    try {
        const findPortfolio = await pisma_1.default.portfolio.findMany({
            where: {
                user_id: userData.id,
            },
        });
        res.status(201).json(findPortfolio);
    }
    catch (error) {
        console.error("Erro ao criar portfolio:", error);
        res.status(500).json({ message: "Erro interno ao criar carteira" });
    }
});
exports.routerCarteira.get("/pocket-information/:id", JWTverifier_1.validateJWT, async (req, res) => {
    const { id } = req.params;
    const userData = await (0, JWTverifier_1.extractUserDataFromToken)(req, res);
    if (!userData || "status" in userData)
        return;
    const pocketId = Number(id);
    if (isNaN(pocketId)) {
        res.status(400).json({ message: "ID inválido" });
    }
    try {
        const pocket = await pisma_1.default.portfolio.findUnique({
            where: { id: pocketId },
        });
        if (!pocket) {
            res.status(404).json({ message: "Carteira não encontrada" });
        }
        res.status(200).json(pocket);
    }
    catch (error) {
        console.error("Erro ao buscar carteira:", error);
        res.status(500).json({ message: "Erro interno ao buscar carteira" });
    }
});
