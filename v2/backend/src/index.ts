import express, { NextFunction, Request, RequestHandler, Response } from "express";
import cors from "cors";
import fs from "fs";

import { scrapeBuildingData } from "./helpers";
import {
  parseDate as parseDatetime,
  parseFilters,
  getAllRoomStatus,
  getAllBuildings,
  getRoomAvailability,
} from "./service";
import { DATABASE_PATH, PORT } from "./config";

const app = express();
app.use(cors());

// Wrapper for request handler functions to catch async exceptions
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  }

// Route to get all the buildings
app.get(
  "/api/buildings",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const buildingData = await getAllBuildings();
    const data = { buildings: buildingData };
    res.send(data);
    next();
  })
);

// Route to get status of all rooms
app.get(
  "/api/rooms",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const datetime = parseDatetime(req);
    const filters = parseFilters(req);
    const data = await getAllRoomStatus(datetime, filters);
    res.send(data);
    next();
  })
);

// Route to get the availability of a particular room in a particular building
app.get(
  "/api/rooms/:roomID",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { roomID } = req.params;
    const [campus, buildingGrid, roomNumber] = roomID.split('-');

    const data = await getRoomAvailability(`${campus}-${buildingGrid}`, roomNumber);
    res.send(data);
    next();
  })
);

// After each request, check if database.json needs to be updated
app.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const timeNow = new Date();
    const stat = fs.statSync(DATABASE_PATH);
    if (
      timeNow.getFullYear() - stat.mtime.getFullYear() > 0 ||
      timeNow.getMonth() - stat.mtime.getMonth() > 0
    ) {
      await scrapeBuildingData();
    }
    next();
  })
);

// Error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`"${req.originalUrl}" ${err.stack ?? err}`)

  if (!res.writableEnded) {
    res.status(400).send(err);
  }
  next();
});

app.listen(PORT, () => {
  console.log(`Freerooms backend now listening on port ${PORT}!`);
});
