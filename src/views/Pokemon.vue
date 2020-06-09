<template>
  <div>
    <h2>Pokémon Details</h2>
    <p>
     <router-link v-bind:to="{ name: 'Evolutions', params: { pokedexNumber: $route.params.pokedexNumber } }">View Evolution Chain</router-link>
    </p>
    <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
   
    <div class="container">

      <div class="row">
        <div class="col-1"> <h2>{{this.$route.params.pokedexNumber}}</h2> </div>
      </div>
      <div class="row">
        <div class="col col-2">
          <load-spinner v-if="showLoading"></load-spinner>
          <card-image v-bind:pokedexNumber="$route.params.pokedexNumber"></card-image>
        </div>
        <div class="col col-2">
          <h3>{{this.name}} Stats </h3>
          <p><strong>Height:</strong>{{this.height}} decimeters</p>
          <p><strong>Weight:</strong>{{this.weight}} hectograms</p>
          <div><strong>Types:</strong>
            <ul>
              <li v-for="type in pokeTypes" :key="type.type.name">{{type.type.name}}</li>
            </ul>
          </div>
          <div><strong>Abilities</strong>
            <ul>
              <li v-for="ability in pokeAbilities" :key="ability.ability.name">
                {{ability.ability.name}}
              </li>
            </ul>
          </div>
        </div>
      </div>
           <!-- Display Image of the Pokemon 
          <div v-for="card in cards" :key="card.id">
      <h2>{{card.name}}</h2>
      <img v-bind:src="card.imageURL" />
      <h3>National Index #{{card.nationalPokedexNumber}}</h3>
      <p>subtype: {{card.Basic}}</p>
      <p>supertype{{card.supertype}}</p>
      <p>hp{{card.hp}}</p>
      <p>supertype{{card.supertype}}</p>-->

      <!--<ul class="stats">
        <li>
          <strong>Height:</strong>
          {{pokemon.height | inchesToFeet}}
        </li>
        <li>
          <strong>Weight:</strong>
          {{pokemon.weight}} lbs
        </li>
      </ul>
      <h3 v-if="pokemon.types.length<=1">Type</h3>
      <h3 v-else>Types:</h3>
      <ul class="poketype">
        <li v-for="type in pokemon.types" v-bind:class="type" :key="type">{{type}}</li>
      </ul>
      -->
    </div>
  </div>
</template>

<script>

// import data from pokedata.js file
import axios from "axios";
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';
import CardImage from '@/components/CardImage';


export default {
  name: "PokeData",
  
components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer,
    'card-image': CardImage
  },
  data() {
    return {
      pokeResults: null,
      cardResults: null,
      messages: [],
      showLoading: false,
      name: "",
      NationalPokedexNumber: "",
      height: 111,
      weight: 222,
      pokemonURL: "//pokeapi.co/api/v2/pokemon/",
      pokeTypes: [],
      pokeAbilities: [],
      pokeImageURL: ""
      
    };
  },
created () {    
    this.pokemonURL = "//pokeapi.co/api/v2/pokemon/" + this.$route.params.pokedexNumber;
     console.log("called Pokemon.vue getting poke data with URL: " + this.pokemonURL);
     this.showLoading = true;
      axios
        .get((this.pokemonURL), {
          params: {
          }
        })
        .then(response => {
          this.pokeResults = response.data;
          this.name = this.pokeResults.name;
          this.height = this.pokeResults.height;
          this.weight = this.pokeResults.weight;
          this.pokeTypes = this.pokeResults.types;
          this.pokeAbilities = this.pokeResults.abilities;
          this.showLoading = false;
        })
        .catch(error => {
          this.messages.push({
            type: 'error',
            text: error.message
          });
              this.showLoading = false;
       
      });
  
        console.log("called Pokemon.vue getting cards for " + this.$route.params.pokedexNumber);
        this.showLoading = true;
       axios
        .get("https://api.pokemontcg.io/v1/cards/", {
          params: {
            nationalPokedexNumber: this.$route.params.PokedexNumber
          }
        })
        .then(response => {
          this.cardResults = response.data.cards;
          this.pokeImageURL = this.cardResults[0].imageUrl;
          this.showLoading = false;
        })
        .catch(error => {
          this.messages.push({
            type: 'error',
            text: error.message
          });
          this.showLoading = false;
       
      });
}
}
  
</script>

<style>
body {
  font-family: sans-serif;
  background-color: white;
}



.col-1 {
  float: left;
  width: 100%;
}

.col-2 {
  float: left;
  width: 45%;
}

.col-3 {
  float: left;
  width: 30%;
}


/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

.col > .card {
    margin: auto;
  width: 80%;
    padding: 10px;
    
}

ul {
  list-style-type: none;
  padding: 0px;
}

.pokedex {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.pokedex img {
  width: 100%;
}

.pokedex > div {
  padding: 1rem;
  border: solid;
  border-width: 3px;
  border-color: black;
  background-color: white;
}

h2,
h3 {
  font-family: sans-serif;
  text-align: center;
  text-transform: uppercase;
}

.stats {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}

.stats > li {
  padding: 0.1rem 0.5rem;
}

.poketype {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
}
.poketype li {
  display: inline;
  padding: 0.1rem 0.5rem;
  margin: 0 0.5rem;
}
.poketype li {
  font-family: sans-serif;
  color: white;
  background-color: gray;
  text-transform: uppercase;
}

.poketype .bug {
  background-color: #a8b820;
}

.poketype .dark {
  background-color: #705848;
}

.poketype .dragon {
  background-color: #7038f8;
}

.poketype .electric {
  background-color: #f8d030;
}

.poketype .fairy {
  background-color: #ee99ac;
}

.poketype .fighting {
  background-color: #c03028;
}

.poketype .fire {
  background-color: #f08030;
}

.poketype .flying {
  background-color: #a890f0;
}

.poketype .ghost {
  background-color: #705898;
}

.poketype .grass {
  background-color: #78c850;
}

.poketype .ground {
  background-color: #e0c068;
}

.poketype .ice {
  background-color: #98d8d8;
}

.poketype .normal {
  background-color: #a8a878;
}

.poketype .poison {
  background-color: #a040a0;
}

.poketype .psychic {
  background-color: #f85888;
}

.poketype .rock {
  background-color: #b8a038;
}

.poketype .steel {
  background-color: #b8b8d0;
}

.poketype .water {
  background-color: #6890f0;
}

@media screen and (min-width: 800px) {
  .pokedex {
    margin: 0 auto;
  }
  .pokedex > div {
    max-width: 400px;
  }
}
</style>
