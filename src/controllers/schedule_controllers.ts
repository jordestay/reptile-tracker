import { PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

//
// ------------------------------------------------------ Create a Schedule ---------------------------------------------------
//
type CreateScheduleBody = {
  type: string,
  description: string,
  monday: boolean,
  tuesday: boolean,
  wednesday: boolean,
  thursday: boolean,
  friday: boolean,
  saturday: boolean,
  sunday: boolean,
}

const CreateSchedule = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateScheduleBody;
    const id = Number(req.params.reptileId);

    // check that user is logged in
    if (!req.user) {
      res.status(401).json({ message: " unauthorized" });
      return;
    }

    // make sure user puts in the needed info
    if (
      !type ||
      !description ||
      monday === undefined ||
      tuesday === undefined ||
      wednesday === undefined ||
      thursday === undefined ||
      friday === undefined ||
      saturday === undefined ||
      sunday === undefined
    ) {
      res.status(400).json({ message: "The schedule needs a specific type, description, and days of the week." });
      return;
    }

    // validate input types
    if (typeof type !== "string" || typeof description !== "string") {
      res.status(400).json({ message: "The feeding's type and description must be strings." });
      return;
    }

    // validate days of the week
    if (
      typeof monday !== "boolean" ||
      typeof tuesday !== "boolean" ||
      typeof wednesday !== "boolean" ||
      typeof thursday !== "boolean" ||
      typeof friday !== "boolean" ||
      typeof saturday !== "boolean" ||
      typeof sunday !== "boolean"
    ) {
      res.status(400).json({ message: "Days of the week must be booleans." });
      return;
    }

    // check type constraints
    if (!(["feed", "record", "clean"].includes(type))) {
      res.status(400).json({ message: "The schedule's type must be one of the following: feed, record, or clean." });
      return;
    }

    // check that reptile exists
    const reptile = await client.reptile.findFirst({
      where: {
        id
      }
    });

    if (!reptile) {
      console.log("oops");
      res.status(400).json({ message: "This reptile doesn't exist." });
      return;
    }

    // create requested schedule
    const schedule = await client.schedule.create({
      data: {
        userId: req.user.id,
        reptileId: id,
        type,
        description,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
      }
    });

    // return the newly created schedule
    res.json({ 
      message: "Schedule created.",
      schedule
    });
  }

//
// --------------------------------------------------- List a Reptile's Schedules ----------------------------------------------------
//
const ListReptileSchedules = (client: PrismaClient): RequestHandler =>
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
      res.status(400).json({ message: "This reptile does not exist." });
      return;
    }

    const schedules = await client.schedule.findMany({
      where: {
        reptileId: id
      }
    })

    // check if there are any schedules
    if (!schedules) {
      res.status(400).json({ message: "Reptile has no schedules." });
      return;
    }

    // return the reptile schedules
    res.json({ schedules });
  }

//
// --------------------------------------------------- List a User's Reptiles -------------------------------------------------------
//
const ListUserSchedules = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized." });
      return;
    }

    const schedules = await client.schedule.findMany({
      where: {
        userId: req.user.id
      }
    })

    // check if user has any schedules
    if (!schedules) {
      res.status(400).json({ message: "User has no schedules." });
      return;
    }

    // return the user's schedules
    res.json({ schedules });
  }



export const schedulesController = controller(
  "schedules",
  [
    { path: "/:reptileId", method: "post", endpointBuilder: CreateSchedule },
    { path: "/:reptileId", method: "get", endpointBuilder: ListReptileSchedules },
    { path: "/", method: "get", endpointBuilder: ListUserSchedules },
  ]
);