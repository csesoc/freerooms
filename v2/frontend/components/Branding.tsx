import Image from "next/image";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { orange } from "@mui/material/colors";

const StyledText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontFamily: "Josefin Sans"
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
  opacity: 1,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    opacity: 0.7,
  },
}));

const Branding = (props: BoxProps) => (
  <StyledBox {...props}>
    <div style={{ width: 50, marginLeft: 10, marginRight: 5 }}>
      <Image src={Logo} alt="Freerooms Logo" priority />
    </div>
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledText sx={{ lineHeight: 1 }}>Freerooms</StyledText>
      <StyledText sx={{ lineHeight: 1, marginTop: 0.5, fontFamily: "Arial", fontSize: "0.8rem"}}>22T2</StyledText>
    </Box>
  </StyledBox>
);

export default Branding;
