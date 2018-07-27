import React, { Component } from "react";
import { places } from "./components/dataLocation";
import Locations from "./components/search";

export default class App extends Component {
  state = {
    myLocations: places,
    map: "",
    infowindow: "",
    prevmarker: ""
  };

  componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadMap(
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAFJFsWnLAscsdO8KMJ2a2iDjVdpMTqJlQ&callback=initMap"
    );
  }

  // Initialize the map
  initMap = () => {
    var self = this;

    let mapview = document.getElementById("map");
    mapview.style.height = window.innerHeight + "px";
    const map = new window.google.maps.Map(mapview, {
      center: {
        lat: 36.2063,
        lng: 44.0089
      },
      zoom: 13,
      mapTypeControl: false
    });

    let InfoWindow = new window.google.maps.InfoWindow({});

    this.setState({ map: map, infowindow: InfoWindow });

    window.google.maps.event.addListener(InfoWindow, "closeclick", () => {
      self.closeMarkerWindow();
    });

    window.google.maps.event.addDomListener(window, "resize", () => {
      let center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      self.state.map.setCenter(center);
    });

    window.google.maps.event.addListener(map, "click", () => {
      self.closeMarkerWindow();
    });

    let allLocations = [];
    this.state.myLocations.map(location => {
      let titlocation = `${location.name}`;
      let marker = new window.google.maps.Marker({
        _position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        get position() {
          return this._position;
        },
        set position(value) {
          this._position = value;
        },
        _animation: window.google.maps.Animation.DROP,
        get animation() {
          return this._animation;
        },
        set animation(value) {
          this._animation = value;
        },
        _map: map,
        get map() {
          return this._map;
        },
        set map(value) {
          this._map = value;
        }
      });

      marker.addListener("click", () => {
        self.openMarkerWindow(marker);
      });

      location.titlocation = titlocation;
      location.marker = marker;
      location.display = true;
      allLocations.push(location);
    });
    this.setState({ myLocations: allLocations });
  };

  //* selected marker window
  openMarkerWindow = marker => {
    this.closeMarkerWindow();
    this.state.infowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({ prevmarker: marker });
    this.state.infowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.getMarkerInfo(marker);
  };

  // Gather the info from foursquare's api, display it in the infowindow
  getMarkerInfo(marker) {
    let self = this;
    let id = "LRFKAACBEWVPKLNRFIRCVBXBD22JAZTSEBJ5IC5OIMSMJEXV";
    let secret = "EUBNWUC0C153AYVAH5SEPTQSX5V3GU52AK3BP0YU4NHHZI1A";
    let url = `https://api.foursquare.com/v2/venues/search?client_id=${id}&client_secret=${secret}&v=20130815&ll=${marker
      .getPosition()
      .lat()},${marker.getPosition().lng()}&limit=1`;

    fetch(url)
      .then(response => {
        if (response.status !== 200) {
          self.state.infowindow.setContent(`error fetching this url ${url}`);
          return;
        }

        // Parse the response in json format
        response.json().then(data => {
          let location_info = data.response.venues[0],
            nameOfPlace = `<p>Location: </p> ${
              location_info.name ? location_info.name : "Not Listed"
            } <br>`,
            location_address = `<p>Address: </p> ${
              location_info.location.address
            } <br>`,
            readMore = `<a class="learn-more-btn" href="https://foursquare.com/v/${
              location_info.id
            }" target="_blank">Learn more</a>`;
          self.state.infowindow.setContent(
            nameOfPlace + location_address + readMore
          );
        });
      })
      .catch(err => {
        self.state.infowindow.setContent("Error loading data from API", err);
      });
  }

  // Close the marker window
  closeMarkerWindow = () => {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({ prevmarker: "" });
    this.state.infowindow.close();
  };

  render() {
    return (
      <main>
        <Locations
          myLocations={this.state.myLocations}
          openMarkerWindow={this.openMarkerWindow}
          closeMarkerWindow={this.closeMarkerWindow}
        />

        <div id="map" />
      </main>
    );
  }
}

/* Load the map */
function loadMap(src) {
  const local = window.document.getElementsByTagName("script")[0];
  const script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Error trying to load the map, please try again.");
  };
  local.parentNode.insertBefore(script, local);
}
