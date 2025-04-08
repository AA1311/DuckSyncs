// copilot-events.js

/**
 * Initializes the automatic creation of events once extracted by the Copilot.
 * This listens for the "copilot-events" custom event (dispatched after PDF upload)
 * and then dispatches an "event-create" event for each extracted event.
 */
export function initCopilotEventsAutoCreate() {
    document.addEventListener("copilot-events", (e) => {
      const extractedEvents = e.detail; // extractedEvents is the array returned from the backend
      console.log("Received copilot events for auto-creation:", extractedEvents);
      
      if (extractedEvents && extractedEvents.length > 0) {
        extractedEvents.forEach((eventItem) => {
          // Dispatch an event-create event for each extracted event.
          document.dispatchEvent(new CustomEvent("event-create", { detail: { event: eventItem } }));
          console.log("Dispatched event-create for:", eventItem);
        });
      } else {
        console.log("No events to auto-create.");
      }
    });
  }
  