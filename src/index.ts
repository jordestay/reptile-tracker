import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
const client = new PrismaClient();
const app = express();
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import { usersController } from "./controllers/users_controllers";
import { reptilesController } from "./controllers/reptiles_controllers";
import { feedingsController } from "./controllers/feedings_controllers";
import { husbandriesController } from "./controllers/husbandry_controllers";
import { schedulesController } from "./controllers/schedule_controllers";
import cors from 'cors';


app.use(express.json());
app.use(cookieParser());
app.use(cors());


//
// ------------------------------------------ Authentication -------------------------------------------------
//
export type RequestWithSession = Request & {
  session?: Session
  user?: User
}

const authenticationMiddleware: RequestHandler = async (req: RequestWithSession, res, next) => {
  const sessionToken = req.cookies["session-token"];
  if (sessionToken) {
    const session = await client.session.findFirst({
      where: {
        token: sessionToken
      },
      include: {
        user: true
      }
    });
    if (session) {
      req.session = session;
      req.user = session.user;
    }
  }
  next();
}

app.use(authenticationMiddleware);

//
// ---------------------------------------------- Controllers ---------------------------------------------------
//
usersController(app, client);
reptilesController(app, client);
feedingsController(app, client);
husbandriesController(app, client);
schedulesController(app, client);

//
// ------------------------------------------------- Login -----------------------------------------------------
//
type LoginBody = {
  email: string,
  password: string
}

app.post("/sessions", async (req, res) => {
  const { email, password } = req.body as LoginBody;

  const user = await client.user.findFirst({
    where: {
      email,
    },
    // include: {
    //   sessions: true,
    //   reptiles: true
    // }
  });

  // check that user with given email exists
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  // check password validity
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  // create a session
  const token = uuidv4();
  const session = await client.session.create({
    data: {
      userId: user.id,
      token,
    }
  })

  // return the session cookie to the user
  res.cookie("session-token", session.token, {
    httpOnly: true,
    maxAge: 60000 * 30
  })

  res.json({ message: "Successfully logged in." });
});



app.get("/", (req, res) => {
  // res.status(404).send(`<h1>Welcome to Reptile Tracker!</h1>`);
  res.status(401).send({ message: "unauthorized" });
});

app.post("/:anything", (req, res) => {
  res.status(400).send({ message: "Bad request." });
});

app.put("/:anything", (req, res) => {
  res.status(400).send({ message: "Bad request." });
});

app.delete("/:anything", (req, res) => {
  res.status(400).send({ message: "Bad request." });
});

app.get("/:anything", (req, res) => {
  res.status(404).send(`<h1>Page not found</h1>`);
});

app.listen(parseInt(process.env.PORT || "3000"), () => {
  console.log(`App running on port ${process.env.PORT || "3000"}`);
});