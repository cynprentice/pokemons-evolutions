<template>
  <div class="evolutions about">
    <h2>What is Pokémon Evolutions?</h2>
    <p>
      Pokémon Evolutions allows you to search for Pokémon evolutions based on a Pokémon name or National Pokédex Number. If you click on any of the evolution results, you can see more information about that Pokémon along with a carousel of its cards!</p>

    <p>It is a single page application built with Vue.js for the Spring 2020 "Building Javascript Applications for the Web" course at Seattle University.</p>
    <h2>Where does the data come from?</h2>

    <p>The data is sourced from 2 locations:</p>
    <ol>
      <li>
        Pokémon Evolution data comes from the
        <a href="https://pokeapi.co/" target="_blank">PokéAPI</a>
      </li>
      <li>
        Pokémon Card data comes from the
        <a
          href="https://pokemontcg.io/"
          target="_blank"
        >Pokémon TCG API</a>
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