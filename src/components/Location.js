import React, { Component } from "react";

export default class SingleLocation extends Component {
  render() {
    return (
      <li
        role="button"
        className="location-list"
        tabIndex="0"
        onKeyPress={this.props.openMarkerWindow.bind(
          this,
          this.props.data.marker
        )}
        onClick={this.props.openMarkerWindow.bind(this, this.props.data.marker)}
      >
        {this.props.data.titlocation}
      </li>
    );
  }
}
