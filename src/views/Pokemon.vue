<template>
  <div>
     <h2>{{this.$route.params.pokedexNumber}}: {{this.name}} Details</h2>
    <button type="button" class="button  fixed-width-button"><h3>
     <router-link v-bind:to="{ name: 'Evolutions', params: { pokedexNumber: $route.params.pokedexNumber } }">View Evolution Chain</router-link>
    </h3> </button>
   
    <div class="container">

      <div class="row">
        <div class="column-1"> </div>
      </div>
      <div class="row">
        <!-- Add Image Carousel for Pokemon cards -->
        <div class="column-2">
          <load-spinner v-if="showLoading"></load-spinner>
          <card-carousel class="card-carousel" v-bind:pokedexNumber="$route.params.pokedexNumber"></card-carousel>
        </div>

      <!--Column for Pokemon Information -->
        <div class="column-2">
          <div v-if="messages.length > 0" class="messages">
            <message-container v-bind:messages="messages"></message-container>
          </div>
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
    </div>
  </div>
</template>

<script>

// import data from pokedata.js file
import axios from "axios";
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';
import CardCarousel from '@/components/CardCarousel';
import { pokemonURL } from '@/common/URL.js';

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
      messages: [],
      showLoading: false,
      name: "",
      height: "unknown",
      weight: "unknown",
      pokeTypes: [],
      pokeAbilities: [],
      pokeMoves: [],
      
    };
  },

created () {    
    console.log("called Pokemon.vue getting Poke data for: " + this.$route.params.pokedexNumber);
    this.showLoading = true;
    let cacheLabel = 'pokemon_' + this.$route.params.pokedexNumber;
    let cacheExpiry = 15 * 60 * 1000; // 15 minutes
    
    if (this.$ls.get(cacheLabel)){
      console.log('Pokemon.vue Pokemon cached query detected.');
      this.pokeResults = this.$ls.get(cacheLabel);
      this.setPokemonData();
      this.showLoading = false;
    } else {
      console.log('No pokemon cache available. Making API request.');
      axios
        .get((pokemonURL +  this.$route.params.pokedexNumber ), {
          params: {
          }
        })
        .then(response => {
          try {
            this.$ls.set(cacheLabel, response.data, cacheExpiry);
            console.log('New query has been cached as: ' + cacheLabel);
          } catch (domException) {
              if (['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'].includes(domException.name)) {
                console.log("cache full. " + cacheLabel + " not cached");
              }
          }
          this.pokeResults = response.data;
          this.setPokemonData();
          this.showLoading = false; 
        })
        .catch(error => {
          this.messages.push({
            type: 'error',
            text: "Error retrieving Pokémon data: " + error.message
          });
          this.showLoading = false; 
      });
     }
    },
    
  methods: {

    setPokemonData: function() {
      this.name = this.pokeResults.name;
      this.height = this.pokeResults.height;
      this.weight = this.pokeResults.weight;
      this.pokeTypes = this.pokeResults.types;
      this.pokeMoves = this.pokeResults.moves;
      this.pokeAbilities = this.pokeResults.abilities;  
    }
  }
}
  
</script>

<style>

.column-2 {
  float: left;
  width: 40%;
  padding: 2rem;
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
