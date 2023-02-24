import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

//
// --------------------------------------------------- Create a Husbandry -------------------------------------------------------
//
type CreateHusbandryBody = {
  length: number,
  weight: number,
  temperature: number,
  humidity: number,
}

const CreateHusbandry = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { length, weight, temperature, humidity } = req.body as CreateHusbandryBody;
    const id = Number(req.params.reptileId);

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    // make sure user puts in the needed info
    if (!length || !weight || !temperature || !humidity) {
      res.status(400).json({ message: "A reptile needs a specific length, weight, temperature, and humidity." });
      return;
    }

    // validate input
    if (
      typeof length !== "number" ||
      typeof weight !== "number" ||
      typeof temperature !== "number" ||
      typeof humidity !== "number"
    ) {
      res.status(400).json({ message: "Husbandry length, weight, temperature, and humidity must be numbers." });
      return;
    }

    // check that reptile exists
    const reptile = await client.reptile.findFirst({
      where: {
        id,
        userId: req.user.id,
      }
    })

    if (!reptile) {
      res.status(400).json({ message: "This reptile doesn't exist." });
      return;
    }

    // create requested reptile
    const husbandry = await client.husbandryRecord.create({
      data: {
        length,
        weight,
        temperature,
        humidity,
        reptileId: id,
      }
    });

    res.json({ message: "Husbandry created." });
  }


//
// ------------------------------------------------------- List Husbandries ----------------------------------------------------
//
const ListHusbandries = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const id = Number(req.params.reptileId);

    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    // check that reptile exists
    const reptile = await client.reptile.findFirst({
      where: {
        id,
        userId: req.user.id,
      }
    })

    if (!reptile) {
      res.status(400).json({ message: "This reptile doesn't exist." });
      return;
    }

    const husbandries = await client.husbandryRecord.findMany({
      where: {
        reptileId: id
      }
    })

    // check that the reptile has husbandries
    if (!husbandries) {
      res.status(400).json({ message: "Reptile has no husbandries." });
      return;
    }

    res.json({ husbandries });
  }



export const husbandriesController = controller(
  "husbandries",
  [
    { path: "/:reptileId", method: "post", endpointBuilder: CreateHusbandry },
    { path: "/:reptileId", method: "get", endpointBuilder: ListHusbandries },
  ]
)