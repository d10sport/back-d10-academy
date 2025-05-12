import {
  restcountrieApiGetCountriesAmerica,
  restcountrieApiGetCountriesRegion,
  restcountrieApiGetAllCountries,
  restcountrieApiGetDatesColombia,
  restcountrieApiGetDatesCountryID
} from "../../lib/api/restcounties.cities.api.js";
import {
  rapidapiGetCountries,
  rapidapiGetCitiesByDeparmentIDAndCountryID,
  rapidapiGetDeparmentColombian
} from "../../lib/api/rapidapi.geodbcities.api.js";
import {
  geonamesApiGetCityOneCountry,
  geonamesApiGetCitiesColombian
} from "../../lib/api/geonames.api.js";
import { responseQueries } from "../../common/enum/queries/response.queries.js";
import axios from "axios";

// Obtener Paises RestCountries
export const getAllCountriesRestCountries = async (req, res) => {
  const countries = await restcountrieApiGetAllCountries();
  if (!countries) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: countries }));
}

// Obtener Paises America RestCountries
export const getCountriesAmericaRestCountries = async (req, res) => {
  const countries = await restcountrieApiGetCountriesAmerica();
  if (!countries) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: countries }));
}

// Obtener Paises por Region RestCountries
export const getCountriesRegionRestCountries = async (req, res) => {
  const region = req.params.region;
  const countries = await restcountrieApiGetCountriesRegion(region);
  if (!countries) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: countries }));
}

// Obtener Fechas Colombia RestCountries
export const getDateColombianRestCountries = async (req, res) => {
  const data = await restcountrieApiGetDatesColombia(req, res);
  if (!data) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: data }));
}

// Obtener Fechas por ID Ciudad RestCountries
export const getDateCityIDRestCountries = async (req, res) => {
  const contryID = req.params.contryID;
  const data = await restcountrieApiGetDatesCountryID(contryID);
  if (!data) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: data }));
}


// Obtener Ciudades de Colombia GeoName
export const getCitiesColombianGeoNames = async (req, res) => {
  const cities = await geonamesApiGetCitiesColombian();
  if (!cities) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: cities }));
}

// Obtener Ciudades por ID Pais GeoName
export const getCitiesOneCountryIDGeoNames = async (req, res) => {
  const countryID = req.params.countryID;
  const cities = await geonamesApiGetCityOneCountry(countryID);
  if (!cities) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: cities }));
}


// Obtener paises RapidApi

export const getCountriesRapidapi = async (req, res) => {
  const countries = await rapidapiGetCountries();
  if (!countries) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: countries }));
}

// Obtener Departamentos Colombianos RapidApi
export const getDepartmentColombianRapidapi = async (req, res) => {
  const department = await rapidapiGetDeparmentColombian();
  if (!department) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: department }));
}

// Obtener Ciudades por ID Pais y Departamento RapidApi
export const getCitiesOneCountryIDAndDepartmentIDRapidapi = async (req, res) => {
  const countryID = req.params.countryID;
  const departmentID = req.params.departmentID;
  const cities = await rapidapiGetCitiesByDeparmentIDAndCountryID(countryID, departmentID);
  if (!cities) return res.json(responseQueries.error({ message: "Error" }));
  return res.json(responseQueries.success({ message: "Success", data: cities }));
}

//Obtener imagen de instagram con proxy
export const getImageWithProxy = async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.query.url);

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // 👈 Importante para que devuelva un buffer
    });

    // Obtener tipo de contenido (ej: image/jpeg)
    const contentType = response.headers["content-type"];

    res.set("Content-Type", contentType);
    res.send(response.data); // 👈 Enviar el buffer directamente
  } catch (error) {
    console.error("Error al obtener imagen:", error.message);
    res.status(500).send("Error al obtener imagen");
  }
}
