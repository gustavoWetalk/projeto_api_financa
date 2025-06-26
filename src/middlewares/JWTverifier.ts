import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import prisma from "../pisma";

export const extractUserFromToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === "object" && "user" in decoded) {
      return decoded["user"];
    }
    return null;
  } catch (error) {
    throw new Error("Error decoding the JWT token");
  }
};

export const getSessionKey = async (user: number) => {
  try {
    const session = await prisma.sessions.findFirst({
      where: {
        ses_user: user,
      },
      select: {
        ses_key: true,
      },
    });

    if (session) {
      return session.ses_key;
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error finding the session key");
  }
};

export const validateJWT: RequestHandler = (
  req, 
  res, 
  next
) => {
  const token = req.header("Authorization");
  if (!token) {
    res.status(401).json({ message: "Authorization token not provided." });
    return;
  }

  const userId = extractUserFromToken(token);
  if (userId === null) {
    res.status(401).json({ message: "Invalid JWT token." });
    return;
  }

  getSessionKey(userId)
    .then(secretKey => {
      if (!secretKey) {
        res.status(401).json({ message: "Invalid JWT token." });
        return;
      }

      try {
        jwt.verify(token, secretKey as Secret);
        next();
      } catch {
        res.status(401).json({ message: "Invalid authorization token." });
      }
    })
    .catch(err => {
      next(err);
    });
};
export const validateCarrierToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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


export const extractUserDataFromToken = async (req: Request, res: Response) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Invalid session data" });
  }

  try {
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === "object" && "user" in decoded) {
      const user = await prisma.user.findFirst({
        where: { id: decoded["user"] },
      });
      if (!user) {
        return null;
      }
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error decoding the JWT token:", error);
    throw new Error("Error decoding the JWT token");
  }
};
