document.addEventListener("DOMContentLoaded", () => {
  // Initialize map
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Parse route data (should be defined in the view)
  if (typeof routeData === "undefined" || !routeData) {
    console.error("Route data not available");
    return;
  }

  // Create the map centered on the route start
  const map = new google.maps.Map(mapElement, {
    zoom: 12,
    mapTypeControl: false,
  });

  // Use Google's DirectionsService and DirectionsRenderer
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: false,
    polylineOptions: {
      strokeColor: "#0066ff",
      strokeWeight: 5,
    },
  });

  // Request directions using the origin and destination addresses
  directionsService.route(
    {
      origin: originAddress,
      destination: destinationAddress,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    },
    (response, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(response);

        // Fit the map to the route
        const bounds = new google.maps.LatLngBounds();
        const legs = response.routes[0].legs;

        for (let i = 0; i < legs.length; i++) {
          bounds.extend(legs[i].start_location);
          bounds.extend(legs[i].end_location);
        }

        map.fitBounds(bounds);
      } else {
        console.error("Directions request failed due to " + status);
        alert("Could not display directions due to: " + status);
      }
    }
  );
});
