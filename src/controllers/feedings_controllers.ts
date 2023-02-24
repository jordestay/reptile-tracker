import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

//
// ------------------------------------------------------ Creat Feeding ----------------------------------------------------------
//
type FeedingReptile = {
  foodItem: string,
}

const CreateFeeding = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { foodItem } = req.body as FeedingReptile;
    const id = Number(req.params.reptileId);

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    // make sure user puts in the needed info
    if (!foodItem) {
      res.status(400).json({ message: "A feeding needs a foodItem." });
      return;
    }

    // validate input
    if (typeof foodItem !== "string") {
      res.status(400).json({ message: "The feeding's foodItem must be a string." });
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
      res.status(400).json({ message: "this reptile doesn't exist" });
      return;
    }

    // create requested feeding
    const feeding = await client.feeding.create({
      data: {
        foodItem,
        reptileId: id,
      }
    });

    // return the newly created reptile
    res.json({ message: "Feeding created." });
  }


//
// --------------------------------------------------------- List Feedings ----------------------------------------------------------
//  
const ListFeedings = (client: PrismaClient): RequestHandler =>
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

    const feedings = await client.feeding.findMany({
      where: {
        reptileId: id
      }
    })

    // check that the reptile has feedings
    if (!feedings) {
      res.status(400).json({ message: "Reptile has no feedings." });
      return;
    }

    res.json({ feedings });
  }



export const feedingsController = controller(
  "feedings",
  [
    { path: "/:reptileId", method: "post", endpointBuilder: CreateFeeding },
    { path: "/:reptileId", method: "get", endpointBuilder: ListFeedings },
  ]
)