// import { isTheSameDay } from "./date.js";

// export function initEventStore() {
//   document.addEventListener("event-create", (event) => {
//     const createdEvent = event.detail.event;
//     const events = getEventsFromLocalStorage();
//     events.push(createdEvent)
//     saveEventsIntoLocalStorage(events);

//     document.dispatchEvent(new CustomEvent("events-change", {
//       bubbles: true
//     }));
//   });

//   document.addEventListener("event-delete", (event) => {
//     const deletedEvent = event.detail.event;
//     const events = getEventsFromLocalStorage().filter((event) => {
//       return event.id !== deletedEvent.id;
//     })
//     saveEventsIntoLocalStorage(events);

//     document.dispatchEvent(new CustomEvent("events-change", {
//       bubbles: true
//     }));
//   });

//   document.addEventListener("event-edit", (event) => {
//     const editedEvent = event.detail.event;
//     const events = getEventsFromLocalStorage().map((event) => {
//       return event.id === editedEvent.id ? editedEvent : event;
//     });
//     saveEventsIntoLocalStorage(events);

//     document.dispatchEvent(new CustomEvent("events-change", {
//       bubbles: true
//     }));
//   });

//   return {
//     getEventsByDate(date) {
//       const events = getEventsFromLocalStorage();
//       const filteredEvents = events.filter((event) => isTheSameDay(event.date, date));

//       return filteredEvents;
//     }
//   };
// }

// function saveEventsIntoLocalStorage(events) {
//   const safeToStringifyEvents = events.map((event) => ({
//     ...event,
//     date: event.date.toISOString()
//   }));

//   let stringifiedEvents;
//   try {
//     stringifiedEvents = JSON.stringify(safeToStringifyEvents);
//     console.table(stringifiedEvents);
//   } catch (error) {
//     console.error("Stringify events failed", error);
//   }

//   localStorage.setItem("events", stringifiedEvents);
// }

// function getEventsFromLocalStorage() {
//   const localStorageEvents = localStorage.getItem("events");
//   if (localStorageEvents === null) {
//     return [];
//   }

//   let parsedEvents;
//   try {
//     parsedEvents = JSON.parse(localStorageEvents);
//   } catch (error) {
//     console.error("Parse events failed", error);
//     return [];
//   }

//   const events = parsedEvents.map((event) => ({
//     ...event,
//     date: new Date(event.date)
//   }));

//   return events;
// }

// event-store.js
import { isTheSameDay } from "./date.js";

export function initEventStore(userId) {
  const db = firebase.firestore();
  const userEventsRef = db.collection("users").doc(userId).collection("events");

  console.log("Event store initialized for UID:", userId);

  document.addEventListener("event-create", (event) => {
    const createdEvent = event.detail.event;
    const safeEvent = {
      ...createdEvent,
      date: createdEvent.date.toISOString(),
      id: createdEvent.id.toString(),
    };

    console.log("Event creation triggered for UID:", userId);
    console.log("Event data to save:", safeEvent);

    userEventsRef
      .doc(safeEvent.id)
      .set(safeEvent)
      .then(() => {
        console.log("Event successfully saved to Firestore for UID", userId, ":", safeEvent);
        document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
      })
      .catch((error) => {
        console.error("Failed to save event to Firestore for UID", userId, ":", error);
      });
  });

  document.addEventListener("event-delete", (event) => {
    const deletedEvent = event.detail.event;

    console.log("Deleting event for UID", userId, ":", deletedEvent.id);

    userEventsRef
      .doc(deletedEvent.id.toString())
      .delete()
      .then(() => {
        console.log("Event deleted from Firestore:", deletedEvent.id);
        document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  });

  document.addEventListener("event-edit", (event) => {
    const editedEvent = event.detail.event;
    const safeEvent = {
      ...editedEvent,
      date: editedEvent.date.toISOString(),
      id: editedEvent.id.toString(),
    };

    console.log("Editing event for UID", userId, ":", safeEvent);

    userEventsRef
      .doc(safeEvent.id)
      .set(safeEvent)
      .then(() => {
        console.log("Event edited in Firestore:", safeEvent);
        document.dispatchEvent(new CustomEvent("events-change", { bubbles: true }));
      })
      .catch((error) => {
        console.error("Error editing event:", error);
      });
  });

  return {
    getEventsByDate(date) {
      return new Promise((resolve, reject) => {
        userEventsRef
          .get()
          .then((snapshot) => {
            const events = [];
            snapshot.forEach((doc) => {
              const eventData = doc.data();
              events.push({
                ...eventData,
                id: doc.id,
                date: new Date(eventData.date),
              });
            });
            const filteredEvents = events.filter((event) =>
              isTheSameDay(event.date, date)
            );
            console.log("Events fetched for UID", userId, "on date", date.toISOString(), ":", filteredEvents);
            resolve(filteredEvents);
          })
          .catch((error) => {
            console.error("Error fetching events for UID", userId, ":", error);
            reject(error);
          });
      });
    },
  };
}