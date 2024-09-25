// Interface to the Hasura GraphQL API
import parseDates from "@common/parseDates";
import { Booking } from "@common/types";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { parse } from "graphql";
import { gql, GraphQLClient } from "graphql-request";

import { GRAPHQL_API } from "./config";

///////////////////////////////////////////////////////////////
// Helper functions for making and processing GQL requests

const client = new GraphQLClient(GRAPHQL_API);

/**
 * Make a request to the GraphQL API
 */
const doRequest = async <T>(
  queryStr: string,
  variables: Record<string, string> = {}
): Promise<T> => {
  // Make the request
  const query: TypedDocumentNode<T> = parse(gql`
    ${queryStr}
  `);
  const data = await client.request(query, variables);

  // Parse dates
  return parseDates(data);
};

///////////////////////////////////////////////////////////////

type BookingsInRangeRes = {
  rooms: Array<{
    id: string;
    name: string;
    bookings: Booking[];
  }>;
};

/**
 * Query all bookings in the range start to end, grouped by room
 */
export const queryBookingsInRange = async (
  start: Date,
  end: Date
): Promise<BookingsInRangeRes> => {
  const query = `
    query BookingsInRange($start: timestamptz, $end: timestamptz) {
      rooms {
        id
        name
        bookings(where: {start: {_lte: $end}, end: {_gte: $start}}, order_by: {start: asc}) {
          name
          bookingType
          start
          end
        }
      }
    }
  `;

  const variables = {
    start: start.toISOString(),
    end: end.toISOString(),
  };

  return await doRequest<BookingsInRangeRes>(query, variables);
};

///////////////////////////////////////////////////////////////

type BuildingsAndRoomsRes = {
  buildings: Array<{
    id: string;
    name: string;
    lat: number;
    long: number;
    aliases: string[];
    rooms: Array<{
      id: string;
      name: string;
      abbr: string;
      school: string;
      usage: string;
      capacity: number;
    }>;
  }>;
};

/**
 * Query information for all buildings and rooms
 */
export const queryBuildingsAndRooms =
  async (): Promise<BuildingsAndRoomsRes> => {
    const query = `
    query BuildingAndRooms {
      buildings(where: {name: {_neq: "Main Library"}}, order_by: {name: asc}) {
        id
        name
        lat
        long
        aliases
        rooms(where: {usage: {_neq: "LIB"}}, order_by: {id: asc}) {
          id
          name
          abbr
          school
          usage
          capacity
        }
      }
    }
  `;

    return await doRequest<BuildingsAndRoomsRes>(query);
  };

///////////////////////////////////////////////////////////////

type BookingsForRoomRes = {
  rooms_by_pk: {
    id: string;
    name: string;
    bookings: Booking[];
  };
};

/**
 * Query all bookings in the range start to end, grouped by room
 */
export const queryBookingsForRoom = async (
  roomId: string
): Promise<BookingsForRoomRes> => {
  const query = `
    query BookingsForRoom($roomId: String!) {
      rooms_by_pk(id: $roomId) {
        id
        name
        bookings(order_by: {start: asc}) {
          name
          bookingType
          start
          end
        }
      }
    }
  `;

  const variables = { roomId };

  return await doRequest<BookingsForRoomRes>(query, variables);
};
