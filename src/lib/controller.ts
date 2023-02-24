import { PrismaClient } from "@prisma/client"
import express, { RequestHandler, Express } from "express"

export type Route = {
  path: string,
  method: "post" | "put" | "get" | "delete",
  endpointBuilder: (client: PrismaClient) => RequestHandler,
  // skipAuth?: boolean
}

export const controller = (name: string, routes: Route[]) => (app: Express, client: PrismaClient) => {
  const router = express.Router();
  routes.forEach(route => {
   
    router[route.method](route.path, route.endpointBuilder(client));
  })
  app.use(`/${name}`, router);
}