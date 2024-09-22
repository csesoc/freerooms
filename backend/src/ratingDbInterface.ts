import { MongoClient } from "mongodb";

import dotenv from "dotenv";
import { RatingResponse } from "@common/types";
dotenv.config({ path: "src/.env.local" });

const uri: string | undefined = process.env.MONGODB_URI;

export async function insertRating(
  roomId: string,
  ratings: number[]
): Promise<void> {
  if (!uri) {
    throw new Error("uri not found");
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection = database.collection("ratings");
    console.log("ratings", collection);

    const document = {
      roomId: roomId,
      ratings: ratings,
    };

    await collection.insertOne(document);
  } catch (error) {
    console.error("Error inserting document:", error);
  } finally {
    await client.close();
  }
}

export async function getRatings(roomId: string): Promise<RatingResponse[]> {
  if (!uri) {
    throw new Error("uri not found");
  }

  const client = new MongoClient(uri);
  // Return object
  let roomRatings: RatingResponse[] = [];

  try {
    await client.connect();
    const database = client.db("room-ratings");
    const collection = database.collection("ratings");

    const query = { roomId: roomId };
    // Include only 'roomId' and 'ratings' fields in each document
    const options = {
      sort: {},
      projection: { _id: 0, roomId: 1, ratings: 1 },
    };

    const room = collection.find(query, options);
    // Sanity check
    if ((await collection.countDocuments(query)) === 0) {
      console.log("No documents found!");
    }

    for await (const doc of room) {
      // Convert to return type
      const roomRating = doc as unknown as RatingResponse;
      roomRatings.push(roomRating);
    }
  } catch (error) {
    console.error("Error finding item:", error);
  } finally {
    await client.close();
  }

  return roomRatings;
}
