<template>
  <div>
    <h2>Pokémon Search</h2>
     <div class="messages">
      <message-container v-bind:messages="messages"></message-container>
    </div>
    <form v-on:submit.prevent="getPokemonEvolutions">
      <p>
        Enter Pokemon Name or National Pokedex Number:
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
        <div class="col column-3">
          <h2> Basic </h2>
          <div  v-for="evo in basicPokeEvos" :key="evo.species">
            <h3>{{evo.species}} </h3>
            <div class="card">
               <card-image v-bind:name="evo.species"></card-image>
                        <!-- create a link to pokemon details page for each pokemon  -->
              <p><router-link v-bind:to="{ name: 'Pokemon', params: { name: evo.species } }">View {{evo.species}} Details</router-link></p>
            
          </div>  
         </div>
         </div>

        <div class="col column-3" v-if="hasStage1">
          <h2> Stage 1 </h2>
          <div  v-for="evo in stage1PokeEvos"  :key="evo.species">
            <h3>{{evo.species}} </h3>
             <card-image v-bind:name="evo.species"></card-image>
            <p><router-link v-bind:to="{ name: 'Pokemon', params: { name: evo.species } }">View  {{evo.species}} Details</router-link></p>
          </div> 
        </div>

        <div class="col column-3" v-if="hasStage2">
          <h2> Stage 2 </h2>
          <div  v-for="evo in stage2PokeEvos"  :key="evo.species">
            <h3>{{evo.species}} </h3>
            <card-image v-bind:name="evo.species"></card-image>
           <p><router-link v-bind:to="{ name: 'Pokemon', params: { name: evo.species } }">View  {{evo.species}} Details</router-link></p>
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
      pokeResults: null,
      messages: [],
      query: "", 
      evolutionChainURL: "",
      evolutionChain: null,
      
      basicPokeEvos:[],
      stage1PokeEvos: [],
      hasStage1: false,
      stage2PokeEvos: [],
      hasStage2: false,
      otherPokeEvos:[],
      showLoading: false,


      name: "",
      nationalPokedexNumber: "",
      height: 0,
      weight: 0,
      pokemonURL: "//pokeapi.co/api/v2/pokemon/",
      pokemonSpeciesURL: "//pokeapi.co/api/v2/pokemon-species/",
      pokeTypes: [],
      pokeAbilities: [],
      cards: [],
      pokeEvos: [],

      
    };
  },

  methods: {
    
    getPokemonEvolutions: function() {
     //reset data
      this.evolutionChainURL = "";
      this.evolutionChain = null;
      this.basicPokeEvos = [];
      this.stage1PokeEvos = [];
      this.stage2PokeEvos = [];
      this.otherPokeEvos = [];
      this.hasStage1 = false;
      this.hasStage2 = false;
   

      console.log("called getPokemonEvolutions with " + this.query);
      if (this.query===''){
        this.messages.push({
          type: 'error',
          text: "Please enter a Pokémon name or National Pokédex Number."
        });
      } else {
        this.showLoading = true;
        this.pokemonSpeciesURL = "//pokeapi.co/api/v2/pokemon-species/";
        axios
          .get((this.pokemonSpeciesURL += this.query), {
            params: {
              // q: this.query
            }
          })
          .then(response => {
            this.evolutionChainURL = response.data.evolution_chain.url;
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
        .get(this.evolutionChainURL, {})
        .then(response => {
          this.evolutionChain = response.data;
          let species = this.evolutionChain.chain.species.name;
          console.log("inside getEvolutionChain before calling getPokemonCards for " + species);
          let pokeEvo = {
            level: 0,
            species: species,
          };
          this.basicPokeEvos.push(pokeEvo);
          console.log(
            "next evolvesTo is " + this.evolutionChain.chain.evolves_to
          );
          this.getEvolutions(1, this.evolutionChain.chain.evolves_to);
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
        pokeEvo = { level: evoLevel, species: evoArray[i].species.name };
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

.column-3 {
  border: 2px solid blue;
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
