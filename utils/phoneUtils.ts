import { Country } from "country-state-city";
import { AsYouType, isValidPhoneNumber, CountryCode } from "libphonenumber-js";

/**
 * Validates a phone number based on the country code
 * @param value - The phone number to validate
 * @param phoneCode - The country phone code (e.g., "+92", "+1")
 * @returns boolean - Whether the phone number is valid
 */
export const validatePhoneNumber = (
  value: string | number,
  phoneCode: string
): boolean => {
  try {
    const country = Country.getAllCountries().find(
      (country) => country.phonecode === phoneCode
    );
    const code = country?.isoCode || "PK";

    const asYouType = new AsYouType(code as CountryCode);
    const formatted = asYouType.input(value.toString());

    return isValidPhoneNumber(formatted, code as CountryCode);
  } catch (error) {
    return false;
  }
};

/**
 * Formats a phone number as the user types
 * @param value - The phone number to format
 * @param phoneCode - The country phone code (e.g., "+92", "+1")
 * @returns string - The formatted phone number
 */
export const formatPhoneNumber = (
  value: string | number,
  phoneCode: string
): string => {
  try {
    const country = Country.getAllCountries().find(
      (country) => country.phonecode === phoneCode
    );
    const code = country?.isoCode || "PK";

    const asYouType = new AsYouType(code as CountryCode);
    return asYouType.input(value.toString());
  } catch (error) {
    return value.toString();
  }
};

/**
 * Gets the country ISO code from a phone code
 * @param phoneCode - The country phone code (e.g., "+92", "+1")
 * @returns string - The country ISO code (e.g., "PK", "US")
 */
export const getCountryFromPhoneCode = (phoneCode: string): string => {
  try {
    const country = Country.getAllCountries().find(
      (country) => country.phonecode === phoneCode
    );
    return country?.isoCode || "PK";
  } catch (error) {
    return "PK";
  }
};

/**
 * Checks if a phone number is complete for a given country
 * @param value - The phone number to check
 * @param phoneCode - The country phone code (e.g., "+92", "+1")
 * @returns boolean - Whether the phone number is complete
 */
export const isPhoneNumberComplete = (
  value: string | number,
  phoneCode: string
): boolean => {
  try {
    const country = Country.getAllCountries().find(
      (country) => country.phonecode === phoneCode
    );
    const code = country?.isoCode || "PK";

    const asYouType = new AsYouType(code as CountryCode);
    const formatted = asYouType.input(value.toString());

    // Check if the formatted number has the expected length for the country
    return formatted.length >= 10 && formatted.length <= 15;
  } catch (error) {
    return false;
  }
};

/**
 * Extracts the national number from a phone number (removes country code)
 * @param value - The full phone number
 * @param phoneCode - The country phone code (e.g., "+92", "+1")
 * @returns string - The national phone number without country code
 */
export const getNationalNumber = (
  value: string | number,
  phoneCode: string
): string => {
  try {
    const country = Country.getAllCountries().find(
      (country) => country.phonecode === phoneCode
    );
    const code = country?.isoCode || "PK";

    const asYouType = new AsYouType(code as CountryCode);
    const formatted = asYouType.input(value.toString());

    // Remove the country code from the formatted number
    const phoneCodeWithoutPlus = phoneCode.replace("+", "");
    return formatted.replace(phoneCodeWithoutPlus, "").trim();
  } catch (error) {
    return value.toString();
  }
};
