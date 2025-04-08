// import { initCalendar } from "./calendar.js";
// import { initEventCreateButtons } from "./event-create-button.js";
// import { initEventDeleteDialog } from "./event-delete-dialog.js";
// import { initEventDetailsDialog } from "./event-details-dialog.js";
// import { initEventFormDialog } from "./event-form-dialog.js";
// import { initEventStore } from "./event-store.js";
// import { initHamburger } from "./hamburger.js";
// import { initMiniCalendars } from "./mini-calendar.js";
// import { initMobileSidebar } from "./mobile-sidebar.js";
// import { initNav } from "./nav.js";
// import { initNotifications } from "./notifications.js";
// import { initViewSelect } from "./view-select.js";
// import { initResponsive } from "./responsive.js";
// import { initUrl } from "./url.js";
// import { initSync } from "./sync.js";

// const eventStore = initEventStore();
// initCalendar(eventStore);
// initEventCreateButtons();
// initEventDeleteDialog();
// initEventDetailsDialog();
// initEventFormDialog();
// initHamburger();
// initMiniCalendars();
// initMobileSidebar();
// initNav();
// initNotifications();
// initViewSelect();
// initUrl();
// initResponsive();
// initSync();

// index.js
import { initCalendar } from "./calendar.js";
import { initEventCreateButtons } from "./event-create-button.js";
import { initEventDeleteDialog } from "./event-delete-dialog.js";
import { initEventDetailsDialog } from "./event-details-dialog.js";
import { initEventFormDialog } from "./event-form-dialog.js";
import { initEventStore } from "./event-store.js";
import { initHamburger } from "./hamburger.js";
import { initMiniCalendars } from "./mini-calendar.js";
import { initMobileSidebar } from "./mobile-sidebar.js";
import { initNav } from "./nav.js";
import { initNotifications } from "./notifications.js";
import { initViewSelect } from "./view-select.js";
import { initResponsive } from "./responsive.js";
import { initUrl } from "./url.js";
import { initSync } from "./sync.js";

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("Starting app initialization for UID:", user.uid);
    const eventStore = initEventStore(user.uid);
    initCalendar(eventStore);
    initEventCreateButtons();
    initEventDeleteDialog();
    initEventDetailsDialog();
    initEventFormDialog();
    initHamburger();
    initMiniCalendars();
    initMobileSidebar();
    initNav();
    initNotifications();
    initViewSelect();
    initUrl();
    initResponsive();
    initSync();

    localStorage.removeItem("events"); // Clear old localStorage data
    console.log("App initialized for UID:", user.uid);
  } else {
    console.log("No user, redirecting to login...");
    window.location.href = "../index.html";
  }
});