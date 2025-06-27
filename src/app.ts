import express from "express";
import cors from "cors";

import { routerAuth } from "./router/auth";
import { routerCarteira } from "./router/carteira";


export const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (_req, res) => {
  console.log("👉 GET / recebido");     // <<–– adicione isso
  res.status(200).json({ ok: true, message: "API Finança no ar!" });
});

app.use("/auth", routerAuth);
app.use("/pocket", routerCarteira);
