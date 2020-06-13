<template>
  <div>
    <h2>Pokémon Search</h2>


    <form v-on:submit.prevent="getPokemonEvolutions">
      <p>
        Enter Pokémon Name or National Pokédex Number:
        <input type="text" v-model="query" placeholder="Pancham or 674" />
        <button type="submit">Go</button>
      </p>
    </form>


    <load-spinner v-if="showLoading"></load-spinner>
    <div v-else class="container">
      <div class="messages">
        <message-container v-bind:messages="messages"></message-container>
      </div>
    <div  v-if="hasBasic" >
      <div class="row">
        <div class="col column-1">
          <span><img class="sprite-image" v-bind:src="spriteURL"> </span>
            <h2>#{{this.nationalPokedexNumber}}  {{this.name}} Evolutions</h2>
        </div>
      </div>
      
      <div class="row evolutions">
        <div class="col column-3 basic-column" >
          <h2> Base </h2>
          <ul class="pokedex" v-for="evo in basicPokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
            <li><card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
            </li>
          </ul>
        </div>

      <div v-if="hasStage1" class="col column-3 stage-1-column" >
        <h2> 1st Evolution </h2>
         <ul class="pokedex" v-for="evo in stage1PokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
            <li><card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
            </li>
          </ul>
      </div>
      <div v-else class="col column-3 stage-1-column">
        <h2>No Stage 1 Evolution</h2>
      </div>

      <div v-if="hasStage2" class="col column-3 stage-2-column">
        <h2> 2nd Evolution </h2>
          <ul class="pokedex" v-for="evo in stage2PokeEvos" :key="evo.pokedexNumber">
            <li><button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            </li>
            <li><card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
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
// import data from pokedata.js file
import axios from 'axios';
//import {PokeAPI} from '@/common/PokeAPI';
import CubeSpinner from '@/components/CubeSpinner';
import MessageContainer from '@/components/MessageContainer';
import CardImage from '@/components/CardImage';

export default {
  name: "PokeSearch",

  components: {
    'load-spinner': CubeSpinner,
    'message-container': MessageContainer,
    'card-image': CardImage
  },  
  data() {
    return {
      pokemonSpeciesURL: "//pokeapi.co/api/v2/pokemon-species/",
      pokemonSpeciesResults: null,
      evolutionChainURL: "https://pokeapi.co/api/v2/evolution-chain/",
      evolutionChainResults: null,
     
      messages: [],
      query: "", 

      
      showLoading: false,


//attributes for user requested Pokemon
      name: "",
      nationalPokedexNumber: "",
      evolutionChainId: "",
      spriteURL: "",

//variables for holding evolution data
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
      this.getPokemonEvolutions();
    }
  },

  methods: {
    
    getPokemonEvolutions: function() {
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
    

      console.log("called getPokemonEvolutions with " + this.query);
      if (this.query===''){
        this.messages.push({
          type: 'error',
          text: "Please enter a Pokémon name or National Pokédex Number.",
          
        });
      } else {
        this.showLoading = true;
        axios
          .get((this.pokemonSpeciesURL + this.query.toLowerCase()), {
            params: {
            }
          })
          .then(response => {
            
            this.hasBasic = true;
            this.pokemonSpeciesResults = response.data
            this.evolutionChainId = this.getIDFromURL(this.pokemonSpeciesResults.evolution_chain.url)
            this.name = this.pokemonSpeciesResults.name;
            this.nationalPokedexNumber= this.pokemonSpeciesResults.id;
            this.getSprite(this.nationalPokedexNumber);
            console.log("evolution chain is " + this.evolutionChainURL);
            this.getEvolutionChain();
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
    },

    getEvolutionChain: function() {
      axios
        .get(this.evolutionChainURL + this.evolutionChainId, {})
        .then(response => {
          this.evolutionChainResults = response.data;
          this.evolutionChainId = this.evolutionChainResults.id;
          let species = this.evolutionChainResults.chain.species.name;
          let pokedexNumber = this.getIDFromURL(this.evolutionChainResults.chain.species.url);
          console.log("inside getEvolutionChain before calling getPokemonCards for " + species);
          let pokeEvo = {
            level: 0,
            species: species,
            pokedexNumber: pokedexNumber
          };
          this.basicPokeEvos.push(pokeEvo);
          console.log(
            "next evolvesTo is " + this.evolutionChainResults.chain.evolves_to
          );
          this.getEvolutions(1, this.evolutionChainResults.chain.evolves_to);
         this.showLoading = false;
        })
        
        .catch(error => {
        this.messages.push({
          type: 'error',
          text: error.message
        });
      });
    },

    getEvolutions: function(evoLevel, evoArray) {
      console.log(
        "called getEvolutions with level " +
          evoLevel +
          " and evolvesTo Array " +
          evoArray
      );
        let pokeEvo= null;
      console.log("evo array length is " + evoArray.length);
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
        console.log("added " + evoArray[i].species.name + " to pokeEvos");
        this.getEvolutions(evoLevel + 1, evoArray[i].evolves_to);
      }
    },
getSprite: function(id){
   this.pokemonURL = "//pokeapi.co/api/v2/pokemon/" + id
     console.log("called Pokemon.vue getting poke data with URL: " + this.pokemonURL);
      axios
        .get((this.pokemonURL), {
          params: {
          }
        })
        .then(response => {
          this.pokeResults = response.data;
          this.spriteURL = this.pokeResults.sprites.front_default;
        })
        .catch(error => {
          this.messages.push({
            type: 'error',
            text: error.message
          });
       
      });
},
// takes a URL in this form https://pokeapi.co/api/v2/evolution-chain/18/ and returns the id, 18 in this case
    getIDFromURL: function(url){
      if (url) {
        let urlArray = url.split('');
        urlArray.pop();
        let idStart = urlArray.lastIndexOf('/');
        console.log("urlArray: " + urlArray + " has length " + urlArray.length + "and idStart of " + idStart);
        return urlArray.splice(idStart+1,urlArray.length).join('');
      } else {
        return url;
      }
    }
  }
   
};
  
</script>

<style>
body {
  font-family: sans-serif;
  background-color: white;
}

.evolutions {
  border: 3px solid #c7a008;
  box-shadow: 2px 2px 8px 5px #c7a008;
}
.column-1 {
  float: left;
  width: 100%;
}

.column-3 {
  float: left;
  width: 33.33%;
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
/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
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

ul {
  list-style-type: none;
  padding: 0px;
}

.pokedex {
  border-top: 2px solid #3c5aa6;
  padding-bottom: 1rem;
 
}


h2,
h3 {
  font-family: sans-serif;
  text-align: center;
  text-transform: uppercase;
}

.sprite-image {
  display: block;
  margin-left: auto;
  margin-right: auto;
}


</style>
