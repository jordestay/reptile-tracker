import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

const getMe = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    if (req.session) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  }

//
// ---------------------------------------------------- Create User --------------------------------------------------------
//
type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

const createUser = (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const { firstName, lastName, email, password } = req.body as CreateUserBody;

    // check that required info is given
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ message: "A user needs a firstName, lastName, email, and password." });
      return;
    }

    // validate input
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({ message: "A user's firstName, lastName, email, and password must be strings." });
      return;
    }

    // check if the account being created already exists
    const existingUser = await client.user.findFirst({
      where: {
        email,
      }
    });

    if (existingUser) res.status(400).json({ message: "User already exists." });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await client.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        sessions: {
          create: [{
            token: uuidv4()
          }]
        }
      },
      include: {
        sessions: true
      }
    });

    // send a session cookie back
    res.cookie("session-token", user.sessions[0].token, {
      httpOnly: true,
      maxAge: 60000 * 30
    });

    res.json({ message: "User created." });
  }



export const usersController = controller(
  "users",
  [
    { path: "/user", endpointBuilder: getMe, method: "get" },
    { path: "/", method: "post", endpointBuilder: createUser }
  ]
)