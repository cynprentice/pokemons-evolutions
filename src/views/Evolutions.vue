<template>
  <div>
    <h2>Pokémon Search</h2>

    <form class="form" v-on:submit.prevent="getPokemonSpeciesData">
      <p>
        Enter Pokémon Name or National Pokédex Number:
        <input type="text" v-model="query" placeholder="Wurmple or 265" />
        <button type="submit">Go</button>
      </p>
    </form>


    <load-spinner v-if="showLoading"></load-spinner>
    <div v-else class="container">
      <div v-if="messages.length > 0" class="messages">
        <message-container v-bind:messages="messages"></message-container>
      </div>

      <!-- If user query has results, show matching pokemon and sprite here -->
    <div  v-if="hasBasic" >
      <div class="row">
        <div class="column-1">
          <span><img class="sprite-image" v-bind:src="spriteURL"> </span>
            <h2>#{{this.nationalPokedexNumber}}  {{this.name}} Evolutions</h2>
        </div>
      </div>
      
      <!-- Show evolutions here -->
      <div class="row evolutions">
        <div class="column-3 basic-column" >
          <h2> Base </h2>
          <ul class="pokedex" v-for="evo in basicPokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3>
              <router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
            <li><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">
              <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
              </router-link>
            </li>
          </ul>
        </div>

      <div v-if="hasStage1" class="column-3 stage-1-column" >
        <h2> 1st Evolution </h2>
         <ul class="pokedex" v-for="evo in stage1PokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
            <li><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">
              <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
              </router-link>
            </li>
          </ul>
      </div>
      <div v-else class="column-3 stage-1-column">
        <h2>No Stage 1 Evolution</h2>
      </div>

      <div v-if="hasStage2" class="column-3 stage-2-column">
        <h2> 2nd Evolution </h2>
          <ul class="pokedex" v-for="evo in stage2PokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
              <li><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">
              <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
              </router-link>
            </li>
          </ul>
      </div>
      <div v-else class="col column-3 stage-2-column">
        <h2>No Stage 2 Evolution</h2>
        </div>  
      </div><!--end card row -->
      </div>
    </div>
  </div>

</template>

<script>

import axios from 'axios';
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';
import CardImage from '@/components/CardImage';
//import URLs
import { pokemonSpeciesURL } from '@/common/URL.js';
import { evolutionChainURL } from '@/common/URL.js';
import { pokemonURL } from '@/common/URL.js';

