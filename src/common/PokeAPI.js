import axios from 'axios';

export const PokeAPI = axios.create({
  baseURL: `//api.pokeapi.co/api/v2`,
  pokemonURL: `//api.pokeapi.co/api/v2/pokemon`,
  snorlaxURL: `//api.pokeapi.co/api/v2/pokemon/143`
})
API.interceptors.request.use(function (config) {
  // Set common parameters APPID and units on each request
  return config;
}, function (error) {
  return Promise.reject(error);
});

