import apiClient from "../utils/apiClient.js";
import config from "../config/default.js";
import { logger } from "../utils/logger.js";

/**
 * Convert address to coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>} - Coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    logger.info(`Geocoding address: ${address}`);

    const response = await apiClient.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: config.api.key,
        },
      }
    );

    if (response.data.status !== "OK") {
      throw new Error(`Geocoding error: ${response.data.status}`);
    }

    if (response.data.results.length === 0) {
      throw new Error("No results found for this address");
    }

    const location = response.data.results[0].geometry.location;
    logger.info(`Geocoded ${address} to ${location.lat},${location.lng}`);

    return location;
  } catch (error) {
    logger.error(`Error geocoding address ${address}: ${error.message}`);
    throw error;
  }
};

/**
 * Convert coordinates to address (reverse geocoding)
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} - Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    logger.info(`Reverse geocoding coordinates: ${lat},${lng}`);

    const response = await apiClient.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: config.api.key,
        },
      }
    );

    if (response.data.status !== "OK") {
      throw new Error(`Reverse geocoding error: ${response.data.status}`);
    }

    if (response.data.results.length === 0) {
      throw new Error("No address found for these coordinates");
    }

    const formattedAddress = response.data.results[0].formatted_address;
    logger.info(`Reverse geocoded ${lat},${lng} to ${formattedAddress}`);

    return formattedAddress;
  } catch (error) {
    logger.error(
      `Error reverse geocoding coordinates ${lat},${lng}: ${error.message}`
    );
    throw error;
  }
};
