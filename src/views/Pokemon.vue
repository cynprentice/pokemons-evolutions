<template>
  <div>
     <h2>{{this.$route.params.pokedexNumber}}: {{this.name}} Details</h2>
    <button type="button" class="button  fixed-width-button"><h3>
     <router-link v-bind:to="{ name: 'Evolutions', params: { pokedexNumber: $route.params.pokedexNumber } }">View Evolution Chain</router-link>
    </h3> </button>
    <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
   
    <div class="container">

      <div class="row">
        <div class="column-1"> </div>
      </div>
      <div class="row">
        <div class="column-2">
          <load-spinner v-if="showLoading"></load-spinner>
          <card-carousel class="card-carousel" v-bind:pokedexNumber="$route.params.pokedexNumber"></card-carousel>

        </div>
        <div class="column-2">
          <h3>Size</h3>
          <ul  class="pokestat">
            <li><strong>Height:</strong> {{this.height}} decimeters</li>
            <li><strong>Weight:</strong> {{this.weight}} hectograms</li>
          </ul>
          <div><h3 v-if="pokeTypes.length<=1"> Type</h3>
              <h3 v-else>Types</h3>
            <ul  class="poketype">
              <li v-for="type in pokeTypes"  v-bind:class="type.type.name" :key="type.type.name">{{type.type.name}}</li>
            </ul>
          </div>
          <div><h3 v-if="pokeAbilities.length<=1">Ability</h3>
              <h3 v-else>Abilities</h3>
            <ul  class="pokestat">
              <li v-for="ability in pokeAbilities" :key="ability.ability.name">
                {{ability.ability.name}}
              </li>
            </ul>
          </div>

           <div><h3 v-if="pokeMoves.length<=1">Move</h3>
              <h3 v-else>Moves</h3>
            <ul  class="pokestat">
              <li v-for="move in pokeMoves" :key="move.move.name">
                {{move.move.name}}
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
import CardCarousel from '@/components/CardCarousel';

export default {
  name: "PokeData",
  
components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer,
    'card-carousel': CardCarousel
  },

  data() {
    return {
      pokeResults: null,
      cardResults: null,
      messages: [],
      showLoading: false,
      name: "",
      height: "unknown",
      weight: "unknown",
      pokemonURL: "//pokeapi.co/api/v2/pokemon/",
      pokeTypes: [],
      pokeAbilities: [],
      pokeMoves: [],
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
          this.pokeMoves = this.pokeResults.moves;
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

.column-2 {
  float: left;
  width: 50%;
}

.card-carousel {
  margin: 2rem 0;
}
.fixed-width-button {
  width: 300px;
}
.pokestat, .poketype {
  text-align: center;
  background-color: lightgoldenrodyellow;
  max-width: 700px;
  margin:auto;
  padding: 1rem 2rem;
}

.pokestat li {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  
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


</style>
