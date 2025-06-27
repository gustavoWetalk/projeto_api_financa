"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUserDataFromToken = exports.validateCarrierToken = exports.validateJWT = exports.getSessionKey = exports.extractUserFromToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pisma_1 = __importDefault(require("../pisma"));
const extractUserFromToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && typeof decoded === "object" && "user" in decoded) {
            return decoded["user"];
        }
        return null;
    }
    catch (error) {
        throw new Error("Error decoding the JWT token");
    }
};
exports.extractUserFromToken = extractUserFromToken;
const getSessionKey = async (user) => {
    try {
        const session = await pisma_1.default.sessions.findFirst({
            where: {
                ses_user: user,
            },
            select: {
                ses_key: true,
            },
        });
        if (session) {
            return session.ses_key;
        }
        else {
            return null;
        }
    }
    catch (error) {
        throw new Error("Error finding the session key");
    }
};
exports.getSessionKey = getSessionKey;
const validateJWT = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.status(401).json({ message: "Authorization token not provided." });
        return;
    }
    const userId = (0, exports.extractUserFromToken)(token);
    if (userId === null) {
        res.status(401).json({ message: "Invalid JWT token." });
        return;
    }
    (0, exports.getSessionKey)(userId)
        .then(secretKey => {
        if (!secretKey) {
            res.status(401).json({ message: "Invalid JWT token." });
            return;
        }
        try {
            jsonwebtoken_1.default.verify(token, secretKey);
            next();
        }
        catch {
            res.status(401).json({ message: "Invalid authorization token." });
        }
    })
        .catch(err => {
        next(err);
    });
};
exports.validateJWT = validateJWT;
const validateCarrierToken = async (req, res, next) => {
    const token = req.header("token");
    if (!token) {
        return res
            .status(401)
            .json({ message: "Authorization token not provided." });
    }
    const expectedStaticToken = "WgvnmhsORGnCTZIHhxLrfjflbaOFQUPtQgjGuKcW";
    // Se o token enviado for o token fixo, libera o acesso imediatamente
    if (token === expectedStaticToken) {
        return next();
    }
    return res.status(401).json({ message: "Invalid JWT token." });
};
exports.validateCarrierToken = validateCarrierToken;
const extractUserDataFromToken = async (req, res) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Invalid session data" });
    }
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (decoded && typeof decoded === "object" && "user" in decoded) {
            const user = await pisma_1.default.user.findFirst({
                where: { id: decoded["user"] },
            });
            if (!user) {
                return null;
            }
            return user;
        }
        return null;
    }
    catch (error) {
        console.error("Error decoding the JWT token:", error);
        throw new Error("Error decoding the JWT token");
    }
};
exports.extractUserDataFromToken = extractUserDataFromToken;
