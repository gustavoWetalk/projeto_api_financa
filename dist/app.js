"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./router/auth");
const carteira_1 = require("./router/carteira");
exports.app = (0, express_1.default)();
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.get("/", (_req, res) => {
    console.log("👉 GET / recebido"); // <<–– adicione isso
    res.status(200).json({ ok: true, message: "API Finança no ar!" });
});
exports.app.use("/auth", auth_1.routerAuth);
exports.app.use("/pocket", carteira_1.routerCarteira);
