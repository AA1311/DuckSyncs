import { initCalendar } from "./calendar.js";
import { initEventCreateButtons } from "./event-create-button.js";
import { initEventDeleteDialog } from "./event-delete-dialog.js";
import { initEventDetailsDialog } from "./event-details-dialog.js";
import { initEventFormDialog } from "./event-form-dialog.js";
import { initEventStore } from "./event-store.js";
import { initHamburger } from "./hamburger.js";
import { initMobileSidebar } from "./mobile-sidebar.js";
import { initNav } from "./nav.js";
import { initNotifications } from "./notifications.js";
import { initViewSelect } from "./view-select.js";
import { initResponsive } from "./responsive.js";
import { initUrl } from "./url.js";
import { initSync } from "./sync.js";
import { initCopilotEventsAutoCreate } from "./copilot-events.js";  // Import our new module

console.log("index.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("Initializing app for UID:", user.uid);
      const eventStore = initEventStore(user.uid);

      // Listen for events loaded from Firestore before initializing the calendar
      document.addEventListener(
        "events-loaded",
        async () => {
          console.log("Events loaded, initializing calendar...");
          await initCalendar(eventStore);
          initEventCreateButtons();
          initEventDeleteDialog();
          initEventDetailsDialog();
          initEventFormDialog();
          initHamburger();
          initMobileSidebar();
          initNav();
          initNotifications();
          initViewSelect();
          initUrl();
          initResponsive();
          initSync();
          localStorage.removeItem("events");
          console.log("App initialized");
        },
        { once: true }
      );

      // Initialize the copilot-events handler to auto-create events
      initCopilotEventsAutoCreate();

    } else {
      console.log("No user, redirecting...");
      window.location.href = "../index.html";
    }
  });
});
