import { validateEvent, generateEventId } from "./event.js";

export function initEventForm(toaster) {
  const formElement = document.querySelector("[data-event-form]");
  let mode = "create";

  formElement.addEventListener("submit", (event) => {
    event.preventDefault();
    const formEvent = formIntoEvent(formElement);
    console.log("Form submitted, event:", formEvent, "Mode:", mode);
    const validationError = validateEvent(formEvent);
    if (validationError !== null) {
      toaster.error(validationError);
      console.error("Validation error:", validationError);
      return;
    }
  
    if (mode === "create") {
      console.log("Dispatching event-create:", formEvent);
      formElement.dispatchEvent(new CustomEvent("event-create", {
        detail: { event: formEvent },
        bubbles: true
      }));
    }
  
    if (mode === "edit") {
      console.log("Dispatching event-edit:", formEvent);
      formElement.dispatchEvent(new CustomEvent("event-edit", {
        detail: { event: formEvent },
        bubbles: true
      }));
    }
  });

  return {
    formElement,
    switchToCreateMode(date, startTime, endTime) {
      mode = "create";
      fillFormWithDate(formElement, date, startTime, endTime);
    },
    switchToEditMode(event) {
      mode = "edit";
      fillFormWithEvent(formElement, event);
    },
    reset() {
      formElement.querySelector("#id").value = null;
      formElement.reset();
    }
  };
}

function fillFormWithDate(formElement, date, startTime, endTime) {
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");

  dateInputElement.value = date.toISOString().substr(0, 10);
  startTimeSelectElement.value = startTime;
  endTimeSelectElement.value = endTime;
}

function fillFormWithEvent(formElement, event) {
  const idInputElement = formElement.querySelector("#id");
  const titleInputElement = formElement.querySelector("#title");
  const courseInputElement = formElement.querySelector("#Course"); // Add Course
  const dateInputElement = formElement.querySelector("#date");
  const startTimeSelectElement = formElement.querySelector("#start-time");
  const endTimeSelectElement = formElement.querySelector("#end-time");
  const colorInputElement = formElement.querySelector(`[value='${event.color}']`);

  idInputElement.value = event.id;
  console.log("Set hidden input #id to:", idInputElement.value);
  titleInputElement.value = event.title;
  courseInputElement.value = event.Course || ""; // Populate Course field
  dateInputElement.value = event.date.toISOString().substr(0, 10);
  startTimeSelectElement.value = event.startTime;
  endTimeSelectElement.value = event.endTime;
  colorInputElement.checked = true;
}

function formIntoEvent(formElement) {
  const formData = new FormData(formElement);
  const id = formData.get("id");
  const title = formData.get("title");
  const Course = formData.get("Course"); // Add Course
  const date = formData.get("date");
  const startTime = formData.get("start-time");
  const endTime = formData.get("end-time");
  const color = formData.get("color");

  const event = {
    id: id || null,
    title,
    Course, // Include Course in the event object
    date: new Date(date),
    startTime: Number.parseInt(startTime, 10),
    endTime: Number.parseInt(endTime, 10),
    color
  };

  return event;
}