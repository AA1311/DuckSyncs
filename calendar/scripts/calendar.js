// import { initMonthCalendar } from "./month-calendar.js";
// import { initWeekCalendar } from "./week-calendar.js";
// import { currentDeviceType } from "./responsive.js";
// import { getUrlDate, getUrlView } from "./url.js";

// export function initCalendar(eventStore) {
//   const calendarElement = document.querySelector("[data-calendar]");

//   let selectedView = getUrlView();
//   let selectedDate = getUrlDate();
//   let deviceType = currentDeviceType();

//   function refreshCalendar() {
//     const calendarScrollableElement = calendarElement.querySelector("[data-calendar-scrollable]");

//     const scrollTop = calendarScrollableElement === null ? 0 : calendarScrollableElement.scrollTop;

//     calendarElement.replaceChildren();

//     if (selectedView === "month") {
//       initMonthCalendar(calendarElement, selectedDate, eventStore);
//     } else if (selectedView === "week") {
//       initWeekCalendar(calendarElement, selectedDate, eventStore, false, deviceType);
//     } else {
//       initWeekCalendar(calendarElement, selectedDate, eventStore, true, deviceType);
//     }

//     calendarElement.querySelector("[data-calendar-scrollable]").scrollTo({ top: scrollTop });
//   }

//   document.addEventListener("view-change", (event) => {
//     selectedView = event.detail.view;
//     refreshCalendar();
//   });

//   document.addEventListener("date-change", (event) => {
//     selectedDate = event.detail.date;
//     refreshCalendar();
//   });

//   document.addEventListener("device-type-change", (event) => {
//     deviceType = event.detail.deviceType;
//     refreshCalendar();
//   });

//   document.addEventListener("events-change", () => {
//     refreshCalendar();
//   });

//   refreshCalendar();
// }

// calendar.js
import { initMonthCalendar } from "./month-calendar.js";
import { initWeekCalendar } from "./week-calendar.js";
import { currentDeviceType } from "./responsive.js";
import { getUrlDate, getUrlView } from "./url.js";

export function initCalendar(eventStore) {
  const calendarElement = document.querySelector("[data-calendar]");
  let selectedView = getUrlView();
  let selectedDate = getUrlDate();
  let deviceType = currentDeviceType();

  function refreshCalendar() {
    const calendarScrollableElement = calendarElement.querySelector("[data-calendar-scrollable]");
    const scrollTop = calendarScrollableElement ? calendarScrollableElement.scrollTop : 0;

    calendarElement.replaceChildren();

    if (selectedView === "month") {
      initMonthCalendar(calendarElement, selectedDate, eventStore);
    } else if (selectedView === "week") {
      initWeekCalendar(calendarElement, selectedDate, eventStore, false, deviceType);
    } else {
      initWeekCalendar(calendarElement, selectedDate, eventStore, true, deviceType);
    }

    if (calendarScrollableElement) {
      calendarScrollableElement.scrollTo({ top: scrollTop });
    }
    console.log("Calendar refreshed with view:", selectedView, "date:", selectedDate);
  }

  document.addEventListener("view-change", (event) => {
    selectedView = event.detail.view;
    refreshCalendar();
  });

  document.addEventListener("date-change", (event) => {
    selectedDate = event.detail.date;
    refreshCalendar();
  });

  document.addEventListener("device-type-change", (event) => {
    deviceType = event.detail.deviceType;
    refreshCalendar();
  });

  document.addEventListener("events-change", () => {
    refreshCalendar();
  });

  document.addEventListener("events-loaded", (e) => {
    console.log("Events loaded from Firestore:", e.detail.events);
    refreshCalendar(); // No need to pass events, eventStore handles it
  });

  refreshCalendar();
}