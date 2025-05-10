// public/js/mapHandler.js
document.addEventListener("DOMContentLoaded", () => {
  // Initialize map
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Create the map centered on a default location
  const map = new google.maps.Map(mapElement, {
    defaultCenter: { lat: 18.2208, lng: -66.5901 }, // Puerto Rico center
    zoom: 12,
    mapTypeControl: false,
  });

  // Initialize Places Autocomplete for form inputs
  const originInput = document.getElementById("origin");
  const autocompleteOrigin = new google.maps.places.Autocomplete(originInput);

  // Add autocomplete to all destination inputs
  const destinationInputs = document.querySelectorAll(
    'input[name="destinations[]"]'
  );
  destinationInputs.forEach((input) => {
    new google.maps.places.Autocomplete(input);
  });

  // Add autocomplete to any dynamically added destination inputs
  const addDestinationButton = document.getElementById("add-destination");
  if (addDestinationButton) {
    addDestinationButton.addEventListener("click", () => {
      // Wait for the DOM to update
      setTimeout(() => {
        const newInput = document.querySelector(
          'input[name="destinations[]"]:not(.pac-target-input)'
        );
        if (newInput) {
          new google.maps.places.Autocomplete(newInput);
        }
      }, 100);
    });
  }
});
