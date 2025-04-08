// import { initDialog } from "./dialog.js";
// import { eventTimeToDate } from "./event.js";

// const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
//   weekday: 'short',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric'
// });

// const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
//   hour: 'numeric',
//   minute: 'numeric'
// });

// export function initEventDetailsDialog() {
//   const dialog = initDialog("event-details");

//   const deleteButtonElemenet = dialog.dialogElement.querySelector("[data-event-details-delete-button]");

//   const editButtonElement = dialog.dialogElement.querySelector("[data-event-details-edit-button]");

//   let currentEvent = null;

//   document.addEventListener("event-click", (event) => {
//     currentEvent = event.detail.event;
//     fillEventDetailsDialog(dialog.dialogElement, event.detail.event);
//     dialog.open();
//   });

//   deleteButtonElemenet.addEventListener("click", () => {
//     dialog
//       .close()
//       .then(() => {
//         deleteButtonElemenet.dispatchEvent(new CustomEvent("event-delete-request", {
//           detail: {
//             event: currentEvent
//           },
//           bubbles: true
//         }));
//       });
//   });

//   editButtonElement.addEventListener("click", () => {
//     dialog
//       .close()
//       .then(() => {
//         editButtonElement.dispatchEvent(new CustomEvent("event-edit-request", {
//           detail: {
//             event: currentEvent
//           },
//           bubbles: true
//         }));
//       });
//   });
// }

// function fillEventDetailsDialog(parent, event) {
//   const eventDetailsElement = parent.querySelector("[data-event-details]");
//   const eventDetailsTitleElement = eventDetailsElement.querySelector("[data-event-details-title]");
//   const eventDetailsDateElement = eventDetailsElement.querySelector("[data-event-details-date]");
//   const eventDetailsStartTimeElement = eventDetailsElement.querySelector("[data-event-details-start-time]");
//   const eventDetailsEndTimeElement = eventDetailsElement.querySelector("[data-event-details-end-time]");

//   eventDetailsTitleElement.textContent = event.title;
//   eventDetailsDateElement.textContent = eventDateFormatter.format(event.date);
//   eventDetailsStartTimeElement.textContent = eventTimeFormatter.format(
//     eventTimeToDate(event, event.startTime)
//   );
//   eventDetailsEndTimeElement.textContent = eventTimeFormatter.format(
//     eventTimeToDate(event, event.endTime)
//   );

//   eventDetailsElement.style.setProperty("--event-color", event.color);
// }

import { initDialog } from "./dialog.js";
import { eventTimeToDate } from "./event.js";

const eventDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: 'short',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});

const eventTimeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: 'numeric',
  minute: 'numeric'
});

export function initEventDetailsDialog() {
  const dialog = initDialog("event-details");

  const deleteButtonElement = dialog.dialogElement.querySelector("[data-event-details-delete-button]");
  const editButtonElement = dialog.dialogElement.querySelector("[data-event-details-edit-button]");

  let currentEvent = null;

  function fillDetails(event) {
    currentEvent = event;
    fillEventDetailsDialog(dialog.dialogElement, event);
  }

  function open() {
    if (currentEvent) {
      fillDetails(currentEvent); // Ensure details are filled when opening
    }
    dialog.open();
  }

  deleteButtonElement.addEventListener("click", () => {
    dialog.close().then(() => {
      deleteButtonElement.dispatchEvent(new CustomEvent("event-delete-request", {
        detail: { event: currentEvent },
        bubbles: true
      }));
    });
  });

  editButtonElement.addEventListener("click", () => {
    dialog.close().then(() => {
      editButtonElement.dispatchEvent(new CustomEvent("event-edit-request", {
        detail: { event: currentEvent },
        bubbles: true
      }));
    });
  });

  return {
    fillDetails,
    open,
    close: () => dialog.close()
  };
}

function fillEventDetailsDialog(parent, event) {
  const eventDetailsElement = parent.querySelector("[data-event-details]");
  const eventDetailsTitleElement = eventDetailsElement.querySelector("[data-event-details-title]");
  const eventDetailsDateElement = eventDetailsElement.querySelector("[data-event-details-date]");
  const eventDetailsStartTimeElement = eventDetailsElement.querySelector("[data-event-details-start-time]");
  const eventDetailsEndTimeElement = eventDetailsElement.querySelector("[data-event-details-end-time]");

  eventDetailsTitleElement.textContent = event.title || "Untitled";
  eventDetailsDateElement.textContent = eventDateFormatter.format(event.date);
  eventDetailsStartTimeElement.textContent = eventTimeFormatter.format(
    eventTimeToDate(event, event.startTime)
  );
  eventDetailsEndTimeElement.textContent = eventTimeFormatter.format(
    eventTimeToDate(event, event.endTime)
  );

  eventDetailsElement.style.setProperty("--event-color", event.color);
}