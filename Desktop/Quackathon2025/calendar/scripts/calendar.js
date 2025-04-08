import { initMonthCalendar } from "./month-calendar.js";
import { initWeekCalendar } from "./week-calendar.js";
import { getUrlDate, getUrlView } from "./url.js";
import { currentDeviceType } from "./responsive.js";

export async function initCalendar(eventStore) {
  const calendarElement = document.querySelector("[data-calendar]");
  if (!calendarElement) {
    console.error("Calendar element not found!");
    return;
  }
 
  console.log("Calendar element found, initializing...");

  let selectedView = getUrlView() || "month";
  let selectedDate = getUrlDate() || new Date();
  let deviceType = currentDeviceType();
  let isRendering = false;

  console.log("Initial view:", selectedView, "date:", selectedDate);

  async function refreshCalendar() {
    if (isRendering) {
      console.log("Already rendering, skipping...");
      return;
    }
    isRendering = true;

    console.log("Refreshing calendar with view:", selectedView);
    calendarElement.innerHTML = "";

    try {
      if (selectedView === "month") {
        console.log("Rendering month view...");
        await initMonthCalendar(calendarElement, selectedDate, eventStore);
      } else if (selectedView === "week") {
        console.log("Rendering week view...");
        await initWeekCalendar(calendarElement, selectedDate, eventStore, false, deviceType);
      } else {
        console.log("Rendering default week view...");
        await initWeekCalendar(calendarElement, selectedDate, eventStore, true, deviceType);
      }
      console.log("Calendar refresh complete.");
    } catch (error) {
      console.error("Error rendering calendar:", error);
    } finally {
      isRendering = false;
    }
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
    console.log("Events changed, refreshing...");
    refreshCalendar();
  });

  document.addEventListener("events-loaded", (e) => {
    console.log("Events loaded from Firestore:", e.detail.events);
    refreshCalendar();
  });

  await refreshCalendar(); // Initial render
}