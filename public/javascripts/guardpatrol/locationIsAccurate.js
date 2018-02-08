function locationIsAccurate(location, lastLocation) {
  


  console.log('logging location')
  console.log(location);

  console.log('logging lastLocation')
  console.log(lastLocation);

        let maxDelta = 0.0001;

        let deltaLatitude = Math.abs(
          (location.lat() - lastLocation.lat())
        )
    
        let deltaLongitude = Math.abs(
          (location.lng() - lastLocation.lng())
        )
    
        //CHECK IF DISTANCE IS TOO FAR, ie PREVENT WEIRD LINES ON MAP
    
        console.log("Comparing this location and last location:");
        console.log("Current Latitude: " + location.lat());
        console.log("Current Longitude: " + location.lng())
        console.log("Last Latitude: " + this.lastLocation.lat());
        console.log("Last Longitude: " + this.lastLocation.lng());
        console.log("Delta Latitude: " + deltaLatitude);
        console.log("Delta Longitude: " + deltaLongitude);
    
        if (
          (
            (deltaLatitude < maxDelta) &&
            (deltaLongitude < maxDelta))
        ) {
          return true;
        } else {
          console.log("Location is not accurate: ignoring coordinate");
          return false;
        }


      };