import express, { Request, RequestHandler } from "express";
import { PrismaClient, Session, User } from "@prisma/client";
const client = new PrismaClient();
const app = express();
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import cookieParser from "cookie-parser";
import createServer from "connect";

app.use(express.json());
app.use(cookieParser());

type RequestWithSession = Request & {
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

type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}
//sign up
app.post('/users', async (req, res) => {
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
      maxAge: 60000 * 10
    });
  
    res.json({ user });
  }
});

type LoginBody = {
  email: string,
  password: string
}

// log in
app.post("/sessions",  async (req, res) => {
  const {email, password} = req.body as LoginBody;
  const user = await client.user.findFirst({
    where: {
      email,
    },
    include: {
      sessions: true,
      reptiles: true
    }
  });
  if (!user) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    res.status(404).json({ message: "Invalid email or password" });
    return;
  }

  const token = uuidv4();
  const session = await client.session.create({
    data: {
      userId: user.id,
      token,
    }
  })

  res.cookie("session-token", session.token, {
    httpOnly: true,
    maxAge: 60000 * 10
  })

  res.json({user});
});

app.get("/me", async (req: RequestWithSession, res) => {
  if (req.session) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "unauthorized"});
  }
})

type CreateReptile = {
  species: string,
  name: string,
  sex: string,
}

app.post('/reptiles', async (req: RequestWithSession, res) => {
  const {species, name, sex} = req.body as CreateReptile;
  if (req.user) {
    const reptile = await client.reptile.create({
      data: {
        userId: req.user.id,
        species,
        name,
        sex,
      }
    });
    res.json({ reptile });

  } else {
    res.status(400).json({message: "unauthorized"});
  }
});

app.put('/reptiles/:id', async(req: RequestWithSession, res) => {
  const {species, name, sex} = req.body as CreateReptile;
  const id = Number(req.params.id);
  
  const oldReptile = await client.reptile.findFirst({
    where: {
      id,
    }
  })
  // TODO: check that that reptile even exists
  if (req.user) {
    // TODO: check that the reptile belongs to the current user
    const species = "a;lsdfj";
    const user = await client.user.findFirst({
      where: {
        email: req.user.email
      }
    })
    const reptile = await client.reptile.update({
      where: {
        id,
      },
      data: {
        species: species || oldReptile?.species,
        name: name || oldReptile?.name,
        sex: sex || oldReptile?.sex,
      }
    });
    res.json({ reptile });
  } else {
    res.status(400).json({message: "unauthorized"});

  }
});

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});