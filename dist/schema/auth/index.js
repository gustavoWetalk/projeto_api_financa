"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    userName: zod_1.z.string().nonempty("Informações sem dados não são aceitas"),
    email: zod_1.z
        .string()
        .nonempty("Informações sem dados não são aceitas")
        .email("Email inválido"),
    password: zod_1.z
        .string()
        .nonempty("Informações sem dados não são aceitas")
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/, "A senha deve conter pelo menos um caractere especial e uma letra maiúscula"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
