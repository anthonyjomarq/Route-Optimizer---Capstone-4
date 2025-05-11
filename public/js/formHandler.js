document.addEventListener("DOMContentLoaded", () => {
  const addDestinationButton = document.getElementById("add-destination");
  const destinationsContainer = document.getElementById(
    "destinations-container"
  );
  let destinationCount = 1;

  if (addDestinationButton) {
    addDestinationButton.addEventListener("click", () => {
      destinationCount++;

      const newDestinationDiv = document.createElement("div");
      newDestinationDiv.className = "form-group";

      newDestinationDiv.innerHTML = `
        <label for="destination${destinationCount}">Destination ${destinationCount}:</label>
        <div class="input-group">
          <input type="text" id="destination${destinationCount}" name="destinations[]" placeholder="Enter destination address" required>
          <button type="button" class="remove-destination">×</button>
        </div>
      `;

      destinationsContainer.appendChild(newDestinationDiv);

      // Add event listener to the remove button
      const removeButton = newDestinationDiv.querySelector(
        ".remove-destination"
      );
      removeButton.addEventListener("click", () => {
        destinationsContainer.removeChild(newDestinationDiv);

        // Update the destination numbers
        updateDestinationLabels();
      });

      // Add Google Places autocomplete to the new input
      // Wait a bit to ensure the DOM is updated
      setTimeout(() => {
        const input = document.getElementById(`destination${destinationCount}`);
        if (input && google && google.maps && google.maps.places) {
          new google.maps.places.Autocomplete(input);
        }
      }, 100);
    });
  }

  // Function to update destination labels after removal
  function updateDestinationLabels() {
    const destinationGroups = document.querySelectorAll(
      "#destinations-container .form-group"
    );
    destinationGroups.forEach((group, index) => {
      const label = group.querySelector("label");
      if (label) {
        label.textContent = `Destination ${index + 2}:`;
        label.setAttribute("for", `destination${index + 2}`);
      }

      const input = group.querySelector("input");
      if (input) {
        input.id = `destination${index + 2}`;
      }
    });
  }
});
