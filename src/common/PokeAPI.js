import axios from 'axios';

export const PokeAPI = axios.create({
  baseURL: `//api.pokeapi.co/api/v2`,
  pokemonURL:`//api.pokeapi.co/api/v2/pokemon`,
  snorlaxURL: `//api.pokeapi.co/api/v2/pokemon/143`
})
API.interceptors.request.use(function (config) {
    // Set common parameters APPID and units on each request
    //config.params.APPID = '0fcfca40631380ed07008b6e3e0f1b42';
   // config.params.units = 'imperial';
    return config;
  }, function (error) {
    return Promise.reject(error);
  });

  findPokemon: function() {
    // console.log("called findSameWords with " + word + " for line " + line);
     axios
       .get(pokemonURL {
         params: {
           ml: word,
           max: 2
         }
       })
       .then(response => {
         this.synResults = response.data;
         console.log("findPokemon found" + this.synResults.length + " results")
         // Set value of first synonym
         if (this.synResults.length >= 1) {
           if (line == 1) {
           this.synonym2 = this.synResults[0].word
          } else {
           this.rhymeSynonym2 = this.synResults[0].word
           }
         }
         // Set value of second synonym
         if (this.synResults.length == 2) {
           if (line == 1) {
           this.synonym1 = this.synResults[1].word
          } else {
           this.rhymeSynonym1 = this.synResults[1].word
           }
         }
       })
       .catch(error => {
         this.errors.push(error);
          this.ready = true
       });