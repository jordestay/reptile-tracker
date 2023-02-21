import express from "express";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();
const app = express();
app.use(express.json());

// BASE CODE----------------------------------
app.post('/users', async (req, res) => {
  const user = await client.user.create({
    data: {
      firstName: "Joseph",
      lastName: "Ditton",
      email: "joseph.ditton@usu.edu",
      passwordHash: "q23oejklnvzlskjfdnf"
    }
  });
  res.json({ user });
});

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json({ users });
})

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});

//-------------------------------------------------------

const getMe = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await client.user.findFirst({
      where: {
        id: userId
      }
    });

    res.json({ user });
    // TODO get the user
    return user.userId;
  }

type CreateUserBody = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
}


type CreateReptile = {
  id: string,
  user: string,
  species: string,
  name: string,
  sex: string,
}

const postReptile = (client: PrismaClient): RequestHandler =>
  async (req, res) => {
    const user = //TODO
    const {id, user, species, name, sex} = req.body as CreateReptile;
    const reptile = await client.reptile.create({
      data: {
        id,
        user,
        species,
        name,
        sex,
      },
    });

app.post('/reptiles', async (req, res) => {
  const reptile = await client.reptile.create({
    data: {
      id: "",
      user: "",
      species: "",
      name: "",
      sex: "",
      createdAt: "",
      updatedAt: "",
    }
  });
  res.json({ reptile });
});

app.get("/users", async (req, res) => {
  const users = await client.user.findMany();
  res.json({ users });
})

app.get("/", (req, res) => {
  res.send(`<h1>Hello, world!</h1>`);
});

app.listen(3000, () => {
  console.log("I got started!");
});
