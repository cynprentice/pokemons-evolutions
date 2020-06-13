<template>
  <div class="evolutions about">
    <h2>What is Pokémon Evolutions?</h2>
    <p>It is a single page application built with Vue.js for the Spring 2020 "Building Javascript Applications for the Web" course at Seattle University.</p>
    <p>Pokémon Evolutions allows users to search from Pokémon information based on a user entered Pokémon name or National Pokédex Number. 
        The application first results all the evolutions associated with the Pokémon. Users can then further explore data for each of the evolutions.</p>
    <h2>Where does the data come from?</h2>
    <p>The data is sourced from 2 locations:</p>
    <ol>
      <li>
        Pokémon Evolution data comes from the
        <a href="https://pokeapi.co/" target="_blank">PokéAPI</a>
      </li>
      <li>
        Pokémon Card data comes from the
        <a href="https://pokemontcg.io/" target="_blank">Pokémon TCG API</a>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.about {
  margin: 2rem;
  padding: 2rem;
}
</style>