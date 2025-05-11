document.addEventListener("DOMContentLoaded", () => {
  // Print Route button
  const printBtn = document.getElementById("print-route");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Share Route button
  const shareBtn = document.getElementById("share-route");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      // Create shareable URL parameters
      const params = new URLSearchParams();

      // Add origin
      params.append("origin", originAddress);

      // Add destinations
      if (typeof destinationsArray === "object" && destinationsArray.length) {
        destinationsArray.forEach((dest) => {
          params.append("dest", dest);
        });
      }

      // Create shareable URL
      const shareUrl = `${
        window.location.origin
      }/shared-route?${params.toString()}`;
      console.log("Shareable URL:", shareUrl);

      // Create share data
      const shareData = {
        title: "My Optimized Route",
        text: `Check out this route from ${routeData.startAddress}`,
        url: shareUrl,
      };

      // Web Share API
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.log("Error sharing:", err);
        }
      } else {
        // Fallback: Copy URL to clipboard
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            alert("Route URL copied to clipboard!");
          })
          .catch((err) => {
            console.error("Failed to copy URL: ", err);
          });
      }
    });
  }
});
