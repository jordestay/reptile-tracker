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



export const schedulesController = controller(
    "schedules",
    [
      { path: "/", method: "post", endpointBuilder: CreateSchedule },
      //{ path: "/:reptileId", method: "get", endpointBuilder: ListReptileSchedules },
      //{ path: "/", method: "get", endpointBuilder: ListUserSchedules },
    ]
  )
