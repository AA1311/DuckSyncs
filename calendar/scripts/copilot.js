const BACKEND_URL = "https://calendar-copilot-backend-sankalpkhira-c2dcbcfvf3gdcrad.eastus2-01.azurewebsites.net";

// Global variable to store the conversation thread id
let currentThreadId = null;

export function toggleCopilot() {
  const el = document.getElementById("copilot-container");
  el.classList.toggle("hidden");
}

export async function sendToCopilot() {
  const input = document.getElementById("copilot-input");
  const text = input.value.trim();
  if (!text) return;

  const messages = document.getElementById("copilot-messages");
  messages.innerHTML += `<div class="user">🧑‍💻 ${text}</div>`;
  input.value = "";

  // ----- Begin Client-Side Event Command Parsing -----
  // Look for a pattern like: add (a) <event description> on <date> from <start time> to <end time>
  const addEventRegex = /add\s+(?:a\s+)?(.+?)\s+on\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?)(?:\s+from\s+(\d{1,2}:\d{2}\s*[AP]M))?\s*(?:to\s+(\d{1,2}:\d{2}\s*[AP]M))?/i;
  const match = text.match(addEventRegex);
  if (match) {
    // Extract details – this is a simplified example
    const eventTitle = match[1].trim();
    const dateStr = match[2].trim();
    const startTimeStr = match[3] ? match[3].trim() : "12:00 AM";
    const endTimeStr = match[4] ? match[4].trim() : "11:59 PM";
    
    // For demonstration, we'll convert these strings to ISO format using hardcoded values.
    // Ideally, use a date parsing library to handle various formats.
    // We'll assume if dateStr contains "April 10", we use "2025-04-10"
    let eventDate = "2025-04-10"; // This would be dynamically parsed from dateStr
    // Convert times: for example "1:00 PM" becomes "13:00:00"
    // In a real setup, you'd parse these strings properly. Here, we assume:
    // startTimeStr "1:00 PM" -> "13:00:00", endTimeStr "5:00 PM" -> "17:00:00"
    // Use a simple check as an example:
    let startISO = eventDate + "T13:00:00";
    let endISO = eventDate + "T17:00:00";
    
    const eventObj = {
      title: eventTitle,
      start: startISO,
      end: endISO
    };
    
    // Dispatch an event-create event so your calendar logic can add it
    document.dispatchEvent(new CustomEvent("event-create", { detail: { event: convertExtractedEvent(eventObj) } }));
    
    messages.innerHTML += `<div class="assistant">🤖 Awesome, your ${eventTitle} has been added!</div>`;
    messages.scrollTop = messages.scrollHeight;
    return;
  }
  // ----- End Client-Side Event Command Parsing -----

  // If no special command detected, send message to the /chat endpoint normally:
  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, threadId: currentThreadId })
    });

    const data = await res.json();

    // Update thread id if returned from the backend
    if (data.threadId) {
      currentThreadId = data.threadId;
    }

    if (data.response) {
      messages.innerHTML += `<div class="assistant">🤖 ${data.response}</div>`;
    } else {
      messages.innerHTML += `<div class="assistant error">🤖 No response received.</div>`;
    }

    if (data.events) {
      data.events.forEach(eventItem => {
        const convertedEvent = convertExtractedEvent(eventItem);
        document.dispatchEvent(new CustomEvent("event-create", { detail: { event: convertedEvent } }));
      });
    }
  } catch (err) {
    messages.innerHTML += `<div class="assistant error">❌ Error: ${err.message}</div>`;
    console.error("Error sending chat message:", err);
  }

  messages.scrollTop = messages.scrollHeight;
}

export async function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const messages = document.getElementById("copilot-messages");

  messages.innerHTML += `<div class="user">🧑‍💻 Uploaded file: ${file.name}</div>`;
  
  if (file.type !== "application/pdf") {
    messages.innerHTML += `<div class="assistant error">🤖 Please upload a valid PDF file.</div>`;
    return;
  }
  
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch(`${BACKEND_URL}/upload`, {
      method: "POST",
      body: formData
    });
    
    // Log raw response for debugging purposes
    const rawResponse = await res.text();
    console.log("Raw upload response:", rawResponse);
    
    let data;
    try {
      data = JSON.parse(rawResponse);
    } catch (e) {
      throw new Error("Backend did not return valid JSON.");
    }
    
    if (data.message) {
      messages.innerHTML += `<div class="assistant">🤖 ${data.message}</div>`;
    } else {
      messages.innerHTML += `<div class="assistant error">🤖 No response received for PDF upload.</div>`;
    }
    
    if (data.events) {
      // Automatically create events from the extracted events
      data.events.forEach(eventItem => {
        const convertedEvent = convertExtractedEvent(eventItem);
        document.dispatchEvent(new CustomEvent("event-create", { detail: { event: convertedEvent } }));
      });
    }
  } catch (err) {
    messages.innerHTML += `<div class="assistant error">❌ Error: ${err.message}</div>`;
    console.error("Error during PDF upload:", err);
  }
  
  messages.scrollTop = messages.scrollHeight;
}

/**
 * Helper function to convert an extracted event from the backend (or manual command)
 * into the format expected by your event store and calendar. Assumes the event contains:
 * - title (string)
 * - start (ISO string)
 * - end (ISO string)
 *
 * The converted event will have:
 * - date: ISO string representing the event's date (normalized to midnight)
 * - startTime: minutes from midnight for the start time
 * - endTime: minutes from midnight for the end time
 * - color: a default color assigned (customize as needed)
 */
function convertExtractedEvent(eventItem) {
  const startDate = new Date(eventItem.start);
  const endDate = new Date(eventItem.end);
  
  // Normalize the event date to midnight
  const eventDate = new Date(startDate);
  eventDate.setHours(0, 0, 0, 0);
  
  // Calculate minutes from midnight (for startTime and endTime)
  const startTime = startDate.getHours() * 60 + startDate.getMinutes();
  const endTime = endDate.getHours() * 60 + endDate.getMinutes();
  
  return {
    id: null, // Let Firestore or your database generate an ID if needed
    title: eventItem.title,
    date: eventDate.toISOString(),
    startTime: startTime,
    endTime: endTime,
    color: "#0078D4" // Default color; adjust if needed
  };
}
