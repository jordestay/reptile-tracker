import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

//
// -------------------------------------------------- Create a Reptile --------------------------------------------------
//
type CreateReptileBody = {
  species: string,
  name: string,
  sex: string,
}

const CreateReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { species, name, sex } = req.body as CreateReptileBody;

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    // make sure user puts in the needed info
    if (!species || !name || !sex) {
      res.status(400).json({ message: "A reptile needs a specific species, name, and sex." });
      return;
    }

    // check species type
    if (!(["ball_python", "king_snake", "corn_snake", "redtail_boa"].includes(species))) {
      res.status(400).json({ message: "A reptile's species must one of the following: ball_python, king_snake, corn_snake, or redtail_boa." });
      return;
    }

    // check sex type
    if (!(["m", "f"].includes(sex))) {
      res.status(400).json({ message: "A reptile's sex must one of the following: m or f." });
      return;
    }

    // validate input
    if (typeof species !== "string" || typeof name !== "string" || typeof sex !== "string") {
      res.status(400).json({ message: "The reptile's species, name, and sex must be strings." });
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
    res.json({ message: "Reptile created." });
  }

//
// --------------------------------------------------- Update Reptile ----------------------------------------------------
//  
const UpdateReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { species, name, sex } = req.body as CreateReptileBody;
    const id = Number(req.params.reptileId);

    // check that the current user is signed in
    if (!req.user) {
      res.status(400).json({ message: "Unauthorized." });
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
      res.status(400).json({ message: "This reptile does not exist." });
      return;
    }

    // make sure user puts in the needed info
    if (!species || !name || !sex) {
      res.status(400).json({ message: "A reptile needs a specific species, name, and sex." });
      return;
    }

    // check species type
    if (!(["ball_python", "king_snake", "corn_snake", "redtail_boa"].includes(species))) {
      res.status(400).json({ message: "A reptile's species must one of the following: ball_python, king_snake, corn_snake, or redtail_boa." });
      return;
    }

    // check sex type
    if (!(["m", "f"].includes(sex))) {
      res.status(400).json({ message: "A reptile's sex must one of the following: m or f." });
      return;
    }

    // validate input
    if (typeof species !== "string" || typeof name !== "string" || typeof sex !== "string") {
      res.status(400).json({ message: "The reptile's species, name, and sex must be strings." });
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
    res.json({ 
      message: "Reptile updated.",
      reptile
    });
  }

const DeleteReptile = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const id = Number(req.params.reptileId);

    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
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
      res.status(400).json({ message: "This reptile does not exist." });
      return;
    }

    // delete the reptile in question
    const reptile = await client.reptile.delete({
      where: {
        id: oldReptile.id,
      }
    });

    res.json({ message: "Reptile deleted." });
  }

const ListReptiles = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    const reptiles = await client.reptile.findMany({
      where: {
        userId: req.user.id
      }
    })

    // check that there are any reptiles
    if (!reptiles) {
      res.status(400).json({ message: "User has no reptiles." });
      return;
    }

    // return the list of reptiles
    res.json({ reptiles });
  }



export const reptilesController = controller(
  "reptiles",
  [
    { path: "/", method: "post", endpointBuilder: CreateReptile },
    { path: "/:reptileId", method: "put", endpointBuilder: UpdateReptile },
    { path: "/:reptileId", method: "delete", endpointBuilder: DeleteReptile },
    { path: "/", method: "get", endpointBuilder: ListReptiles },
  ]
)