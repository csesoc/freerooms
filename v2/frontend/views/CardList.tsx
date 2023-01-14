import { styled } from "@mui/material/styles";
import React from "react";
import FlipMove from "react-flip-move";

import BuildingCard from "../components/BuildingCard";
import { Building, BuildingReturnData, RoomsReturnData } from "../types";

const INITIALISING = -2;
const FAILED = -1;

const FlipMoveGrid = styled(FlipMove)(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
}));

const FlippableCard = React.forwardRef<HTMLDivElement, {
  building: Building;
  setBuilding: (bldg: Building) => void;
  freerooms: number;
}>(({ building, setBuilding, freerooms }, ref) => (
  <div ref={ref}>
    <BuildingCard
      building={building}
      setBuilding={setBuilding}
      freerooms={freerooms}
    />
  </div>
));

const CardList: React.FC<{
  buildingData: BuildingReturnData;
  setCurrentBuilding: (building: Building) => void;
  sort: string;
  query: string;
  roomStatusData: RoomsReturnData | undefined;
}> = ({ buildingData, setCurrentBuilding, sort, query, roomStatusData }) => {
  const [buildings, setBuildings] = React.useState<Building[]>([...buildingData.buildings]);

  React.useEffect(() => {
    if (
      roomStatusData === undefined ||
      Object.keys(roomStatusData).length == 0
    ) return;

    // Filter any out that dont start with query
    // If hideUnavailable is true, filter any that have no available rooms
    const displayedBuildings = [...buildingData.buildings].filter((building) =>
      building.name.toLowerCase().includes(query.toLowerCase()) &&
      Object.keys(roomStatusData[building.id]).length > 0
    );

    // Sort the displayed buildings
    displayedBuildings.sort((a, b) => {
      switch (sort) {
        case "lowerToUpper":
          return a.long - b.long;
        case "upperToLower":
          return b.long - a.long;
        case "nearest":
        // idk lol
        case "mostRooms":
          return countFreerooms(roomStatusData, b.id) - countFreerooms(roomStatusData, a.id);
        case "reverseAlphabetical":
          return b.name.localeCompare(a.name);
        default:
          // default is alphabetical
          return a.name.localeCompare(b.name);
      }
    });

    setBuildings(displayedBuildings);
  }, [query, sort, roomStatusData]);

  return (
    <FlipMoveGrid
      duration={500}
    >
      {buildings.map((building) => (
        <FlippableCard
          key={building.id}
          building={building}
          setBuilding={setCurrentBuilding}
          freerooms={countFreerooms(roomStatusData, building.id)}
        />
      ))}
    </FlipMoveGrid>
  );
}

const countFreerooms = (
  roomStatus: RoomsReturnData | undefined,
  buildingId: string
): number => {
  if (roomStatus === undefined) return INITIALISING;
  if (!(buildingId in roomStatus)) return FAILED;

  let freerooms = 0;
  for (const room of Object.values(roomStatus[buildingId])) {
    if (room.status === "free") freerooms++;
  }
  return freerooms;
}

export default CardList;
