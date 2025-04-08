import { initDialog } from "./dialog.js";

// export function initEventDeleteDialog() {
//   const dialog = initDialog("event-delete");

//   const deleteButtonElement = dialog.dialogElement.querySelector("[data-event-delete-button]");

//   let currentEvent = null;

//   document.addEventListener("event-delete-request", (event) => {
//     currentEvent = event.detail.event;
//     fillEventDeleteDialog(dialog.dialogElement, event.detail.event);
//     dialog.open();
//   });

//   deleteButtonElement.addEventListener("click", () => {
//     dialog.close();
//     deleteButtonElement.dispatchEvent(new CustomEvent("event-delete", {
//       detail: {
//         event: currentEvent
//       },
//       bubbles: true
//     }));
//   });
// }

// function fillEventDeleteDialog(parent, event) {
//   const eventDeleteTitleElement = parent.querySelector("[data-event-delete-title]");

//   eventDeleteTitleElement.textContent = event.title;
// }

export function initEventDeleteDialog() {
  const dialog = initDialog("event-delete");
  const deleteButtonElement = dialog.dialogElement.querySelector("[data-event-delete-button]");
  let currentEvent = null;

  document.addEventListener("event-delete-request", (event) => {
      currentEvent = event.detail.event;
      if (!currentEvent || !currentEvent.id) {
          console.error("Invalid event for deletion:", currentEvent);
          return;
      }
      fillEventDeleteDialog(dialog.dialogElement, currentEvent);
      dialog.open();
  });

  deleteButtonElement.addEventListener("click", () => {
      if (!currentEvent) {
          console.error("No current event to delete");
          return;
      }
      dialog.close();
      deleteButtonElement.dispatchEvent(new CustomEvent("event-delete", {
          detail: {
              event: currentEvent
          },
          bubbles: true
      }));
      currentEvent = null; // Reset after deletion
  });
}

function fillEventDeleteDialog(parent, event) {
  const eventDeleteTitleElement = parent.querySelector("[data-event-delete-title]");
  eventDeleteTitleElement.textContent = event.title || "Untitled Event";
}