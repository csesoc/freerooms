"use client" 

import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import type { StaticImageData } from "next/image";
import Image from "next/image";
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import Button from "../../../components/Button";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useRoom from "../../../hooks/useRoom";
import roomImage from "../../../public/assets/building_photos/K-B16.webp";
import type { Room } from "../../../../common/types";
import useBuilding from 'hooks/useBuilding';

type Event = {
	title: string;
	start: Date,
	end: Date,
}

type RoomDetails = {
	name : string;
	bookings: Array<Event>
}

export default function Page({ params }: {
  params: {room: string};
}) {
	const { bookings } = useBookings(params.room);
	const { room } = useRoom(params.room);
    const [ campus, grid ] = room ? room.id.split('-') : [ "", "" ];
    const { building } = useBuilding(`${campus}-${grid}`);

      return (
    <Container maxWidth={'xl'}>
        { room != undefined ? 
            ( <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%" px={{ xs: 3, md: 15 }}>
                <RoomPageHeader room={room} buildingName={ building != undefined ? building.name : "" } />
			    <RoomImage src={`/assets/building_photos/${campus}-${grid}.webp`} /> 
			    <BookingCalendar events={ bookings == undefined ? [] : bookings } />
            </Stack>
            ) : <LoadingCircle />  }
    </Container>
    
  );
}

const RoomPageHeader : React.FC<{ room : Room, buildingName : string }> = ({
    room,
    buildingName
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const translateUsage = ( usage : string  ) => {
        switch(usage) {
            case "AUD" :
                return "Auditorium";
            case "CMLB":
                return "Computer Lab";
            case "LAB" : 
                return "Lab";
            case "LCTR":
                return "Lecture Hall";
            case "MEET":
                return "Meeting Room";
            case "SDIO":
               return "Studio";
            case "TUSM":
                return "Tutorial Room";
            case "LIB":
                return "Library";
            default:
                return "";
        }
    }

    	return (
		<Box
			width={"100%"}
			display={"flex"}
			flexDirection={"row"}
			alignItems={'center'}
			justifyContent={"space-between"}
		>
			<Stack direction={"column"} spacing={1} width="100%">
                { buildingName != "" ? (
                    <Stack direction='row' spacing={2} >
                        <Typography display="inline" variant="subtitle2">{`${buildingName}`} </Typography>
                        <Typography display="inline" variant="subtitle2">{"/"}</Typography>
                        <Typography display="inline" variant="subtitle2">{`${translateUsage(room.usage)}`}</Typography>
                        { room.school != " " ? <Typography display="inline" variant="subtitle2">{"/"}</Typography> : null }
                        { room.school != " " ? <Typography display="inline" fontWeight={"bold"} color={"#e65100"} variant="subtitle2">{"ID Required"}</Typography> : null }
                    </Stack>
                ) : null }
				<Box display="flex" justifyContent={"space-between"} alignItems={'center'} width={'100%'} >
					<Typography variant='h4' fontWeight={550}> {room.name} </Typography>
					{ isMobile ?  <ActionMenu />  : <BookingButton school={room.school} usage={room.usage} onClick={() => {}} /> }
					
				</Box>
				<Stack direction={"row"} spacing={3}  >
					<Typography variant="body1" fontWeight={"bold"}>
						ID: <Typography display={"inline"} variant="body1">{room.id}</Typography>
					</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
						Capacity: <Typography display={"inline"} variant="body1">{room.capacity}</Typography>
					</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
						Abbreviation: <Typography display={"inline"} variant="body1">{room.abbr}</Typography>
					</Typography>

					{ room.school != " " ? (
                     <Typography variant="body1" fontWeight={"bold"}>
						School: <Typography display={"inline"} variant="body1">{room.school}</Typography>
					</Typography>
                    ) : null }
				</Stack>
			</Stack>
		</Box>
	);
}

const BookingButton : React.FC<{ school: string, usage: string, onClick : () => void }> = ({ school, usage, onClick }) => {

    let link = "";
    if( school === " " && usage === "LIB" ) link = "https://unswlibrary-bookings.libcal.com";
    else if( school === " " ) link = "https://www.learningenvironments.unsw.edu.au/make-booking/book-room";

    if( link != "" ) return (
        <Button href={link} sx={{ px: 2, py: 1}}>
	        <Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
		</Button>
    );

    return (
        <Button onClick={onClick} sx={{ px: 2, py: 1}}>
	        <Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
		</Button>
    );
}

const ActionMenu : React.FC = () => {

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
 	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};


	return (
		<Box>
			<IconButton
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
      		>
				<MenuIcon />
      		</IconButton>
      		<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
				'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem onClick={handleClose}>Make a Booking</MenuItem>
				<MenuItem onClick={handleClose}>Map</MenuItem>
				<MenuItem onClick={handleClose}>Add Photos</MenuItem>
      		</Menu>
		</Box>
	);
}

const RoomImage : React.FC<{ src : string }> = ({ src }) => {
	return (
	    <Box minWidth={"100%"} minHeight={300} position="relative" >
	        <Image src={src} alt={"Room Image"} fill style={{ objectFit: "cover", borderRadius: 10 }}/>	
		</Box>
	);
}

const extractBookings = ( bookings : RoomAvailability ) => {
	
	let allBookings : Array<Event> = [];
	for( let week = 1; week <= 10; ++week) {
		if(!( week in bookings ) ) {
			continue;
		}
		const bookingsForCurrWeek = bookings[week];
		Object.keys(bookingsForCurrWeek).forEach(( day ) => {
			const bookingForCurrDay = bookingsForCurrWeek[day];
			bookingForCurrDay.forEach((booking) => {
				allBookings.push({
					title: booking.courseCode,
					start: new Date(booking.start),
					end: new Date(booking.end),
				})
			});
		})
	}
	
	const roomDetails : RoomDetails = { name : bookings.name, bookings: allBookings };
	
	return roomDetails;
}
