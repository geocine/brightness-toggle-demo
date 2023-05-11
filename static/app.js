// app.js
let isOn = false;
let toggleInput = document.getElementById("toggle-input");

async function fetchBrightnessData() {
  try {
    let response = await fetch("http://localhost:3001/api/brightness");
    let data = await response.json();
    isOn = data.isOn;
    updateToggle();
  } catch (error) {
    console.log(error);
  }
}

async function toggleBrightness() {
  isOn = !isOn;
  updateToggle();

  try {
    let response = await fetch("http://localhost:3001/api/brightness", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        isOn: isOn
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
  } catch (error) {
    console.log(error);
  }
}

function updateToggle() {
  toggleInput.checked = isOn;
}

function handleChange() {
  toggleBrightness();
}

toggleInput.addEventListener("change", handleChange);

function setupWebSocket() {
  let ws = new WebSocket("ws://localhost:3001");
  ws.onmessage = function(event) {
    let data = JSON.parse(event.data);
    isOn = data.isOn;
    updateToggle();
  };

  window.onbeforeunload = function() {
    ws.close();
  };
}

fetchBrightnessData();
setupWebSocket();