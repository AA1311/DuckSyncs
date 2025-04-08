import { initDialog } from "./dialog.js";
import { initEventForm } from "./event-form.js";
import { initToaster } from "./toaster.js";

export function initEventFormDialog() {
  const dialog = initDialog("event-form");
  if (!dialog.dialogElement) {
    console.error("Event form dialog not initialized!");
    return;
  }
  const toaster = initToaster(dialog.dialogElement);
  const eventForm = initEventForm(toaster);

  const dialogTitleElement = dialog.dialogElement.querySelector("[data-dialog-title]");
  if (!dialogTitleElement) {
    console.error("Dialog title element not found!");
  }

  document.addEventListener("event-create-request", (event) => {
    console.log("Received event-create-request:", event.detail);
    dialogTitleElement.textContent = "Create event";
    eventForm.switchToCreateMode(
      event.detail.date,
      event.detail.startTime,
      event.detail.endTime
    );
    dialog.open();
  }); 

  document.addEventListener("event-edit-request", (event) => {
    console.log("Received event-edit-request:", event.detail);
    dialogTitleElement.textContent = "Edit event";
    eventForm.switchToEditMode(event.detail.event);
    dialog.open();
  });

  dialog.dialogElement.addEventListener("close", () => {
    eventForm.reset();
  });

  eventForm.formElement.addEventListener("event-create", () => {
    dialog.close();
  });

  eventForm.formElement.addEventListener("event-edit", () => {
    dialog.close();
  });
}