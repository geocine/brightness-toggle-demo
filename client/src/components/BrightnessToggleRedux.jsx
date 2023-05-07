import { useEffect, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./BrightnessToggle.css";

function BrightnessToggle({ isOn, toggle, set }) {

    const fetchBrightnessData = useCallback(async () => {
        try {
          const response = await fetch("http://localhost:3001/api/brightness");
          const data = await response.json();
          set(data.isOn);
        } catch (error) {
          console.log(error);
        }
      }, [set]);
    
      useEffect(() => {
        fetchBrightnessData();
    
        const ws = new WebSocket("ws://localhost:3001");
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          set(data.isOn);
        };
    
        return () => {
          ws.close();
        };
      }, [fetchBrightnessData, set]);

  const handleChange = async () => {
    // Toggle local state
    toggle();

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
}

function mapStateToProps(state) {
  return {
    isOn: state.isOn,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggle: () => dispatch({ type: "TOGGLE" }),
    set: (isOn) => dispatch({ type: "SET", isOn }),
  };
}

const BrightnessToggleRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(BrightnessToggle);

// Define the prop types for BrightnessToggle component
BrightnessToggle.propTypes = {
  isOn: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
};

export default BrightnessToggleRedux;
