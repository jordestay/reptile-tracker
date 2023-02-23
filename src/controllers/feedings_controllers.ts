import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

type FeedingReptile = {
  foodItem: string,
}

const CreateFeeding = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { foodItem } = req.body as FeedingReptile;
    const id = Number(req.params.id);

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // make sure user puts in the needed info
    if (!foodItem){
      res.status(400).json({ message: "a reptile needs a food item" });
      return;
    }

    // check that reptile exists
    const reptile = await client.reptile.findFirst({
      where: {
        id
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
    res.json({ feeding });
  }

  const ListFeedings = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const id = Number(req.params.id);

    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // check that reptile exists
    const reptile = await client.reptile.findFirst({
      where: {
        id
      }
    })

    if (!reptile) {
      res.status(400).json({ message: "this reptile doesn't exist" });
      return;
    }

    // find the reptile in question and check that it belongs to the user
    const feedings = await client.feeding.findMany({
      where: {
        reptileId: id
      }
    })

    // check that the requested reptile even exists
    if (!feedings) {
      res.status(400).json({ message: "reptile has no feedings" });
      return;
    }

    // return the new reptile
    res.json({ feedings });
  }

  export const feedingsController = controller(
    "feedings",
    [
      { path: "/:id", method: "post", endpointBuilder: CreateFeeding },
      { path: "/:id", method: "get", endpointBuilder: ListFeedings },
    ]
  )