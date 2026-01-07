import { useMemo } from "react";
import { Country } from "country-state-city";
import { getFlagEmoji } from "@/utils";

export function useCountryOptions() {
  return useMemo(() => {
    return Country.getAllCountries()
      .map((country) => {
        const { phonecode = "" } = country || {};
        if (phonecode.includes("and")) {
          const newPhonecodes = phonecode.split("and");
          return [
            ...newPhonecodes.map((newPhonecode) => {
              return {
                ...country,
                phonecode: newPhonecode,
              };
            }),
          ];
        }
        return country;
      })
      .flat(1)
      .map((country) => {
        const phonecode = `${
          country.phonecode.startsWith("+")
            ? country.phonecode
            : "+" + country.phonecode
        }`;
        const label = `${getFlagEmoji(country.isoCode)} ${phonecode}`;

        return {
          label,
          value: country.phonecode.startsWith("+")
            ? country.phonecode
            : "+" + country.phonecode,
        };
      });
  }, []);
}
