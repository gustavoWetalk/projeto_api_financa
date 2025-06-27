"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.httpServer = void 0;
const http_1 = require("http");
const app_1 = require("./app");
const socket_io_1 = require("socket.io");
const JWTverifier_1 = require("./middlewares/JWTverifier");
const PORT = process.env.PORT || 8080;
const httpServer = (0, http_1.createServer)(app_1.app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
});
exports.io = io;
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error("Autenticação necessária"));
        const userData = await (0, JWTverifier_1.extractUserFromToken)(token);
        console.log(userData);
        socket.data.user = {
            usr_id: userData,
        };
        next();
    }
    catch (error) {
        next(new Error("Autenticação inválida"));
    }
});
io.on("connection", (socket) => {
    const userId = socket.data.user.usr_id;
    console.log(`Usuário conectado: ${userId}`);
    socket.join(userId);
    socket.on("atualizar-telefone", async (newPhone) => { });
    socket.on("disconnect", () => {
        console.log(`Usuário desconectado: ${userId}`);
    });
});
if (process.env.NODE_ENV !== "test") {
    httpServer.listen(PORT, () => {
        console.log(`Servidor ouvindo na porta ${PORT}`);
    });
}
process.on("SIGINT", () => {
    httpServer.close(() => {
        console.log("Servidor finalizado");
    });
});
