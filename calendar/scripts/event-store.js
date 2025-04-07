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
    cachedEvents = newEvents; // Replace entire cache with Firestore data
    console.log("Cached events updated from Firestore:", cachedEvents);
  });

  document.addEventListener("event-create", (event) => {
    const createdEvent = event.detail.event;
    const eventDate = new Date(createdEvent.date);
    eventDate.setHours(0, 0, 0, 0); // Normalize to midnight local time
    const safeEvent = {
      ...createdEvent,
      date: eventDate.toISOString(),
    };

    console.log(
      "Event creation triggered for UID:", userId,
      "Input date:", createdEvent.date.toString(),
      "Normalized date:", eventDate.toString(),
      "Saved ISO date:", safeEvent.date
    );
    console.log("Event creation triggered for UID:", userId, "Data:", safeEvent);

    userEventsRef
      .add(safeEvent)
      .then((docRef) => {
        console.log("Event saved to Firestore with ID:", docRef.id, "Data:", safeEvent);
        // Rely on events-loaded to update cache and refresh UI
      })
      .catch((error) => {
        console.error("Error saving event:", error);
      });
  });

  document.addEventListener("event-delete", (event) => {
    const deletedEvent = event.detail.event;
    console.log("Deleting event:", deletedEvent.id);
    userEventsRef.doc(deletedEvent.id.toString()).delete().then(() => {
      console.log("Event deleted:", deletedEvent.id);
      cachedEvents = cachedEvents.filter(e => e.id !== deletedEvent.id);
      document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
    }).catch((error) => console.error("Error deleting event:", error));
  });

  document.addEventListener("event-edit", (event) => {
    const editedEvent = event.detail.event;
    const eventDate = new Date(editedEvent.date);
    eventDate.setHours(0, 0, 0, 0); // Normalize to midnight local time
    const safeEvent = {
      ...editedEvent,
      date: eventDate.toISOString(),
    };
    console.log("Editing event:", safeEvent);
    userEventsRef.doc(safeEvent.id).set(safeEvent).then(() => {
      console.log("Event edited:", safeEvent);
      cachedEvents = cachedEvents.map(e => (e.id === safeEvent.id ? { ...safeEvent, date: new Date(safeEvent.date) } : e));
      document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
    }).catch((error) => console.error("Error editing event:", error));
  });

  return {
    getEventsByDate(date) {
      return new Promise((resolve) => {
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0); // Ensure query date is midnight local
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