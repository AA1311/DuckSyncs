// import { isTheSameDay } from "./date.js";
// export function initEventStore(userId) {
//   const db = firebase.firestore();
//   const userEventsRef = db.collection("users").doc(userId).collection("events");
//   let cachedEvents = [];

//   console.log("Initializing event store for UID:", userId);

//   document.addEventListener("events-loaded", (e) => {
//     const newEvents = e.detail.events.map(event => ({
//       ...event,
//       date: new Date(event.date),
//     }));
//     cachedEvents = newEvents; // Replace entire cache with Firestore data
//     console.log("Cached events updated from Firestore:", cachedEvents);
//   });

//   // document.addEventListener("event-create", (event) => {
//   //   const createdEvent = event.detail.event;
//   //   const eventDate = new Date(createdEvent.date);
//   //   eventDate.setHours(0, 0, 0, 0); // Normalize to midnight local time
//   //   const safeEvent = {
//   //     ...createdEvent,
//   //     date: eventDate.toISOString(),
//   //   };

//   //   console.log(
//   //     "Event creation triggered for UID:", userId,
//   //     "Input date:", createdEvent.date.toString(),
//   //     "Normalized date:", eventDate.toString(),
//   //     "Saved ISO date:", safeEvent.date
//   //   );
//   //   console.log("Event creation triggered for UID:", userId, "Data:", safeEvent);

//   //   userEventsRef
//   //     .add(safeEvent)
//   //     .then((docRef) => {
//   //       console.log("Event saved to Firestore with ID:", docRef.id, "Data:", safeEvent);
//   //       // Rely on events-loaded to update cache and refresh UI
//   //     })
//   //     .catch((error) => {
//   //       console.error("Error saving event:", error);
//   //     });
//   // });

//   document.addEventListener("event-create", (event) => {
//     const createdEvent = event.detail.event;
//     const eventDate = new Date(createdEvent.date);
//     const safeEvent = {
//         ...createdEvent,
//         date: eventDate.toISOString().split('T')[0], // Store as "2025-04-09"
//     };

//     console.log("Event creation triggered for UID:", userId, "Data:", safeEvent);

//     userEventsRef
//         .add(safeEvent)
//         .then((docRef) => {
//             console.log("Event saved to Firestore with ID:", docRef.id, "Data:", safeEvent);
//             // Update the event with the Firestore ID and dispatch an update
//             const eventWithId = { ...safeEvent, id: docRef.id, date: new Date(safeEvent.date) };
//             cachedEvents.push(eventWithId);
//             document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
//         })
//         .catch((error) => {
//             console.error("Error saving event:", error);
//         });
// });

//   document.addEventListener("event-delete", (event) => {
//     const deletedEvent = event.detail.event;
//     if (!deletedEvent || !deletedEvent.id) {
//         console.error("Cannot delete event: invalid event or missing ID", deletedEvent);
//         return;
//     }
//     console.log("Deleting event:", deletedEvent.id);
//     userEventsRef.doc(deletedEvent.id.toString()).delete().then(() => {
//         console.log("Event deleted:", deletedEvent.id);
//         cachedEvents = cachedEvents.filter(e => e.id !== deletedEvent.id);
//         document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
//     }).catch((error) => console.error("Error deleting event:", error));
// });

//   // document.addEventListener("event-edit", (event) => {
//   //   const editedEvent = event.detail.event;
//   //   const eventDate = new Date(editedEvent.date);
//   //   eventDate.setHours(0, 0, 0, 0); // Normalize to midnight local time
//   //   const safeEvent = {
//   //     ...editedEvent,
//   //     date: eventDate.toISOString(),
//   //   };
//   //   console.log("Editing event:", safeEvent);
//   //   userEventsRef.doc(safeEvent.id).set(safeEvent).then(() => {
//   //     console.log("Event edited:", safeEvent);
//   //     cachedEvents = cachedEvents.map(e => (e.id === safeEvent.id ? { ...safeEvent, date: new Date(safeEvent.date) } : e));
//   //     document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
//   //   }).catch((error) => console.error("Error editing event:", error));
//   // });

