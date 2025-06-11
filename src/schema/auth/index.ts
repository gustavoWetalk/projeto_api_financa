import { z } from "zod";

const userSchema = z.object({
  userName: z.string().nonempty("Informações sem dados não são aceitas"),
  email: z
    .string()
    .nonempty("Informações sem dados não são aceitas")
    .email("Email inválido"),
  password: z
    .string()
    .nonempty("Informações sem dados não são aceitas")
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(
      /^(?=.*[!@#$%^&*])(?=.*[A-Z]).+$/,
      "A senha deve conter pelo menos um caractere especial e uma letra maiúscula"
    ),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
