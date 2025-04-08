const BACKEND_URL = "https://calendar-copilot-backend-sankalpkhira-c2dcbcfvf3gdcrad.eastus2-01.azurewebsites.net"; // Update to deployed link later

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

  try {
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    // Updated condition for assistant response
    if (data.response) {
      messages.innerHTML += `<div class="assistant">🤖 ${data.response}</div>`;
    } else {
      messages.innerHTML += `<div class="assistant error">🤖 No response received.</div>`;
    }

    if (data.events) {
      document.dispatchEvent(new CustomEvent("copilot-events", { detail: data.events }));
    }
  } catch (err) {
    messages.innerHTML += `<div class="assistant error">❌ Error: ${err.message}</div>`;
  }

  messages.scrollTop = messages.scrollHeight;
}
