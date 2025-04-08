import { initStaticEvent } from "./event.js";

const eventListItemTemplateElement = document.querySelector("[data-template='event-list-item']");

export function initEventList(parent, events) {
  const eventListElement = parent.querySelector("[data-event-list]");
  if (!eventListElement) {
    console.error("Event list element not found in parent:", parent);
    return;
  }

  eventListElement.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  // Clear existing events to prevent duplicates
  eventListElement.innerHTML = "";

  // Deduplicate events by ID
  const uniqueEvents = Array.from(new Map(events.map(e => [e.id, e])).values());

  for (const event of uniqueEvents) {
    const eventListItemContent = eventListItemTemplateElement.content.cloneNode(true);
    const eventListItemElement = eventListItemContent.querySelector("[data-event-list-item]");

    console.log("Rendering event in list:", event);
    initStaticEvent(eventListItemElement, event);

    eventListElement.appendChild(eventListItemElement);
  }
}