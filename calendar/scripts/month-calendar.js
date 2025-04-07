import { generateMonthCalendarDays, today, isTheSameDay } from "./date.js";
import { isEventAllDay, eventStartsBefore } from "./event.js";
import { initEventList } from "./event-list.js";

const calendarTemplateElement = document.querySelector("[data-template='month-calendar']");
const calendarDayTemplateElement = document.querySelector("[data-template='month-calendar-day']");

const calendarWeekClasses = {
  4: "four-week",
  5: "five-week",
  6: "six-week"
};

export async function initMonthCalendar(parent, selectedDate, eventStore) {
  if (!calendarTemplateElement || !calendarDayTemplateElement) {
    console.error("Calendar templates not found!", { calendarTemplateElement, calendarDayTemplateElement });
    return;
  }

  const calendarContent = calendarTemplateElement.content.cloneNode(true);
  const calendarElement = calendarContent.querySelector("[data-month-calendar]");
  const calendarDayListElement = calendarElement.querySelector("[data-month-calendar-day-list]");

  if (!calendarElement || !calendarDayListElement) {
    console.error("Calendar elements not found in cloned content!", { calendarElement, calendarDayListElement });
    return;
  }

  const calendarDays = generateMonthCalendarDays(selectedDate);
  const calendarWeeks = calendarDays.length / 7;

  const calendarWeekClass = calendarWeekClasses[calendarWeeks];
  calendarElement.classList.add(calendarWeekClass);

  for (const calendarDay of calendarDays) {
    try {
      const events = await eventStore.getEventsByDate(calendarDay);
      console.log("Events for", calendarDay.toDateString(), ":", events);
      sortCalendarDayEvents(events);
      initCalendarDay(calendarDayListElement, calendarDay, events);
    } catch (error) {
      console.error("Error fetching events for", calendarDay.toDateString(), ":", error);
    }
  }

  parent.appendChild(calendarElement);
}

function initCalendarDay(parent, calendarDay, events) {
  const calendarDayContent = calendarDayTemplateElement.content.cloneNode(true);
  const calendarDayElement = calendarDayContent.querySelector("[data-month-calendar-day]");
  const calendarDayLabelElement = calendarDayContent.querySelector("[data-month-calendar-day-label]");
  const calendarEventListWrapper = calendarDayElement.querySelector("[data-month-calendar-event-list-wrapper]");

  if (isTheSameDay(today(), calendarDay)) {
    calendarDayElement.classList.add("month-calendar__day--highlight");
  }

  calendarDayLabelElement.textContent = calendarDay.getDate();

  calendarDayLabelElement.addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("date-change", {
      detail: { date: calendarDay },
      bubbles: true
    }));
    document.dispatchEvent(new CustomEvent("view-change", {
      detail: { view: "day" },
      bubbles: true
    }));
  });

  calendarEventListWrapper.addEventListener("click", () => {
    console.log("Triggering event-create-request for", calendarDay); // Add this
    document.dispatchEvent(new CustomEvent("event-create-request", {
      detail: { date: calendarDay, startTime: 600, endTime: 960 },
      bubbles: true
    }));
  });

  initEventList(calendarDayElement, events);

  parent.appendChild(calendarDayElement);
}

function sortCalendarDayEvents(events) {
  if (!Array.isArray(events)) {
    console.error("Events is not an array:", events);
    return [];
  }
  events.sort((eventA, eventB) => {
    if (isEventAllDay(eventA)) return -1;
    if (isEventAllDay(eventB)) return 1;
    return eventStartsBefore(eventA, eventB) ? -1 : 1;
  });
}