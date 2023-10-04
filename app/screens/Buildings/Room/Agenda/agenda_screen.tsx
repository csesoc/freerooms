import React, {Component, useState, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Agenda, AgendaEntry, AgendaSchedule, DateData} from 'react-native-calendars';
import { getBookings } from '../../../../services/freerooms_api/endpoints';
interface State {
  items?: AgendaSchedule;
}

const ONEHOURLENGTH = 60;
const MILLIS = 3600000;

async function seeBookings(room) {
  const items: AgendaSchedule = {};
  let bookingResponse = {};
  console.log(room);
  try {
    bookingResponse = await getBookings(room)
    
  } catch (error) {
    console.error(error);
    return items;
  }
  
  // need to put an error if bad name
  // items might have no data if the room is has no timetable 
  // eg K-G26-G03 
  for (let key in bookingResponse["bookings"]) {


    const booking = bookingResponse["bookings"][key]
    const date_time = booking["end"].split('T');

    // calculate time between
    const start_time:Date = new Date(booking["start"]);
    const end_time:Date = new Date(booking["end"]);
    const date = date_time[0];
    const time_diff = (end_time - start_time) / MILLIS;

    if (!(date in items)) {
      items[date] = [
        {
          name: booking["name"],
          height: time_diff * ONEHOURLENGTH,
          day: date,
          time: `${start_time.getHours()}:${String(start_time.getMinutes()).padStart(2, '0')}` + " - " + `${end_time.getHours()}:${String(end_time.getMinutes()).padStart(2, '0')}`
        }
      ];
    } else {
      items[date].push({
        name: booking["name"],
        height: time_diff * ONEHOURLENGTH,
        day: date,
        time: `${start_time.getHours()}:${String(start_time.getMinutes()).padStart(2, '0')}` + " - " + `${end_time.getHours()}:${String(end_time.getMinutes()).padStart(2, '0')}`
      })
    }
  }
  console.log(items);
  return items;
}


export default function AgendaScreen (room) {
  const [items, setItems] = useState({});
  const date = new Date();


  const renderItem = (reservation) => {
    const fontSize = 14;
    const color = '#43515c';
  
    return (
      <TouchableOpacity style={[styles.item, {height: reservation.height}]} onPress={() => pressed(reservation.day)}>
        <Text style={{fontSize, color}}>{reservation.name}</Text>
        <Text style={{fontSize, color}}>{reservation.time}</Text>
  
      </TouchableOpacity>
    );
  }
  
  const pressed = (id: string) => {
    console.log("id has been pressed");
  }
  
  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  useEffect(() => {
    const loadItems = async () => {
      const bookings = await seeBookings(room.room);
      setItems(bookings)
      console.log(items);
    }
    loadItems();

  }, [])
  return (
    <Agenda
      items={items}
      loadItemsForMonth={(month) => console.log(month)}
      selected={date.toString()}
      renderItem={(item) => { return (renderItem(item)) }}
      renderEmptyDate={renderEmptyDate}
      showClosingKnob={true}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});