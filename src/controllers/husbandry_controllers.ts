import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

type HusbandryReptile = {
  length: number,
  weight: number,
  temperature: number,
  humidity: number,
}

const CreateHusbandry = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { length, weight, temperature, humidity } = req.body as HusbandryReptile;
    const id = Number(req.params.id);

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // make sure user puts in the needed info
    if (!length || !weight || !temperature || !humidity) {
      res.status(400).json({ message: "a reptile needs a specific length, weight, temperature, and humidity" });
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

    // return the newly created husbandry
    res.json({ husbandry });
  }

const ListHusbandries = (client: PrismaClient): RequestHandler =>
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
    const husbandries = await client.husbandryRecord.findMany({
      where: {
        reptileId: id
      }
    })

    // check that the requested reptile even exists
    if (!husbandries) {
      res.status(400).json({ message: "reptile has no feedings" });
      return;
    }

    // return the new reptile
    res.json({ husbandries });
  }

export const husbandriesController = controller(
  "husbandries",
  [
    { path: "/:id", method: "post", endpointBuilder: CreateHusbandry },
    { path: "/:id", method: "get", endpointBuilder: ListHusbandries },
  ]
)