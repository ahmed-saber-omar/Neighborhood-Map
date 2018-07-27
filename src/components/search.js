import React, { Component } from "react";
import Location from "./Location";

export default class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      query: ""
    };
  }

  // Filters locations based on user input
  searchInput = event => {
    this.props.closeMarkerWindow();
    const { value } = event.target;
    let locations = [];
    this.props.myLocations.filter(location => {
      if (
        location.titlocation.toLowerCase().indexOf(value.toLowerCase()) >= 0
      ) {
        location.marker.setVisible(true);
        locations.push(location);
      } else {
        location.marker.setVisible(false);
      }
    });

    this.setState({ locations: locations, query: value });
  };

  componentWillMount() {
    this.setState({ locations: this.props.myLocations });
  }

  render() {
    if (this.state.locations) {
      return (
        <div className="search">
          <input
            role="search"
            aria-labelledby="filter"
            id="search-field"
            className="search-field"
            type="text"
            placeholder="Search for some location"
            value={this.state.query}
            onChange={this.searchInput}
          />
          <ul>
            {this.state.locations.map((listItem, index) => (
              <Location
                key={index}
                openMarkerWindow={this.props.openMarkerWindow}
                data={listItem}
              />
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div>
          <p>Error retrieving data</p>
        </div>
      );
    }
  }
}
