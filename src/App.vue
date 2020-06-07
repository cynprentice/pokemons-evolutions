<template>
  <div>
    <h1>Pokémon Evolutions</h1>
    <router-view/>
  
  </div>
</template>

<script>
// import data from pokedata.js file
import axios from "axios";

export default {
  name: "PokeSearch",
  data() {
    return {
      
    };
  },

  methods: {
   

    getPokemonCards: function(name) {
      console.log("called getPokemonCards");
      axios
        .get("https://api.pokemontcg.io/v1/cards/", {
          params: {
            name: name
          }
        })
        .then(response => {
          this.cards = response.data.cards;
          this.pokeImageURL = this.cards[0].imageUrl
        })
        .catch(error => {
          this.errors.push(error);
        });
    }
  }
};
</script>

<style>
body {
  font-family: sans-serif;
  background-color: white;
}



</style>
