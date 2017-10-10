function locationIsAccurate(location, lastLocation) {
    
        let maxDelta = 0.0001;
    
        let deltaLatitude = Math.abs(
          (location.coords.lat - this.lastLocation.coords.lat)
        )
    
        let deltaLongitude = Math.abs(
          (location.coords.lng - this.lastLocation.coords.lng)
        )
    
        //CHECK IF DISTANCE IS TOO FAR, ie PREVENT WEIRD LINES ON MAP
    
        // console.log("Comparing this location and last location:");
        // console.log("Current Latitude: " + location.coords.latitude);
        // console.log("Current Longitude: " + location.coords.longitude)
        // console.log("Last Latitude: " + this.lastLocation.coords.latitude);
        // console.log("Last Longitude: " + this.lastLocation.coords.longitude);
        // console.log("Delta Latitude: " + deltaLatitude);
        // console.log("Delta Longitude: " + deltaLongitude);
    
        if (
          (
            (deltaLatitude < maxDelta) &&
            (deltaLongitude < maxDelta))
        ) {
          return true;
        } else {
          console.log("Location is not accurate: ignoring coordinate");
        //   this.patrol.getPath().pop();
          return false;
        }
      };