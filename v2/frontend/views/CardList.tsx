
import React from "react";
import { Building, BuildingReturnData, RoomsReturnData } from "../types";

import { styled } from "@mui/material/styles";
import FlipMove from "react-flip-move";

import BuildingCard from "../components/BuildingCard";

const INITIALISING = -2;
const FAILED = -1;

const FlipMoveGrid = styled(FlipMove)(({ theme }) => ({
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
  data: BuildingReturnData;
  setBuilding: (building: Building) => void;
  sortOrder: string;
  searchQuery: string;
  hideUnavailable: boolean;
  statusData: RoomsReturnData | undefined;
}> = ({ data, setBuilding, sortOrder, searchQuery, hideUnavailable, statusData }) => {
  const [buildings, setBuildings] = React.useState<Building[]>([...data.buildings]);

  React.useEffect(() => {
    if (statusData === undefined) return;

    // Filter any out that dont start with query
    // If hideUnavailable is true, filter any that have no available rooms
    const displayedBuildings = [...data.buildings].filter((building) =>
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (!hideUnavailable || countFreerooms(statusData, building.id) > 0)
    );

    // Sort the displayed buildings
    displayedBuildings.sort((a, b) => {
      switch (sortOrder) {
        case "lowerToUpper":
          return a.long - b.long;
        case "upperToLower":
          return b.long - a.long;
        case "nearest":
          // idk lol
        case "mostRooms":
          return countFreerooms(statusData, b.id) - countFreerooms(statusData, a.id);
        case "reverseAlphabetical":
          return b.name.localeCompare(a.name);
        default:
          // default is alphabetical
          return a.name.localeCompare(b.name);
      }
    });

    setBuildings(displayedBuildings);
  }, [searchQuery, hideUnavailable, sortOrder, statusData]);

  return (
    <FlipMoveGrid
      duration={500}
      onStartAll={() => window.scrollTo(0, 0)}
    >
      {buildings.map((building) => (
        <FlippableCard
          key={building.id}
          building={building}
          setBuilding={setBuilding}
          freerooms={countFreerooms(statusData, building.id)}
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
