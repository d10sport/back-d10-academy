import { variablesRapidApi } from "../../utils/params/const.geodata.js";
import axios from "axios";

const x_RapidAPI_Key = variablesRapidApi.xrapidapikey
const x_RapidAPI_Host = variablesRapidApi.xrapidapihost
const rapidApiHost = variablesRapidApi.rapidapihost

async function rapidapiGetCountries() {
  try {
    const response = await axios.get(`https://${rapidApiHost}/v1/geo/countries?limit=10`,
      {
        headers: {
          'X-RapidAPI-Key': x_RapidAPI_Key,
          'X-RapidAPI-Host': x_RapidAPI_Host
        }
      }
    );
    const countries = response.data.data.flatMap(country => ({
      name: country.name,
      code: country.code,
    }));
    return countries;
  } catch (error) {
    return false
  }
}

async function rapidapiGetDeparmentColombian() {
  try {
    const response = await axios.get(`https://${rapidApiHost}/v1/geo/countries/CO/regions?limit=10`,
      {
        headers: {
          'X-RapidAPI-Key': x_RapidAPI_Key,
          'X-RapidAPI-Host': x_RapidAPI_Host
        }
      }
    );
    const department = response.data.data.flatMap(dep => ({
      name: dep.name,
      code: dep.isoCode,
    }));
    return department;
  } catch (error) {
    return false
  }
}

async function rapidapiGetCitiesByDeparmentIDAndCountryID(countryID, departmentID) {
  try {
    const response = await axios.get(`https://${rapidApiHost}/v1/geo/countries/${countryID}/regions/${departmentID}/cities?limit=10`,
      {
        headers: {
          'X-RapidAPI-Key': x_RapidAPI_Key,
          'X-RapidAPI-Host': x_RapidAPI_Host
        }
      }
    );
    const cities = response.data.data.flatMap(city => ({
      name: city.name,
      population: city.population,
    }));
    return cities;
  } catch (error) {
    return false
  }
}


export {
  rapidapiGetCountries,
  rapidapiGetDeparmentColombian,
  rapidapiGetCitiesByDeparmentIDAndCountryID
}