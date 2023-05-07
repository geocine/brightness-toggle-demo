import { useState, useEffect } from "react";

import "./BrightnessToggle.css";

const BrightnessToggle = () => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    // Fetch initial state of toggle from API
    async function fetchBrightnessData() {
      try {
        const response = await fetch("http://localhost:3001/api/brightness");
        const data = await response.json();
        setIsOn(data.isOn);
      } catch (error) {
        console.log(error);
      }
    }

    fetchBrightnessData();

    // Setup websocket subscription to listen for changes
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setIsOn(data.isOn);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleChange = async () => {
    // Toggle local state
    setIsOn(!isOn);

    // Send new state to API
    async function toggleBrightness() {
      try {
        const response = await fetch("http://localhost:3001/api/brightness", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isOn: !isOn,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.log(error);
      }
    }

    toggleBrightness();
  };

  return (
    <div className="card">
      <label className="label">Brightness</label>
      <input
        type="checkbox"
        className="toggle-input"
        checked={isOn}
        onChange={handleChange}
      />
    </div>
  );
};

export default BrightnessToggle;
