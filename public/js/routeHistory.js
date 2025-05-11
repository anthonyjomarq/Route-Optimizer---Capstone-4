class RouteHistoryManager {
  constructor(maxEntries = 5) {
    this.maxEntries = maxEntries;
    this.storageKey = "recentRoutes";
  }

  // Save a new route to localStorage
  saveRoute(origin, destinations) {
    const routes = this.getRoutes();

    // Create new route entry
    const newRoute = {
      id: Date.now(), // Unique timestamp ID
      date: new Date().toLocaleString(),
      origin,
      destinations,
    };

    // Add to beginning of array
    routes.unshift(newRoute);

    // Keep only the maximum allowed entries
    if (routes.length > this.maxEntries) {
      routes.length = this.maxEntries;
    }

    // Save back to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(routes));
    console.log("Route saved:", newRoute); // Debugging
  }

  // Get all saved routes
  getRoutes() {
    const routesJson = localStorage.getItem(this.storageKey);
    return routesJson ? JSON.parse(routesJson) : [];
  }

  // Delete a specific route by ID
  deleteRoute(id) {
    const routes = this.getRoutes();
    const updatedRoutes = routes.filter((route) => route.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRoutes));
  }

  // Clear all routes
  clearAllRoutes() {
    localStorage.removeItem(this.storageKey);
  }

  // Display routes in the DOM
  displayRoutes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error("Container not found:", containerId);
      return;
    }

    const routes = this.getRoutes();
    console.log("Found routes:", routes.length); // Debugging

    // Show/hide the section based on whether there are routes
    const section = document.getElementById("recent-routes-section");
    if (section) {
      section.style.display = routes.length > 0 ? "block" : "none";
    }

    if (routes.length === 0) {
      return;
    }

    // Generate HTML for routes
    let html = '<ul class="recent-routes-list">';

    routes.forEach((route) => {
      const destinationsText = Array.isArray(route.destinations)
        ? route.destinations.join(" → ")
        : route.destinations;

      html += `
        <li class="recent-route-item">
          <div class="route-info">
            <div class="route-date">${route.date}</div>
            <div class="route-path">
              <strong>From:</strong> ${route.origin}<br>
              <strong>To:</strong> ${destinationsText}
            </div>
          </div>
          <div class="route-actions">
            <button class="load-route-btn" data-route-id="${route.id}">Load</button>
            <button class="delete-route-btn" data-route-id="${route.id}">Delete</button>
          </div>
        </li>
      `;
    });

    html += "</ul>";

    if (routes.length > 0) {
      html +=
        '<button id="clear-all-routes" class="clear-all-btn">Clear All</button>';
    }

    container.innerHTML = html;

    //Event listeners for buttons
    document.querySelectorAll(".load-route-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const routeId = parseInt(e.target.dataset.routeId);
        const route = routes.find((r) => r.id === routeId);
        if (route) {
          this.loadRouteToForm(route);
        }
      });
    });

    document.querySelectorAll(".delete-route-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const routeId = parseInt(e.target.dataset.routeId);
        this.deleteRoute(routeId);
        this.displayRoutes(containerId);
      });
    });

    const clearAllBtn = document.getElementById("clear-all-routes");
    if (clearAllBtn) {
      clearAllBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear all saved routes?")) {
          this.clearAllRoutes();
          this.displayRoutes(containerId);
        }
      });
    }
  }

  // Load a route into the form
  loadRouteToForm(route) {
    console.log("Loading route to form:", route); // Debugging

    const originInput = document.getElementById("origin");
    if (originInput) {
      originInput.value = route.origin;
    }

    // Handle first destination
    const firstDestInput = document.getElementById("destination1");
    if (firstDestInput && route.destinations && route.destinations.length > 0) {
      firstDestInput.value = route.destinations[0];
    }

    // Clear any additional destination fields
    const destinationsContainer = document.getElementById(
      "destinations-container"
    );
    if (destinationsContainer) {
      destinationsContainer.innerHTML = "";
    }

    // Add additional destinations if needed
    if (route.destinations && route.destinations.length > 1) {
      const addDestBtn = document.getElementById("add-destination");
      if (addDestBtn) {
        // Programmatically add destination fields and set their values
        for (let i = 1; i < route.destinations.length; i++) {
          // Trigger add destination button click
          addDestBtn.click();

          // Wait for the DOM to update
          setTimeout(() => {
            const destInput = document.getElementById(`destination${i + 1}`);
            if (destInput) {
              destInput.value = route.destinations[i];
            }
          }, 100);
        }
      }
    }
  }
}

// Initialize route history when page loads
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing route history");
  const routeHistory = new RouteHistoryManager();
  routeHistory.displayRoutes("recent-routes-list");
});
