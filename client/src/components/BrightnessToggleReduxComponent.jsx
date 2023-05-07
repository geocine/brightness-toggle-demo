import { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./BrightnessToggle.css";

class BrightnessToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { isOn: props.isOn };
    this.handleChange = this.handleChange.bind(this);
    this.fetchBrightnessData = this.fetchBrightnessData.bind(this);
  }

  componentDidMount() {
    this.fetchBrightnessData();
    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.props.set(data.isOn);
    };
    this.ws = ws;
  }

  componentWillUnmount() {
    this.ws.close();
  }

  async fetchBrightnessData() {
    try {
      const response = await fetch("http://localhost:3001/api/brightness");
      const data = await response.json();
      this.props.set(data.isOn);
    } catch (error) {
      console.log(error);
    }
  }

  async handleChange() {
    const { isOn } = this.props;
    const { toggle } = this.props;
    // Toggle local state
    toggle();
    // Send new state to API
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

  render() {
    const { isOn } = this.props;
    return (
      <div className="card">
        <label className="label">Brightness</label>
        <input
          type="checkbox"
          className="toggle-input"
          checked={isOn}
          onChange={this.handleChange}
        />
      </div>
    );
  }
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

// Define the prop types for BrightnessToggle component
BrightnessToggle.propTypes = {
  isOn: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  set: PropTypes.func.isRequired,
};

const BrightnessToggleReduxComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(BrightnessToggle);

export default BrightnessToggleReduxComponent;
