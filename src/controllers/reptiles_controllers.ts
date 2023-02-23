import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

type CreateReptile = {
  species: string,
  name: string,
  sex: string,
}

const CreateReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { species, name, sex } = req.body as CreateReptile;

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // make sure user puts in the needed info
    if (!species || !name || !sex) {
      res.status(400).json({ message: "a reptile needs a specific species, name, and sex" });
      return;
    }

    // create requested reptile
    const reptile = await client.reptile.create({
      data: {
        userId: req.user.id,
        species,
        name,
        sex,
      }
    });

    // return the newly created reptile
    res.json({ reptile });
  }

const UpdateReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { species, name, sex } = req.body as CreateReptile;
    const id = Number(req.params.id);

    // check that the current user is signed in
    if (!req.user) {
      res.status(400).json({ message: "unauthorized" });
      return;
    }

    // find the reptile in question and check that it belongs to the user
    const oldReptile = await client.reptile.findFirst({
      where: {
        id,
        userId: req.user.id,
      }
    })

    // check that the requested reptile even exists
    if (!oldReptile) {
      res.status(400).json({ message: "this reptile does not exist" });
      return;
    }

    // update the reptile in question
    const reptile = await client.reptile.update({
      where: {
        id: oldReptile.id,
      },
      data: {
        species: species || oldReptile.species,
        name: name || oldReptile.name,
        sex: sex || oldReptile.sex,
      }
    });

    // return the new reptile
    res.json({ reptile });
  }

const DeleteReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const id = Number(req.params.id);

    // check that the current user is signed in
    if (!req.user) {
      res.status(400).json({ message: "unauthorized" });
      return;
    }

    // find the reptile in question and check that it belongs to the user
    const oldReptile = await client.reptile.findFirst({
      where: {
        id,
        userId: req.user.id,
      }
    })

    // check that the requested reptile even exists
    if (!oldReptile) {
      res.status(400).json({ message: "this reptile does not exist" });
      return;
    }

    // update the reptile in question
    const reptile = await client.reptile.delete({
      where: {
        id: oldReptile.id,
      }
    });

    // return the new reptile
    res.json({ message: "successfully deleted" });
  }

const ListReptiles = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    // check that the current user is signed in
    if (!req.user) {
      res.status(400).json({ message: "unauthorized" });
      return;
    }

    // find the reptile in question and check that it belongs to the user
    const reptiles = await client.reptile.findMany({
      where: {
        userId: req.user.id
      }
    })

    // check that the requested reptile even exists
    if (!reptiles) {
      res.status(400).json({ message: "user has no reptiles" });
      return;
    }

    // return the new reptile
    res.json({ reptiles });
  }

export const reptilesController = controller(
  "reptiles",
  [
    { path: "/", method: "post", endpointBuilder: CreateReptile },
    { path: "/reptile", method: "put", endpointBuilder: UpdateReptile },
    { path: "/reptile", method: "delete", endpointBuilder: DeleteReptile },
    { path: "/", method: "get", endpointBuilder: ListReptiles },
  ]
)