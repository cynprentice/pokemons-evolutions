npm <template>
  <div>
    <h2>Pokémon Evolutions</h2>
    
  <form v-on:submit.prevent="getPokemonCards">
    <p>
      Enter Pokemon name:
      <input type="text" v-model="query" placeholder="Pancham" />
      <button type="submit">Go</button>
    </p>
  </form>
    
    <form v-on:submit.prevent="getPokemonData">
      <p>
        Enter Pokemon name or id:
        <input type="text" v-model="query" placeholder="Pancham" />
        <button type="submit">Go</button>
      </p>
    </form>
    <div class="container">
      <div class="row">
        <div class="col-1"> <h2>{{this.name}}</h2> </div>
      </div>
      <div class="row">
        <div class="col col-2"> <div class="card"> <img src="https://images.pokemontcg.io/ex6/55.png"> </div> </div>
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
      <div class="row">
        <div class="col col-3">
          <!--
          <h2> Basic </h2>
          <div  v-for="evos in in pokeEvos.types" v-bind:class="row" :key="evo.species.name">{{type}}>
            -->
          <h3>Bulbasaur </h3>
              <div class="card"><img src="https://images.pokemontcg.io/ex6/55.png"></div>
        </div>
        <div class="col col-3">
          <h3>IvySaur </h3>
              <div class="card"><img src="https://images.pokemontcg.io/base1/30.png"></div>
        </div>
        <div class="col col-3">
          <h3>Venusaur </h3>
              <div class="card"><img src="https://images.pokemontcg.io/bw5/3.png"></div>
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

export default {
  name: "PokeSearch",
  data() {
    return {
      pokeResults: null,
      errors: [],
      query: "",
      cards: [],
      name,
      height: 111,
      weight: 222,
      pokemonURL: "//pokeapi.co/api/v2/pokemon/",
      pokemonSpeciesURL: "//pokeapi.co/api/v2/pokemon-species/",
      pokeTypes: [],
      pokeAbilities: [],
      evolutionChainURL: "",
      evolutionChain: null,
      pokeEvo: null,
      pokeEvos: []
    };
  },

  methods: {
    getPokemonData: function() {
      // this.pokemonURL += this.query;
      console.log("called getPokemonData with " + this.pokemonURL);
      this.getPokemonSpecies();
      this.pokemonURL = "//pokeapi.co/api/v2/pokemon/";
      axios
        .get((this.pokemonURL += this.query), {
          params: {
            // q: this.query
          }
        })
        .then(response => {
          this.pokeResults = response.data;
          this.name = this.pokeResults.name;
          this.height = this.pokeResults.height;
          this.weight = this.pokeResults.weight;
          this.pokeTypes = this.pokeResults.types;
          this.pokeAbilities = this.pokeResults.abilities;
        })
        .catch(error => {
          this.errors.push(error);
        });
    },
    getPokemonSpecies: function() {
      // this.pokemonURL += this.query;
      console.log("called getPokemonSpecies with " + this.pokemonURL);
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
        })
        .catch(error => {
          this.errors.push(error);
        });
    },

    getEvolutionChain: function() {
      axios
        .get(this.evolutionChainURL, {})
        .then(response => {
          this.evolutionChain = response.data;
          let evoPair = {
            level: 0,
            species: this.evolutionChain.chain.species.name
          };
          this.pokeEvos.push(evoPair);
          console.log(
            "next evolvesTo is " + this.evolutionChain.chain.evolves_to
          );
          this.getEvolutions(1, this.evolutionChain.chain.evolves_to);
        })
        .catch(error => {
          this.errors.push(error);
        });
    },

    getEvolutions: function(evoLevel, evoArray) {
      console.log(
        "called getEvolutions with level " +
          evoLevel +
          " and evolvesTo Array " +
          evoArray
      );
      let evoPair = null;
      console.log("evo array length is " + evoArray.length);
      for (let i = 0; i < evoArray.length; i++) {
        evoPair = { level: evoLevel, species: evoArray[i].species.name };
        this.pokeEvos.push(evoPair);
        console.log("added " + evoArray[i].species.name + " to pokeEvos");
        this.getEvolutions(evoLevel + 1, evoArray[i].evolves_to);
      }
    },

    getPokemonCards: function() {
      axios
        .get("https://pokemontcg.io/v1/cards", {
          params: {
            name: this.query
          }
        })
        .then(response => {
          this.cards = response.data;
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

.row {
  border: 2px solid green;
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