export default {
  name: "PokeSearch",

  components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer,
    'card-image': CardImage
  },  
  data() {
    return {
      //For API calls
      pokemonSpeciesResults: null,
      evolutionChainResults: null,
      pokeResults: null,
      messages: [],
      query: "",   
      showLoading: false,

      //attributes for user requested Pokemon
      name: "",
      nationalPokedexNumber: "",
      evolutionChainId: "",
      spriteURL: "",

      //For holding evolution data
      basicPokeEvos:[],
      hasBasic: false,
      stage1PokeEvos: [],
      hasStage1: false,
      stage2PokeEvos: [],
      hasStage2: false,
      otherPokeEvos:[]
    };
  },

  created () {
    if (this.$route.params.pokedexNumber){
      this.query = this.$route.params.pokedexNumber
      this.getPokemonSpeciesData();
    }
  },

  methods: {

    //make API call to get Pokemon Species data based on user request and kick off evolution data requests
    getPokemonSpeciesData: function() {
     //reset data
      this.evolutionChain = null;
      this.basicPokeEvos = [];
      this.stage1PokeEvos = [];
      this.stage2PokeEvos = [];
      this.otherPokeEvos = [];
      this.hasBasic = false;
      this.hasStage1 = false;
      this.hasStage2 = false;
      this.nationalPokedexNumber = "";
      this.name = "";
      this.spriteURL = "";
      this.messages =[];

      //console.log("******called getPokemonSpeciesData with " + this.query);
      if (this.query===''){
        this.messages.push({
          type: 'error',
          text: "Please enter a Pokémon name or National Pokédex Number.", 
        });
      } else {
          this.showLoading = true;
          let cacheLabel = 'pokeSpecies_' + this.query;
          let cacheExpiry = 15 * 60 * 1000; // 15 minutes    
          if (this.$ls.get(cacheLabel)){
            console.log('pokeSpecies cached query detected.');
            this.pokemonSpeciesResults = this.$ls.get(cacheLabel);
            this.setPokemonSpecies();
            this.showLoading = false;
          } else {
            console.log('No pokeSpecies cache available. Making API request.');
            axios
            .get((pokemonSpeciesURL + this.query.toLowerCase()), {
              params: {
              }
             })
            .then(response => {           
              this.$ls.set(cacheLabel, response.data, cacheExpiry);
              console.log('New query has been cached as: ' + cacheLabel);
              this.pokemonSpeciesResults = response.data
              this.setPokemonSpecies();
              this.showLoading = false;
            })
            .catch(error => {
              let errorMessage = error.message;
              if(errorMessage.includes("404")){
                errorMessage = 'Your entry of "' + this.query + '" did not return any results. Please try again.'; 
              }
             this.messages.push({
              type: 'error',
              text: errorMessage,
              });
             this.showLoading = false;
            });
          }
      }
    },

    //Set attributes based in pokeSpeciesData and get kick off evolution chain data call
    setPokemonSpecies: function() {
      this.hasBasic = true;
      this.evolutionChainId = this.getIDFromURL(this.pokemonSpeciesResults.evolution_chain.url)
      this.name = this.pokemonSpeciesResults.name;
      this.nationalPokedexNumber= this.pokemonSpeciesResults.id;
      this.getSprite(this.nationalPokedexNumber);
      this.getEvolutionChainData();
    },

    //make API call to get evolution chain data
    getEvolutionChainData: function() {
      let cacheLabel = 'evolutionChain_' + this.query;
      let cacheExpiry = 15 * 60 * 1000; // 15 minutes
      
      if (this.$ls.get(cacheLabel)){
        console.log('evolutionChain cached query detected.');
        this.evolutionChainResults = this.$ls.get(cacheLabel);
        this.setEvolutionChain();
        this.showLoading = false;        
      } else {
      console.log('No evolutionChain cache available. Making API request.');
        axios
          .get(evolutionChainURL + this.evolutionChainId, {})
          .then(response => {
            this.$ls.set(cacheLabel, response.data, cacheExpiry);
            console.log('New query has been cached as: ' + cacheLabel);
            this.evolutionChainResults = response.data;
            this.setEvolutionChain();
            this.showLoading = false;
          })
        .catch(error => {
          this.messages.push({
          type: 'error',
          text: "Error retrieving evolution chain: " + error.message
        });
         this.showLoading = false;
       });
      }
    },

    //set base pokemon data and look for evolutions
    setEvolutionChain: function() {
      this.evolutionChainId = this.evolutionChainResults.id;
      let species = this.evolutionChainResults.chain.species.name;
      let pokedexNumber = this.getIDFromURL(this.evolutionChainResults.chain.species.url);
      let pokeEvo = {
        level: 0,
        species: species,
        pokedexNumber: pokedexNumber
      };
      this.basicPokeEvos.push(pokeEvo);
      //console.log("next evolvesTo is " + this.evolutionChainResults.chain.evolves_to);
      this.setEvolutions(1, this.evolutionChainResults.chain.evolves_to);
    },

  //loop through evolution data to store level 1 and level 2 evolutions
    setEvolutions: function(evoLevel, evoArray) {
      //console.log("called getEvolutions with level " + evoLevel + " and evolvesTo Array " + evoArray);
        let pokeEvo= null;
      //console.log("evo array length is " + evoArray.length);
      for (let i = 0; i < evoArray.length; i++) {
        pokeEvo = { level: evoLevel, species: evoArray[i].species.name, pokedexNumber: this.getIDFromURL(evoArray[i].species.url) };
        if(evoLevel==1){
          this.hasStage1 = true;
          this.stage1PokeEvos.push(pokeEvo);
        } else if (evoLevel==2){
          this.hasStage2 = true;
          this.stage2PokeEvos.push(pokeEvo);
        } else {
          this.otherPokeEvos.push(pokeEvo);
        }
        //console.log("added " + evoArray[i].species.name + " to pokeEvos");
        this.setEvolutions(evoLevel + 1, evoArray[i].evolves_to);
      }
    },

    //Takes a National Pokedex number, retrieves Pokemon data and SpriteURL
    getSprite: function(id){
     this.showLoading = true;
     let cacheLabel = 'pokemon_' + id;
     let cacheExpiry = 15 * 60 * 1000; // 15 minutes

     if (this.$ls.get(cacheLabel)){
      console.log('pokemon cached query detected.');
      this.pokeResults = this.$ls.get(cacheLabel);
      this.spriteURL = this.pokeResults.sprites.front_default;
      this.showLoading = false;
     } else {
      console.log('No pokemon cache available. Making API request.');
      axios
        .get((pokemonURL +  id), {
          params: {
          }
        })
        .then(response => {
          this.$ls.set(cacheLabel, response.data, cacheExpiry);
          console.log('New query has been cached as: ' + cacheLabel);
          this.pokeResults = response.data;
          this.spriteURL = this.pokeResults.sprites.front_default;
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
// takes a URL in this form https://pokeapi.co/api/v2/evolution-chain/18/ and returns the id, 18 in this case
    getIDFromURL: function(url){
      if (url) {
        let urlArray = url.split('');
        urlArray.pop();
        let idStart = urlArray.lastIndexOf('/');
        //console.log("urlArray: " + urlArray + " has length " + urlArray.length + "and idStart of " + idStart);
        return urlArray.splice(idStart+1,urlArray.length).join('');
      } else {
        return url;
      }
    }
  }
   
};
  
</script>

<style>

.evolutions {
  border: 3px solid #c7a008;
  box-shadow: 2px 2px 8px 5px #c7a008;
}
.evolutions {
  background-color: lightgoldenrodyellow;
}

.basic-column {
  background-color: lightgoldenrodyellow;
}

.stage-1-column {
  background-color: #ffcb05
}

.stage-2-column {
  background-color: #2a75bb;
}



/* Style buttons */
.button {
  border-radius: 8px;
    color: #3c5aa6;
    background-color: #FFF;
    border: 2px solid #3c5aa6;
    display: block;
    width: 80%;
    margin: .5rem auto;
}

.button a {
  text-decoration: none;
}

.button a {
  color: #3c5aa6;
}

.button a:visited {
    color: #3c5aa6;
}



.pokedex {
  border-top: 2px solid #3c5aa6;
  padding-bottom: 1rem;
 
}

.sprite-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
}


</style>
