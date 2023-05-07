import { Component } from "react";
import "./BrightnessToggle.css";

class BrightnessToggleComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOn: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch("http://localhost:3001/api/brightness");
      const data = await response.json();
      this.setState({ isOn: data.isOn });
    } catch (error) {
      console.log(error);
    }

    const ws = new WebSocket("ws://localhost:3001");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.setState({ isOn: data.isOn });
    };

    this.ws = ws;
  }

  componentWillUnmount() {
    this.ws?.close();
  }

  async handleChange() {
    const { isOn } = this.state;
    this.setState({ isOn: !isOn });
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
    const { isOn } = this.state;
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

export default BrightnessToggleComponent;
