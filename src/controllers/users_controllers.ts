import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { RequestWithJWTBody } from "../dto/session";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

const getMe = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    if (req.session) {
      res.json({ user: req.user });
    } else {
      res.status(401).json({ message: "unauthorized"});
    }
  }

type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}

const createUser = (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const {firstName, lastName, email, password} = req.body as CreateUserBody;
  const passwordHash = await bcrypt.hash(password, 10);
  const existingUser = await client.user.findFirst({
    where: {
      email,
    }
  });
  if (existingUser) res.status(400).json({ message: "user already exists"});
  else {
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
    res.cookie("session-token", user.sessions[0].token, {
      httpOnly: true,
      maxAge: 60000 * 30
    });
  
    res.json({ user });
  }
  }


export const usersController = controller(
  "users",
  [
    { path: "/user", endpointBuilder: getMe, method: "get" },
    { path: "/", method: "post", endpointBuilder: createUser }
  ]
)