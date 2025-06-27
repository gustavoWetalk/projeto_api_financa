"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = sessionGenerator;
const pisma_1 = __importDefault(require("../pisma"));
const crypto = require("crypto");
async function sessionGenerator(user) {
    const randomCode = generateRandomCode(8);
    try {
        const deleteSessionsUser = await pisma_1.default.sessions.deleteMany({
            where: {
                ses_user: user,
            },
        });
        const saveSession = await pisma_1.default.sessions.create({
            data: {
                ses_key: randomCode,
                ses_city: "any",
                ses_country: "any",
                ses_ip: "any",
                ses_location: "any",
                ses_state: "any",
                ses_timezone: "any",
                ses_user: user,
            },
        });
        return randomCode;
    }
    catch (error) {
        console.log(error);
        return "Error";
    }
}
function generateRandomCode(length) {
    return crypto.randomBytes(length).toString("hex");
}
