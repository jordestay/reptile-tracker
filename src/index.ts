import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
import path from "path";
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
import { engine } from "express-handlebars";
import manifest from "./static/manifest.json";

app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "/views"));

// app.use(cors({
//   origin: "http://localhost:5173"
// }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());



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

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    if (req.path.match(/\.\w+$/)) {
      fetch(`${process.env.ASSET_URL}/${req.path}`).then((response) => {
        if (response.ok) {
          res.redirect(response.url);
        } else {
          // handle dev problems here
        }
      });
    } else {
      next();
    }
  })
} else {
  app.use("/static", express.static(path.join(__dirname, "static")))
  // do prod things
}

app.get("/", (req, res) => {
  // console.log(req);
  // res.status(404).send(`<h1>Welcome to Reptile Tracker!</h1>`);
  // res.setHeader("Access-Control-Allow-Credentials", true);
  // res.status(401).send({ message: "unauthorized" });
  // console.log(process.env.NODE_ENV);
  // console.log(process.env.ASSET_URL);
  // if (process.env.NODE_ENV === "production") {
  //   res.render("app", {
  //     development: false,
  //     jsUrl: manifest["src/main.tsx"].file,
  //     cssUrl: manifest["src/main.css"].file
  //   })
  // } else {
  //   res.render("app", {
  //     name: "Joseph",
  //     development: true,
  //     assetUrl: process.env.ASSET_URL,
  //   });
  // }
  res.send(`<h1>hllo</h1>`)
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