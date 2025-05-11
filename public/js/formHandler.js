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

        // Update the destination numbers after removal
        updateDestinationLabels();
      });

      // Add Google Places autocomplete to the new input (if available)
      setTimeout(() => {
        const input = document.getElementById(`destination${destinationCount}`);
        if (input && window.google && google.maps && google.maps.places) {
          new google.maps.places.Autocomplete(input);
        }
      }, 100);
    });
  }

  // Function to update destination labels after removal
  function updateDestinationLabels() {
    // First destination is always #1 and is not in the container
    // Start numbering additional destinations from 2
    const destinationInputs =
      destinationsContainer.querySelectorAll(".form-group");

    destinationInputs.forEach((group, index) => {
      const destinationNumber = index + 2; // +2 because we start from Destination 2

      // Update label
      const label = group.querySelector("label");
      if (label) {
        label.textContent = `Destination ${destinationNumber}:`;
        label.setAttribute("for", `destination${destinationNumber}`);
      }

      // Update input ID (keep the name the same for form submission)
      const input = group.querySelector("input");
      if (input) {
        input.id = `destination${destinationNumber}`;
      }
    });

    // Update destinationCount to reflect actual number of fields
    destinationCount = destinationInputs.length + 1; // +1 for the first destination
  }
});
