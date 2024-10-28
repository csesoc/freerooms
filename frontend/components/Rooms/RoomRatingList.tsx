import Box from "@mui/material/Box";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

import CircularRating from "./CircularRating";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const { ratings } = useRoomRatings(roomID);

  let cleanlinesRating = 0;
  let quietnessRating = 0;
  let locationRating = 0;
  let overallRating = 0;

  if (ratings && ratings.length > 0) {
    ratings.forEach((rating) => {
      cleanlinesRating += rating.cleanliness;
      quietnessRating += rating.cleanliness;
      locationRating += rating.location;
      overallRating += rating.overall;
    });

    cleanlinesRating =
      Math.round((cleanlinesRating / ratings.length) * 10) / 10;
    quietnessRating = Math.round((quietnessRating / ratings.length) * 10) / 10;
    locationRating = Math.round((locationRating / ratings.length) * 10) / 10;
    overallRating = Math.round((overallRating / ratings.length) * 10) / 10;
  }

  return (
    <Box display="flex" justifyContent="flex-start" mt={2} gap={9}>
      <CircularRating category="Cleanliness" rating={cleanlinesRating} />
      <CircularRating category="Quietness" rating={quietnessRating} />
      <CircularRating category="Location" rating={locationRating} />
      <CircularRating category="Overall" rating={overallRating} />
    </Box>
  );
};

export default RoomRatingList;