//   document.addEventListener("event-edit", (event) => {
//     const editedEvent = event.detail.event;
//     const eventDate = new Date(editedEvent.date);
//     const safeEvent = {
//         ...editedEvent,
//         date: eventDate.toISOString().split('T')[0], // Store as "2025-04-09"
//     };
//     if (!safeEvent.id) {
//         console.error("Cannot edit event: missing ID", safeEvent);
//         return;
//     }
//     console.log("Editing event:", safeEvent);
//     userEventsRef.doc(safeEvent.id).set(safeEvent).then(() => {
//         console.log("Event edited:", safeEvent);
//         cachedEvents = cachedEvents.map(e =>
//             e.id === safeEvent.id ? { ...safeEvent, date: new Date(safeEvent.date) } : e
//         );
//         document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
//     }).catch((error) => console.error("Error editing event:", error));
// });

//   return {
//     getEventsByDate(date) {
//       return new Promise((resolve) => {
//         const queryDate = new Date(date);
//         queryDate.setHours(0, 0, 0, 0); // Ensure query date is midnight local
//         console.log("Fetching events for date:", queryDate.toString(), "ISO:", queryDate.toISOString());
//         const filteredEvents = cachedEvents.filter((event) =>
//           isTheSameDay(event.date, queryDate)
//         );
//         console.log("Filtered events from cache:", filteredEvents);
//         resolve(filteredEvents);
//       });
//     },
//   };
// }

import { isTheSameDay } from "./date.js";

export function initEventStore(userId) {
  const db = firebase.firestore();
  const userEventsRef = db.collection("users").doc(userId).collection("events");

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
    const safeEvent = {
      ...createdEvent,
      date: eventDate.toISOString().split('T')[0], // Store as "2025-04-07"
    };

    console.log("Event creation triggered for UID:", userId, "Data:", safeEvent);

    userEventsRef
      .add(safeEvent)
      .then((docRef) => {
        console.log("Event saved to Firestore with ID:", docRef.id, "Data:", safeEvent);
        const eventWithId = { ...safeEvent, id: docRef.id, date: new Date(safeEvent.date) };
        cachedEvents.push(eventWithId); // Update cache
        document.dispatchEvent(new CustomEvent("events-change", {
          detail: { events: cachedEvents, newEvent: eventWithId }, // Pass full cache and new event
          bubbles: true
        }));
      })
      .catch((error) => {
        console.error("Failed to save event to Firestore for UID", userId, ":", error);
      });
  });

  document.addEventListener("event-delete", (event) => {
    const deletedEvent = event.detail.event;
    if (!deletedEvent || !deletedEvent.id) {
      console.error("Cannot delete event: invalid event or missing ID", deletedEvent);
      return;
    }
    console.log("Deleting event:", deletedEvent.id);
    userEventsRef.doc(deletedEvent.id).delete().then(() => {
      console.log("Event deleted:", deletedEvent.id);
      cachedEvents = cachedEvents.filter(e => e.id !== deletedEvent.id);
      document.dispatchEvent(new CustomEvent("events-change", {
        detail: { events: cachedEvents },
        bubbles: true
      }));
    }).catch((error) => console.error("Error deleting event:", error));
  });

  document.addEventListener("event-edit", (event) => {
    const editedEvent = event.detail.event;
    const eventDate = new Date(editedEvent.date);
    const safeEvent = {
      ...editedEvent,
      date: eventDate.toISOString().split('T')[0], // Store as "2025-04-07"
    };
    if (!safeEvent.id) {
      console.error("Cannot edit event: missing ID", safeEvent);
      return;
    }
    console.log("Editing event:", safeEvent);
    userEventsRef.doc(safeEvent.id).set(safeEvent).then(() => {
      console.log("Event edited:", safeEvent);
      cachedEvents = cachedEvents.map(e =>
        e.id === safeEvent.id ? { ...safeEvent, date: new Date(safeEvent.date) } : e
      );
      document.dispatchEvent(new CustomEvent("events-change", {
        detail: { events: cachedEvents },
        bubbles: true
      }));
    }).catch((error) => console.error("Error editing event:", error));
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
    getEventById(id) { // New method to fetch event by ID
      return cachedEvents.find(event => event.id === id);
    }
  };
}