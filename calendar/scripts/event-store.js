import { isTheSameDay } from "./date.js";

export function initEventStore(userId) {
  const db = firebase.firestore();
  const userEventsRef = db.collection("users").doc(userId).collection("events");
  let cachedEvents = [];

  console.log("Initializing event store for UID:", userId);

  document.addEventListener("events-loaded", (e) => {
    const newEvents = e.detail.events.map(event => ({
      ...event,
      date: new Date(event.date),
    }));
    cachedEvents = newEvents;
    console.log("Cached events updated from Firestore:", cachedEvents);
  });

  document.addEventListener("event-create", (event) => {
    const createdEvent = event.detail.event;
    const eventDate = new Date(createdEvent.date);
    eventDate.setHours(0, 0, 0, 0);
    const safeEvent = {
      title: createdEvent.title,
      Course: createdEvent.Course, // Add Course
      date: eventDate.toISOString().split('T')[0],
      startTime: createdEvent.startTime,
      endTime: createdEvent.endTime,
      color: createdEvent.color
    };
  
    console.log("Event creation triggered with Data:", safeEvent);
  
    userEventsRef
      .add(safeEvent)
      .then((docRef) => {
        console.log("Event saved to Firestore with ID:", docRef.id, "Data:", safeEvent);
        cachedEvents.push({ id: docRef.id, ...safeEvent, date: eventDate });
        document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
      })
      .catch((error) => {
        console.error("Error saving event:", error);
      });
  });

  document.addEventListener("event-delete", (event) => {
    const deletedEvent = event.detail.event;
    console.log("Deleting event:", deletedEvent.id);
    if (deletedEvent.id) {
      userEventsRef.doc(deletedEvent.id).delete().then(() => {
        console.log("Event deleted:", deletedEvent.id);
        cachedEvents = cachedEvents.filter(e => e.id !== deletedEvent.id);
        document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
      }).catch((error) => console.error("Error deleting event:", error));
    } else {
      console.error("Cannot delete event without id");
    }
  });

  document.addEventListener("event-edit", (event) => {
    const editedEvent = event.detail.event;
    const eventDate = new Date(editedEvent.date);
    eventDate.setHours(0, 0, 0, 0);
    const safeEvent = {
      title: editedEvent.title,
      Course: editedEvent.Course, // Add Course
      date: eventDate.toISOString(),
      startTime: editedEvent.startTime,
      endTime: editedEvent.endTime,
      color: editedEvent.color
    };
    console.log("Editing event:", editedEvent);
    if (editedEvent.id) {
      userEventsRef.doc(editedEvent.id).set(safeEvent)
        .then(() => {
          console.log("Event edited successfully");
          cachedEvents = cachedEvents.map(e => e.id === editedEvent.id ? { ...safeEvent, id: editedEvent.id, date: eventDate } : e);
          document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
        })
        .catch((error) => console.error("Error editing event:", error));
    } else {
      console.error("Cannot edit event without id");
    }
  });

  return {
    getEventsByDate(date) {
      return new Promise((resolve) => {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0);
        console.log("Fetching events for date:", queryDate.toString(), "ISO:", queryDate.toISOString());
        const filteredEvents = cachedEvents.filter((event) =>
          isTheSameDay(event.date, queryDate)
        );
        console.log("Filtered events from cache:", filteredEvents);
        resolve(filteredEvents);
      });
    },
  };
}