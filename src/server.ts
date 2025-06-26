import { createServer } from "http";
import { app } from "./app";
import { Server } from "socket.io";
import { extractUserFromToken } from "./middlewares/JWTverifier";

const PORT = process.env.PORT || 3001;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Autenticação necessária"));

    const userData = await extractUserFromToken(token);
    console.log(userData);
    socket.data.user = {
      usr_id: userData,
    };

    next();
  } catch (error) {
    next(new Error("Autenticação inválida"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.user.usr_id;
  console.log(`Usuário conectado: ${userId}`);
  socket.join(userId);
  socket.on("atualizar-telefone", async (newPhone) => {});
  socket.on("disconnect", () => {
    console.log(`Usuário desconectado: ${userId}`);
  });
});
export { httpServer, io };

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
