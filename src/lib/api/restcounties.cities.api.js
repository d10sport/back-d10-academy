import axios from 'axios';

async function restcountrieApiGetAllCountries(req, res) {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data.map(country => ({
      name: country.name.common,
      code: country.cca2,
      id: country.ccn3,
      googlemap: country.maps.googleMaps,
      openstreetmap: country.maps.openStreetMaps,
      flag: country.flags.png
    }));
    return countries;
  } catch (error) {
    return false
  }
}

async function restcountrieApiGetCountriesAmerica(req, res) {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/region/america');
    const cities = response.data.flatMap(country => ({
      name: country.name.common,
      code: country.cca2,
      id: country.ccn3,
      googlemap: country.maps.googleMaps,
      openstreetmap: country.maps.openStreetMaps,
      flag: country.flags.png
    }));
    return cities;
  } catch (error) {
    return false
  }
}

async function restcountrieApiGetCountriesRegion(region) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/region/${region}`);
    const cities = response.data.flatMap(country => ({
      name: country.name.common,
      code: country.cca2,
      id: country.ccn3,
      googlemap: country.maps.googleMaps,
      openstreetmap: country.maps.openStreetMaps,
      flag: country.flags.png
    }));
    return cities;
  } catch (error) {
    return false
  }
}

async function restcountrieApiGetDatesColombia() {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/alpha/COL');
    return response.data;
  } catch (error) {
    return false
  }
}

async function restcountrieApiGetDatesCountryID(contryID) {
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${contryID}`);
    return response.data;
  } catch (error) {
    return false
  }
}

export {
  restcountrieApiGetAllCountries,
  restcountrieApiGetCountriesAmerica,
  restcountrieApiGetCountriesRegion,
  restcountrieApiGetDatesColombia,
  restcountrieApiGetDatesCountryID
}