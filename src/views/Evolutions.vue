<template>
  <div>
    <h2>Pokémon Search</h2>
    <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>

    <form v-on:submit.prevent="getPokemonEvolutions">
      <p>
        Enter Pokémon Name or National Pokédex Number:
        <input type="text" v-model="query" placeholder="Pancham" />
        <button type="submit">Go</button>
      </p>
    </form>

     <load-spinner v-if="showLoading"></load-spinner>
    <div class="container">

      <div class="row">
        <div class="col column-1"> <h2>{{this.nationalPokedexNumber}} {{this.name}} Evolutions</h2> </div>
      </div>
      
      <div class="row">
        <div class="col column-3 basic-column" v-if="hasBasic">
          <h2> Basic </h2>
          <div  v-for="evo in basicPokeEvos" :key="evo.pokedexNumber">
           <button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            <div class="card">
               <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
                        <!-- create a link to pokemon details page for each pokemon  -->
              <p></p>
            
          </div>  
         </div>
         </div>

        <div class="col column-3 stage-1-column" v-if="hasStage1">
          <h2> Stage 1 </h2>
          <div  v-for="evo in stage1PokeEvos"  :key="evo.pokedexNumber">
            <button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
             <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
          </div> 
        </div>

        <div class="col column-3 stage-2-column" v-if="hasStage2">
          <h2> Stage 2 </h2>
          <div  v-for="evo in stage2PokeEvos"  :key="evo.pokedexNumber">
           <button type="button" class="button"> <h3><router-link v-bind:to="{ name: 'Pokemon', params: { pokedexNumber: evo.pokedexNumber } }">{{evo.pokedexNumber}}: {{evo.species}}</router-link></h3> </button>
            <card-image v-bind:pokedexNumber="evo.pokedexNumber"></card-image>
          </div> 
        </div>
          
      </div><!--end card row -->
      
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
      
     // pokemonURL: "//pokeapi.co/api/v2/pokemon/",
     // pokeResults: null,
      
      showLoading: false,


//attributes for user requested Pokemon
      name: "",
      nationalPokedexNumber: "",
      evolutionChainId: "",

//variables for holding evolution data
      basicPokeEvos:[],
      hasBasic: false,
      stage1PokeEvos: [],
      hasStage1: false,
      stage2PokeEvos: [],
      hasStage2: false,
      otherPokeEvos:[],

/*attributes of user entered Pokemon
      height: 0,
      weight: 0,

      pokeTypes: [],
      pokeAbilities: [],
      cards: [],
      pokeEvos: [],
*/
      
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
   

      console.log("called getPokemonEvolutions with " + this.query);
      if (this.query===''){
        this.messages.push({
          type: 'error',
          text: "Please enter a Pokémon name or National Pokédex Number."
        });
      } else {
        this.showLoading = true;
        axios
          .get((this.pokemonSpeciesURL + this.query), {
            params: {
              // q: this.query
            }
          })
          .then(response => {
            this.hasBasic = true;
            this.pokemonSpeciesResults = response.data
           // this.evolutionChainURL = this.pokemonSpeciesResults.evolution_chain.url;
            this.evolutionChainId = this.getIDFromURL(this.pokemonSpeciesResults.evolution_chain.url)
           // this.evolutionChainURL = this.evolutionChainURL + this.evolutionChainId;
            this.name = this.pokemonSpeciesResults.name;
            this.nationalPokedexNumber= this.pokemonSpeciesResults.id;
            console.log("evolution chain is " + this.evolutionChainURL);
            this.getEvolutionChain();
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

.column-1 {
  float: left;
  width: 100%;
}

.column-3 {
    float: left;
  width: 32%;
}


.basic-column {
  background-color: lightpink;
}

.stage-1-column {
  background-color: lightblue
}

.stage-2-column {
  background-color: lightgreen;
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
  background-color: white;
  color: black;
  border: 2px solid black;
  display: block;
    margin-left: auto;
    margin-right: auto;
    width: 90%;
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
