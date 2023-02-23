import { PrismaClient } from "@prisma/client";
import { Express, RequestHandler } from "express";
import { controller } from "../lib/controller";
import { RequestWithSession } from "..";

type CreateSchedule = {
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
    const { type, description, monday, tuesday, wednesday, thursday, friday, saturday, sunday } = req.body as CreateSchedule;
    const id = Number(req.params.id);

    // check that user is logged in
    if (!req.user) {  
      res.status(401).json({ message: " unauthorized"});
      return;
    }

    // make sure user puts in the needed info
    if (!type || !description || !monday || !tuesday || !wednesday || !thursday || !friday || !saturday || !sunday) {
      res.status(400).json({ message: "the schedule needs a specific type, description, and days of the week" });
      return;
    }

    // check type constraints
    if (!(["feed", "record", "clean"].includes(type))) {
      res.status(400).json({ message: "the schedule's type must be one of the following: feed, record, or clean" });
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
    res.json({ schedule });

  }

const ListReptileSchedules = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // find the reptile in question and check that it belongs to the user
    const reptile = await client.reptile.findMany({
      where: {
        userId: req.user.id
      }
    })

    // check that the requested reptile even exists
    if (!reptile) {
      res.status(400).json({ message: "this reptile does not exist" });
      return;
    }

    // check that the requested reptile has schedules
    let reptileSchedules = reptile.schedule;
    if (reptileSchedules.length <= 0) {
      res.status(400).json({ message: "reptile has no schedules" });
      return;
    }

    // return the reptile schedules
    res.json({ reptileSchedules });
  }

  const ListUserSchedules = (client: PrismaClient): RequestHandler =>
  async (req: RequestWithSession, res) => {
    // check that the current user is signed in
    if (!req.user) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }

    // check that the requested reptile has schedules
    let userSchedules = user.schedule;
    if (userSchedules.length <= 0) {
      res.status(400).json({ message: "user has no schedules" });
      return;
    }

    // return the reptile schedules
    res.json({ userSchedules });
  }

export const schedulesController = controller(
    "schedules",
    [
      { path: "/", method: "post", endpointBuilder: CreateSchedule },
      { path: "/:reptileId", method: "get", endpointBuilder: ListReptileSchedules },
      { path: "/", method: "get", endpointBuilder: ListUserSchedules },
    ]
  )
