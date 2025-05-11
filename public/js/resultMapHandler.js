document.addEventListener("DOMContentLoaded", () => {
  // Initialize map
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Parse route data (should be defined in the view)
  if (typeof routeData === "undefined" || !routeData) {
    console.error("Route data not available");
    return;
  }

  // Create the map
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

  // Prepare the request based on whether it's single or multi-destination
  const request = {
    origin: originAddress,
    travelMode: google.maps.TravelMode.DRIVING,
    optimizeWaypoints: true,
  };

  if (isMultiDestination) {
    // For multi-destination routes
    // The last destination is the final destination
    request.destination = destinationsArray[destinationsArray.length - 1];

    // All other destinations are waypoints
    if (destinationsArray.length > 1) {
      request.waypoints = destinationsArray.slice(0, -1).map((destination) => ({
        location: destination,
        stopover: true,
      }));
    }
  } else {
    // For single destination routes
    request.destination = destinationsArray[0];
  }

  // Request directions
  directionsService.route(request, (response, status) => {
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

      // Add custom markers for multi-destination routes
      if (isMultiDestination && legs.length > 1) {
        // Remove default markers
        directionsRenderer.setOptions({ suppressMarkers: true });

        // Add custom start marker
        new google.maps.Marker({
          position: legs[0].start_location,
          map: map,
          label: "S",
          title: "Start: " + legs[0].start_address,
        });

        // Add waypoint markers
        for (let i = 0; i < legs.length - 1; i++) {
          new google.maps.Marker({
            position: legs[i].end_location,
            map: map,
            label: (i + 1).toString(),
            title: "Stop " + (i + 1) + ": " + legs[i].end_address,
          });
        }

        // Add end marker
        new google.maps.Marker({
          position: legs[legs.length - 1].end_location,
          map: map,
          label: "E",
          title: "End: " + legs[legs.length - 1].end_address,
        });
      }
    } else {
      console.error("Directions request failed due to " + status);
      alert("Could not display directions due to: " + status);
    }
  });
});
