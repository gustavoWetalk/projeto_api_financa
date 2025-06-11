import prisma from "../pisma";
const crypto = require("crypto");
export default async function sessionGenerator(user:any) {
  const randomCode: string = generateRandomCode(8);
  try {
    const deleteSessionsUser = await prisma.sessions.deleteMany({
      where: {
        ses_user: user,
      },
    });

    const saveSession = await prisma.sessions.create({
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
  } catch (error) {
    console.log(error);
    return "Error";
  }
}

function generateRandomCode(length: number) {
  return crypto.randomBytes(length).toString("hex");
}
