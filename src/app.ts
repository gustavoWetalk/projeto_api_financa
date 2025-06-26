import express from "express";
import cors from "cors";

import { routerAuth } from "./router/auth";
import { routerCarteira } from "./router/carteira";


export const app = express();
app.use(cors());

app.use(express.json());

app.use("/auth", routerAuth);
app.use("/pocket", routerCarteira);
